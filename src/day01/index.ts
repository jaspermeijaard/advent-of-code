import run from "aocrunner"
import Arr from "fp-ts/lib/Array.js"
import Num from "fp-ts/lib/number.js"
import { flow } from "fp-ts/lib/function.js"
import { Math, Parse } from "../utils/index.js"

const parseInput = flow(
  Parse.splitParagraphs,
  Arr.map(flow(Parse.splitLines, Arr.map(Parse.toNumber), Math.sum)),
)

const part1 = flow(parseInput, Math.max)

const part2 = flow(parseInput, Arr.sort(Num.Ord), Arr.takeRight(3), Math.sum)

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
