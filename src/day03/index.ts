import run from "aocrunner"
import Arr from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { Math, Parse } from "../utils/index.js"
import { splitChars } from "../utils/parse.js"

const getPriority = (char: string): number =>
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(char) + 1

const part1 = flow(
  Parse.splitLines,
  Arr.map(
    flow(
      Parse.splitChars,
      (chars) => Arr.splitAt(chars.length / 2)(chars),
      ([l, r]) => l.find((char) => r.includes(char))!,
      getPriority,
    ),
  ),
  Math.sum,
)

const part2 = flow(
  Parse.splitLines,
  Arr.map(splitChars),
  Arr.chunksOf(3),
  Arr.map(
    flow(
      ([fst, snd, thi]) =>
        fst.find((char) => snd.includes(char) && thi.includes(char))!,
      getPriority,
    ),
  ),
  Math.sum,
)

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
