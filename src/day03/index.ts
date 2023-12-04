import run from "aocrunner"
import { Math, String } from "../utils/index.js"
import Array from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"

type Entry = {
  xys: [number, number][]
  type: "empty" | "symbol" | "number"
  value: string
}

const adjacentsPositions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const parseEntries = flow(
  String.splitLines,
  Array.map(String.splitChars),
  Array.reduceWithIndex<string[], Entry[]>([], (x, list, chars) =>
    list.concat(
      chars.map((char, y) => ({
        type:
          char === "." ? "empty" : char.match(/[^0-9.]/) ? "symbol" : "number",
        value: char,
        xys: [[x, y]],
      })),
    ),
  ),
)

const findLastNumber = (entries: Entry[], current: Entry) => {
  const [x, y] = current.xys[0]
  return entries.find(
    (e) =>
      e &&
      e.type === "number" &&
      e.xys.some(([eX, eY]) => eX === x && eY === y - 1),
  )
}

const mergeNumbersInEntries = (initialEntries: Entry[]) => {
  const entries = [...initialEntries]

  for (let i = 0; i < entries.length; i++) {
    const current = entries[i]
    const prev = current.type === "number" && findLastNumber(entries, current)

    if (prev) {
      prev.xys.push(...current.xys)
      prev.value += current.value
      delete entries[i]
    }
  }

  return entries.filter((e) => !!e)
}

const findAdjacentPartNumbers = flow((entries: Entry[], symbol?: string) =>
  entries.filter(
    (e, _, all) =>
      e.type === "number" &&
      e.xys.some(([eX, eY]) =>
        adjacentsPositions.some(([pX, pY]) =>
          all.some(
            (d) =>
              d.type === "symbol" &&
              (symbol ? d.value === symbol : true) &&
              d.xys[0][0] === eX + pX &&
              d.xys[0][1] === eY + pY,
          ),
        ),
      ),
  ),
)

const findAdjacentGearNumbers = flow((entries: Entry[]) => {
  const partNumbers = findAdjacentPartNumbers(entries, "*")
})

const part1 = flow(
  parseEntries,
  mergeNumbersInEntries,
  findAdjacentPartNumbers,
  Array.map(({ value }) => parseInt(value)),
  Math.sum,
)

const part2 = flow(
  parseEntries,
  mergeNumbersInEntries,
  findAdjacentGearNumbers,
  () => 0,
)

run({
  onlyTests: true,
  part1: {
    solution: part1,
    tests: [
      {
        input: `
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..
        `,
        expected: 4361,
      },
    ],
  },
  part2: {
    solution: part2,
    tests: [
      {
        input: `
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..
      `,
        expected: 467835,
      },
    ],
  },
})
