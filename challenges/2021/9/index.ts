import { getInput } from "../../../utils/getInput"

type Unit = {
  x: number
  y: number
  value: number
}

type UnitMap = Map<string, Unit>

const units: UnitMap = new Map(
  getInput(2021, 9)
    .map((str) => str.split("").map((str) => parseInt(str)))
    .map((units, x) => units.map<Unit>((value, y) => ({ x, y, value })))
    .reduce((units, arr) => [...units, ...arr], [])
    .map((u) => [`${u.x}-${u.y}`, u]),
)

const moves = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
]

const findLowestUnits = () =>
  [...units.entries()].filter(([_, unit]) =>
    moves
      .map(([x, y]) => units.get(`${unit.x + x}-${unit.y + y}`))
      .filter((n) => n)
      .map<Unit>((n) => n!)
      .every((adj) => adj.value > unit.value),
  )

const findBasinUnits = (map: UnitMap): UnitMap => {
  const newAdjecents = [...map.entries()]
    .map(([_, find]) =>
      moves
        .map<[string, Unit | undefined]>(([x, y]) => {
          const pos = `${find.x + x}-${find.y + y}`
          return [pos, units.get(pos)]
        })
        .filter(([p, u]) => u && u.value > find.value && u.value < 9 && !map.has(p))
        .map((entry) => entry as [string, Unit]),
    )
    .reduce((flat, adjecents) => flat.concat(adjecents), [])

  if (newAdjecents.length === 0) {
    return map
  }

  return findBasinUnits(new Map(newAdjecents.concat([...map.entries()])))
}

const part1 = () =>
  findLowestUnits()
    .map(([_, unit]) => unit.value + 1)
    .reduce((sum, total) => (sum += total), 0)

const part2 = () =>
  findLowestUnits()
    .map((entry) => findBasinUnits(new Map([entry])))
    .map((basin) => basin.size)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, size) => sum * size, 1)

console.log(`Part 1: ${part1()}`)
console.log(`Part 2: ${part2()}`)
