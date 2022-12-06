import run from "aocrunner"
import { flow } from "fp-ts/lib/function.js"
import { Parse } from "../utils/index.js"

const findLetterSequence = (size: number) => (arr: string[]) =>
  arr.reduce<number[]>((matches, _, i, all) => {
    const slice = all.slice(Math.max(0, i), Math.min(i + size, all.length))
    return slice.length === size && new Set(slice).size === slice.length
      ? [...matches, i + size]
      : matches
  }, [])

const part1 = flow(Parse.splitChars, findLetterSequence(4), (a) => a.shift())
const part2 = flow(Parse.splitChars, findLetterSequence(14), (a) => a.shift())

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
