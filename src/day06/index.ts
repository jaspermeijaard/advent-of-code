import run from "aocrunner"
import { flow } from "fp-ts/lib/function.js"
import { Parse } from "../utils/index.js"

const findSequences = (size: number) => (arr: string[]) =>
  arr.reduce<number[]>(
    (matches, _, i, all) =>
      new Set(all.slice(i, i + size)).size === size
        ? [...matches, i + size]
        : matches,
    [],
  )

const part1 = flow(Parse.splitChars, findSequences(4), (a) => a.shift())
const part2 = flow(Parse.splitChars, findSequences(14), (a) => a.shift())

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
