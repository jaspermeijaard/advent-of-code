import run from "aocrunner"
import Arr from "fp-ts/lib/Array.js"
import { flow, pipe } from "fp-ts/lib/function.js"
import { uniq } from "fp-ts/lib/ReadonlyNonEmptyArray.js"
import _ from "lodash"
import { Parse, Math } from "../utils/index.js"

type Move = "U" | "R" | "D" | "L"

type Pos = {
  x: number
  y: number
}

const MOVE: Record<Move, Pos> = {
  U: { x: 0, y: -1 },
  R: { x: 1, y: 0 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
}

const parseInput = flow(
  Parse.splitLines,
  Arr.map<string, [Move, number]>(
    flow(Parse.splitSpace, ([move, steps]) => [
      move as Move,
      Parse.toNumber(steps),
    ]),
  ),
  Arr.reduce<[Move, number], Move[]>([], (moves, [move, steps]) => [
    ...moves,
    ...Array(steps)
      .fill(0)
      .map(() => move),
  ]),
)

const isTouching = (a: Pos, b: Pos) => {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (a.x + x === b.x && a.y + y === b.y) {
        return true
      }
    }
  }

  return false
}

// works on test data but not input :(
const part1 = flow(parseInput, (moves) => {
  let head = { x: 0, y: 0 }
  let tail = { x: 0, y: 0 }

  let visited = new Set<string>()
  let skipped: Move[] = []
  moves.forEach((move, i) => {
    const lastMove = moves[i - 1]

    head = {
      x: head.x + MOVE[move].x,
      y: head.y + MOVE[move].y,
    }

    if (!isTouching(head, tail)) {
      tail = {
        x: tail.x + MOVE[move].x + Math.sum(skipped.map((m) => MOVE[m].x)),
        y: tail.y + MOVE[move].y + Math.sum(skipped.map((m) => MOVE[m].y)),
      }
      skipped = []
    } else if (lastMove) {
      skipped.push(lastMove)
    }

    visited.add(`${tail.x}-${tail.y}`)
  })

  return visited.size
})

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return
}

run({
  onlyTests: true,
  part1: {
    solution: part1,
    tests: [
      {
        expected: 13,
        input: `
          R 4
          U 4
          L 3
          D 1
          R 4
          D 1
          L 5
          R 2`,
      },
    ],
  },
  part2: { solution: part2 },
})
