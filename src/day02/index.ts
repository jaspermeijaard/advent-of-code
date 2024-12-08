import run from "aocrunner"
import A from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { max, min, sum } from "../utils/math.js"
import { split, splitLines, splitSpaces, toNumber } from "../utils/string.js"
import { log } from "../utils/debug.js"

const allIncr = (line: number[]) =>
  line.every((v, i, arr) => {
    if (!arr[i - 1]) {
      return true
    }

    const prev = arr[i - 1]
    const diff = v - prev
    return v > prev && diff > 0 && diff < 4
  })

const allDecr = (line: number[]) =>
  line.every((v, i, arr) => {
    if (!arr[i - 1]) {
      return true
    }

    const prev = arr[i - 1] ?? v
    const diff = prev - v
    return v < prev && diff > 0 && diff < 4
  })

const part1 = flow(
  splitLines,
  A.map(
    flow(
      splitSpaces,
      flow(A.map(toNumber), (line) => allIncr(line) || allDecr(line)),
    ),
  ),
  (bools) => bools.filter((b) => b).length,
)

const part2 = flow(
  splitLines,
  A.map(
    flow(
      splitSpaces,
      flow(A.map(toNumber), (line) => {
        const f1 = allIncr(line) || allDecr(line)

        if (f1) {
          return true
        }

        for (let i = 0; i < line.length; i++) {
          const l = [...line]
          l.splice(i, 1)

          const f2 = allIncr(l) || allDecr(l)

          if (f2) {
            return true
          }
        }

        return false
      }),
    ),
  ),
  (bools) => bools.filter((b) => b).length,
)

run({
  onlyTests: false,
  part1: {
    solution: part1,
    tests: [
      {
        expected: 2,
        input: `
          7 6 4 2 1
          1 2 7 8 9
          9 7 6 2 1
          1 3 2 4 5
          8 6 4 4 1
          1 3 6 7 9
        `,
      },
    ],
  },
  part2: {
    solution: part2,
    tests: [
      {
        expected: 4,
        input: `
          7 6 4 2 1
          1 2 7 8 9
          9 7 6 2 1
          1 3 2 4 5
          8 6 4 4 1
          1 3 6 7 9
        `,
      },
    ],
  },
})
