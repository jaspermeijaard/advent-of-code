import run from "aocrunner"
import { max, sum } from "../utils/math.js"
import { toNumber } from "../utils/parse.js"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n\n")
    .map((s) => s.split("\n").map(toNumber))
    .map(sum)

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return max(input)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return sum(input.sort((a, b) => a - b).slice(-3))
}

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
  trimTestInputs: false,
  onlyTests: false,
})
