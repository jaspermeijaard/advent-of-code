import run from "aocrunner"
import { sort, takeRight, map } from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { Ord } from "fp-ts/lib/number.js"
import { max, sum } from "../utils/math.js"
import { splitLines, splitParagraphs, toNumber } from "../utils/parse.js"

const parse = flow(splitParagraphs, map(flow(splitLines, map(toNumber), sum)))

const part1 = flow(parse, max)

const part2 = flow(parse, sort(Ord), takeRight(3), sum)

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
