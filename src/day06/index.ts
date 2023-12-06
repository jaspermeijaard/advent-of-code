import run from "aocrunner"
import { flow, pipe } from "fp-ts/lib/function.js"
import { Math, String } from "../utils/index.js"
import A from "fp-ts/lib/Array.js"
import O from "fp-ts/lib/Option.js"
import S from "fp-ts/lib/String.js"

type Race = { time: number; dist: number }

const parseRaces = (kerning: boolean) =>
  flow(
    String.splitLines,
    A.map(
      flow(
        (l) => Array.from(l.match(/\d+/g)!),
        kerning
          ? flow(A.reduce(S.empty, S.Monoid.concat), String.toNumber, Array.of)
          : A.map(String.toNumber),
      ),
    ),
    (lines) =>
      A.makeBy<Race>(lines[0].length, (i) => ({
        time: lines[0][i],
        dist: lines[1][i],
      })),
  )

const race = ({ time, dist }: Race) => {
  const results = []
  for (let hold = 1; hold < time; hold++) {
    const timeLeft = time - hold
    const result = timeLeft * hold

    if (result > dist) {
      results.push(result)
    }
  }

  return results
}

const part1 = flow(parseRaces(false), A.map(race), A.map(A.size), Math.multiply)

const part2 = flow(parseRaces(true), A.head, O.match(Array, race), A.size)

const testInput = `
  Time:      7  15   30
  Distance:  9  40  200
`
run({
  onlyTests: true,
  part1: {
    solution: part1,
    tests: [
      {
        input: testInput,
        expected: 288,
      },
    ],
  },
  part2: {
    solution: part2,
    tests: [
      {
        input: testInput,
        expected: 71503,
      },
    ],
  },
})
