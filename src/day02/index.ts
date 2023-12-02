import run from "aocrunner"
import { Math, String } from "../utils/index.js"
import { flow } from "fp-ts/lib/function.js"
import Array from "fp-ts/lib/Array.js"

type Color = "blue" | "red" | "green"

type Action = {
  round: number
  count: number
  color: Color
}

const parseLine = flow((s: string): [number, Action[]] => {
  const [left, right] = s.split(":")
  const game = String.toNumber(left.match(/\d+/)![0])

  const actions = right.split(";").reduce<Action[]>((all, set, round) => {
    const sets = set.trim().split(",")
    sets.forEach((s) => {
      const [count, color] = s.trim().split(" ")
      all.push({
        round,
        count: String.toNumber(count),
        color: color as Color,
      })
    })
    return all
  }, [])

  return [game, actions]
})

const filterByMaximumCubes = ([_, actions]: [number, Action[]]) => {
  return actions.every(
    ({ color, count }) =>
      (color === "red" && count <= 12) ||
      (color === "green" && count <= 13) ||
      (color === "blue" && count <= 14),
  )
}

const mapToFewestCubeCounts = ([_, actions]: [number, Action[]]) => {
  const sorted = actions.sort((a, b) => b.count - a.count)
  return [
    sorted.find((c) => c.color === "red")!,
    sorted.find((c) => c.color === "green")!,
    sorted.find((c) => c.color === "blue")!,
  ].map((f) => f.count)
}

const part1 = flow(
  String.splitLines,
  Array.map(parseLine),
  Array.filter(filterByMaximumCubes),
  Array.map(([game]) => game),
  Math.sum,
)

const part2 = flow(
  String.splitLines,
  Array.map(parseLine),
  Array.map(mapToFewestCubeCounts),
  Array.map(Math.multiply),
  Math.sum,
)

run({
  part1: {
    solution: part1,
    tests: [
      {
        input: `
          Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
          Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
          Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
          Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
          Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 8,
      },
    ],
  },
  part2: {
    solution: part2,
    tests: [
      {
        input: `
          Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
          Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
          Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
          Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
          Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 2286,
      },
    ],
  },
})
