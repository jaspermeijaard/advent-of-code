import run from "aocrunner"
import { flow } from "fp-ts/lib/function.js"
import { Math, String } from "../utils/index.js"
import Array from "fp-ts/lib/Array.js"

const words = new Map([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
])

const findFirstAndLast = (s: string) => {
  return [findFirst(s), findLast(s)]
}

const find = (s: string, patterns: string[]) => {
  return s.match(new RegExp(`\\d|${patterns.join("|")}`))![0]
}

const findFirst = (s: string) => {
  const match = find(s, [...words.keys()])
  return words.get(match) ?? match
}

const findLast = (s: string) => {
  const reversed = String.reverse(s)
  const search = [...words.keys()].map(String.reverse)
  const match = String.reverse(find(reversed, search))
  return words.get(match) ?? match
}

const solution = flow(
  String.splitLines,
  Array.map(flow(findFirstAndLast, String.join, String.toNumber)),
  Math.sum,
)

run({
  part1: {
    solution,
    tests: [
      {
        input: `
          1abc2
          pqr3stu8vwx
          a1b2c3d4e5f
          treb7uchet
        `,
        expected: 142,
      },
    ],
  },
  part2: {
    solution,
    tests: [
      {
        input: `
          two1nine
          eightwothree
          abcone2threexyz
          xtwone3four
          4nineeightseven2
          zoneight234
          7pqrstsixteen
        `,
        expected: 281,
      },
    ],
  },
})
