import run from "aocrunner"
import Arr from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { Parse } from "../utils/index.js"

const parseMoves = flow(
  Parse.splitLines,
  Arr.map((raw: string) => {
    const [count, from, to] = raw.match(/(\d+)/g) as string[]
    return {
      count: Parse.toNumber(count),
      from: Parse.toNumber(from) - 1,
      to: Parse.toNumber(to) - 1,
    }
  }),
)

const parseStacks = flow(Parse.splitLines, (lines) =>
  [...lines.pop()!.matchAll(/(\d+)/g)]
    .map((match) => match.index!)
    .map((index) => lines.map((l) => l.at(index)!).reverse())
    .map((s) => s.filter((s) => !!s?.trim())),
)

const parseInput = flow(Parse.splitParagraphs, ([rawStacks, rawMoves]) => ({
  stacks: parseStacks(rawStacks),
  moves: parseMoves(rawMoves),
}))

const runMoves = (reverse: boolean) =>
  flow(
    parseInput,
    ({ stacks, moves }) => {
      const result = [...stacks]
      for (const { count, from, to } of moves) {
        const containers = [...result[from].splice(-count)]
        result[to].push(...(reverse ? containers.reverse() : containers))
      }

      return result
    },
    Arr.map((s) => s.pop()),
    (s) => s.join(""),
  )

const part1 = runMoves(false)
const part2 = runMoves(true)

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
