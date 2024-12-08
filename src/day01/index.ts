import run from "aocrunner"
import A from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { max, min, sum } from "../utils/math.js"
import { split, splitLines, toNumber } from "../utils/string.js"
import { log } from "../utils/debug.js"

const part1 = flow(
  splitLines,
  A.map(flow(split("   "), A.map(toNumber))),
  (arr) => {
    const l = arr.map(([a, b]) => a).sort()
    const r = arr.map(([a, b]) => b).sort()
    return l.map((a, i) => [a, r[i]])
  },
  A.map((pair) => max(pair) - min(pair)),
  sum,
)

const part2 = flow(
  splitLines,
  A.map(flow(split("   "), A.map(toNumber))),
  (arr) => {
    const l = arr.map(([a, b]) => a)
    const r = arr.map(([a, b]) => b)
    const freqs = r.reduce<Record<number, number>>((rec, nr) => {
      rec[nr] = rec[nr] ? rec[nr] + 1 : 1
      return rec
    }, {})
    return l.map((nr) => nr * (freqs[nr] ?? 0))
  },
  sum,
)

run({
  part1: {
    solution: part1,
    tests: [
      {
        input: `
          3   4
          4   3
          2   5
          1   3
          3   9
          3   3
        `,
        expected: 11,
      },
    ],
  },
  part2: {
    solution: part2,
    tests: [
      {
        input: `
          3   4
          4   3
          2   5
          1   3
          3   9
          3   3
        `,
        expected: 31,
      },
    ],
  },
})
