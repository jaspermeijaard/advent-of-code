import run from "aocrunner"
import Arr from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { Parse } from "../utils/index.js"

type Pair = [number, number]

const parseInput = flow(
  Parse.splitLines,
  Arr.map(
    flow(
      Parse.split(","),
      Arr.map<string, Pair>(
        flow(Parse.split("-"), ([l, r]) => [
          Parse.toNumber(l),
          Parse.toNumber(r),
        ]),
      ),
    ),
  ),
)

const pairContainsPair = ([l, r]: Pair[]): boolean =>
  (l[0] >= r[0] && l[1] <= r[1]) || (r[0] >= l[0] && r[1] <= l[1])

const pairsOverlapsPair = ([l, r]: Pair[]): boolean =>
  (l[0] >= r[0] && l[0] <= r[1]) || (r[0] >= l[0] && r[0] <= l[1])

const part1 = flow(
  parseInput,
  Arr.map(pairContainsPair),
  Arr.filter((b) => b),
  (arr) => arr.length,
)

const part2 = flow(
  parseInput,
  Arr.map(pairsOverlapsPair),
  Arr.filter((b) => b),
  (arr) => arr.length,
)

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
