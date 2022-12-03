import run from "aocrunner"
import Arr from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { Math, Parse } from "../utils/index.js"
import { splitChars } from "../utils/parse.js"

const getPriority = (char: string): number =>
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(char) + 1

const findSharedChar = (strings: string[][]) => {
  const [left, ...rights] = strings
  return left.find((char) => rights.every((r) => r.includes(char)))!
}

const part1 = flow(
  Parse.splitLines,
  Arr.map(
    flow(
      Parse.splitChars,
      (chars) => Arr.splitAt(chars.length / 2)(chars),
      findSharedChar,
      getPriority,
    ),
  ),
  Math.sum,
)

const part2 = flow(
  Parse.splitLines,
  Arr.map(splitChars),
  Arr.chunksOf(3),
  Arr.map(flow(findSharedChar, getPriority)),
  Math.sum,
)

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
