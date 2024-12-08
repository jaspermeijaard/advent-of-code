import run from "aocrunner"
import A from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { max, min, sum } from "../utils/math.js"
import { split, splitLines, splitSpaces, toNumber } from "../utils/string.js"
import { log } from "../utils/debug.js"
import { match } from "assert"

const part1 = flow((s: string) => {
  const rgx = /mul\((\d{1,3}),(\d{1,3})\)/g
  return [...s.matchAll(rgx)]
    .map((m) => m.slice(1, 3).map((s) => +s))
    .map(([a, b]) => a * b)
}, sum)

const part2 = flow((s: string) => {
  const rgx = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g
  const matches = [...s.matchAll(rgx)]
  const results: number[] = []

  let enabled = true
  for (const match of matches) {
    if (match[0] === "don't()") {
      enabled = false
      continue
    }

    if (match[0] === "do()") {
      enabled = true
      continue
    }

    if (!enabled) {
      continue
    }

    results.push(+match[1] * +match[2])
  }
  return results
}, sum)

run({
  onlyTests: false,
  part1: {
    solution: part1,
    tests: [
      {
        expected: 161,
        input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
      },
    ],
  },
  part2: {
    solution: part2,
    tests: [
      {
        expected: 48,
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
      },
    ],
  },
})
