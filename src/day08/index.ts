import run from "aocrunner"
import Arr from "fp-ts/lib/Array.js"
import { flow, pipe } from "fp-ts/lib/function.js"
import { Parse, Math } from "../utils/index.js"

type Tree = {
  x: number
  y: number
  z: number
}

const parseMap: (s: string) => Tree[] = flow(
  Parse.splitLines,
  Arr.map(flow(Parse.splitChars, Arr.map(Parse.toNumber))),
  (arr) => arr.map((xs, x) => xs.map((z, y) => ({ x, y, z }))).flat(),
)

const findOtherTreesOnSameAxes = (trees: Tree[], a: Tree) =>
  trees.filter(
    (b) =>
      (b.x === a.x && (b.y < a.y || b.y > a.y)) ||
      (b.y === a.y && (b.x < a.x || b.x > a.x)),
  )

const groupTreesByDirection = (trees: Tree[], a: Tree) => [
  trees.filter((o) => o.x < a.x).reverse(),
  trees.filter((o) => o.y > a.y),
  trees.filter((o) => o.x > a.x),
  trees.filter((o) => o.y < a.y).reverse(),
]

const mapTreeVisibility = (trees: Tree[]): boolean[] => {
  const size = Math.pow(trees.length, 0.5)
  return trees.map((t) => {
    if (t.x === 0 || t.y === 0 || t.x === size || t.y === size) {
      return true
    }

    const others = findOtherTreesOnSameAxes(trees, t)
    const groups = groupTreesByDirection(others, t)
    return groups.some((side) => side.every((o) => o.z < t.z))
  })
}

const mapTreeScenicScore = (trees: Tree[]): number[] =>
  trees.map((t) => {
    const others = findOtherTreesOnSameAxes(trees, t)
    const groups = groupTreesByDirection(others, t)

    return Math.multiply(
      groups.map((group) => {
        const blocker = group.findIndex((o) => o.z >= t.z)
        return blocker === -1 ? group.length : blocker + 1
      }),
    )
  })

const part1 = flow(
  parseMap,
  mapTreeVisibility,
  Arr.filter((visible) => visible),
  (arr) => arr.length,
)

const part2 = flow(parseMap, mapTreeScenicScore, Math.max)

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
