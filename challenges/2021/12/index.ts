import { getInput } from "../../../utils/getInput"

const branch = (
  all: string[],
  line: string,
  invert: boolean = false,
): string[] => {
  const split = line.split("-")
  const right = split.pop()!
  const left = split.join("-")

  const joins = all
    .filter((l) => l.startsWith(right))
    .map((join) => `${left}-${join}`)
    .filter((l) => !all.includes(l))

  if (joins.length === 0) {
    return [line]
  }

  const joinConnections = joins
    .map((j) => branch(all, j, invert))
    .reduce((flat, conn) => [...flat, ...conn], [])

  return [...joins, ...joinConnections]
}

const connections = (all: string[]) => {
  const leftToRight = all
    .map((line) => branch(all, line))
    .reduce((all, branched) => [...all, ...branched], [])
}

const part1 = () => {
  const lines = getInput(2021, 12)
  return 100
}

const part2 = () => {
  return 200
}

console.log(`Part 1: ${part1()}`)
console.log(`Part 2: ${part2()}`)
