import run from "aocrunner"
import A from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { sum } from "../utils/math.js"
import { splitChars, splitLines } from "../utils/string.js"
import { log } from "../utils/debug.js"

const diagonals = (grid: string[][]) =>
  grid.reduceRight((r, a, i) => {
    a.forEach((e, j) => {
      const pos = j + (grid.length - i - 1)
      if (!r[pos]) r[pos] = []
      r[pos]!.unshift(e)
    })
    return r
  }, [] as string[][])

const rotate = (grid: string[][]) =>
  grid[0].map((val, index) => grid.map((row) => row[row.length - 1 - index]))

const countOccurances = (grid: string[][]) =>
  sum(
    grid
      .map(
        (line) =>
          line
            .map(
              (v, i, arr) =>
                v === "X" && arr.slice(i + 1, i + 4).join("") === "MAS",
            )
            .filter((b) => b).length,
      )
      .filter((l) => l),
  )

const part1 = flow(
  splitLines,
  A.map(splitChars),
  (grid) => {
    const l = grid
    const tl = diagonals(grid)
    const t = rotate(grid)
    const tr = diagonals(rotate(grid))
    const r = rotate(rotate(grid))
    const br = diagonals(rotate(rotate(grid)))
    const b = rotate(rotate(rotate(grid)))
    const bl = diagonals(rotate(rotate(rotate(grid))))
    return [l, tl, t, tr, r, br, b, bl]
  },
  A.map(countOccurances),
  sum,
)

const part2 = flow(
  splitLines,
  A.map(splitChars),
  (grid) => {
    return grid.map(
      (row, x) =>
        row
          .map((val, y) => {
            const d1 =
              (grid?.[x - 1]?.[y - 1] ?? "") + (grid?.[x + 1]?.[y + 1] ?? "")
            const d2 =
              (grid?.[x - 1]?.[y + 1] ?? "") + (grid?.[x + 1]?.[y - 1] ?? "")
            return (
              val === "A" &&
              (d1 === "MS" || d1 == "SM") &&
              (d2 === "MS" || d2 === "SM")
            )
          })
          .filter((b) => b).length,
    )
  },
  sum,
)

run({
  onlyTests: false,
  part1: {
    solution: part1,
    tests: [
      {
        expected: 18,
        input: `
          MMMSXXMASM
          MSAMXMSMSA
          AMXSXMAAMM
          MSAMASMSMX
          XMASAMXAMM
          XXAMMXXAMA
          SMSMSASXSS
          SAXAMASAAA
          MAMMMXMMMM
          MXMXAXMASX
        `,
      },
    ],
  },
  part2: {
    solution: part2,
    tests: [
      {
        expected: 9,
        input: `
        MMMSXXMASM
        MSAMXMSMSA
        AMXSXMAAMM
        MSAMASMSMX
        XMASAMXAMM
        XXAMMXXAMA
        SMSMSASXSS
        SAXAMASAAA
        MAMMMXMMMM
        MXMXAXMASX
      `,
      },
    ],
  },
})
