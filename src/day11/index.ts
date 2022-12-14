import run from "aocrunner"
import A from "fp-ts/lib/Array.js"
import N from "fp-ts/lib/number.js"
import { flow } from "fp-ts/lib/function.js"
import { sum, multiply } from "../utils/math.js"
import { split, splitLines, splitParagraphs, toNumber } from "../utils/parse.js"

type Monkey = {
  items: number[]
  operation: (old: number) => number
  to: (old: number) => number
  inspected: number
  divisor: number
}

const parseInput = flow(
  splitParagraphs,
  A.map<string, Monkey>(
    flow(splitLines, (lines) => {
      lines.shift()
      const items = A.map(toNumber)(split(":")(lines[0])[1].match(/\d+/g)!)
      const operation = (old: number) => {
        const [op, val] = lines[1].match(/\W\s+(\d+|old)$/g)![0].split(" ")
        const values = [old, val === "old" ? old : toNumber(val)]
        return op === "+" ? sum(values) : multiply(values)
      }
      const divisor = toNumber(lines[2].match(/\d+/g)![0])
      const to = (old: number) =>
        old % divisor === 0
          ? toNumber(lines[3].match(/\d+/g)![0])
          : toNumber(lines[4].match(/\d+/g)![0])

      return { items, operation, to, inspected: 0, divisor }
    }),
  ),
)

const runRounds =
  (rounds: number, alter: (level: number) => number) =>
  (monkeys: Monkey[]): Monkey[] => {
    const denominator = monkeys.map((m) => m.divisor).reduce((a, b) => a * b)
    for (let round = 0; round < rounds; round++) {
      for (let m = 0; m < monkeys.length; m++) {
        const monkey = monkeys[m]
        monkey.items.forEach((item) => {
          const level = alter(monkey.operation(item)) % denominator
          monkeys[monkey.to(level)].items.push(level)
        })
        monkey.inspected += monkey.items.length
        monkey.items = []
      }
    }
    return monkeys
  }

const part1 = flow(
  parseInput,
  runRounds(20, (lvl) => Math.floor(lvl / 3)),
  A.map((m) => m.inspected),
  A.sort(N.Ord),
  A.takeRight(2),
  multiply,
)

const part2 = flow(
  parseInput,
  runRounds(10000, (lvl) => lvl),
  A.map((m) => m.inspected),
  A.sort(N.Ord),
  A.takeRight(2),
  multiply,
)

run({
  onlyTests: false,
  part1: { solution: part1 },
  part2: { solution: part2 },
})
