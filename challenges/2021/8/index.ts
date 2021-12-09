import { getInput } from "../../../utils/getInput"

const input = getInput(2021, 8)
  .map((str) => str.match(/\w+/g)!)
  .map((arr) => arr.map((str) => str.split("").sort().join("")))
  .map((arr) => ({
    patterns: arr.slice(0, -4),
    output: arr.slice(-4),
  }))

const part1 = () => {
  const map = ["abcefg", "cf", "acdefg", "acdfg", "bcdf", "abdfg", "abdefg", "acf", "abcdefg", "abcdfg"]
  const lenghts = [1, 4, 7, 8].map((i) => map[i].length)
  const occurences = input.map((note) => note.output.filter((r) => lenghts.some((length) => length === r.length)))
  const total = occurences.reduce((count, arr) => (count += arr.length), 0)

  return total
}

const incl = (a: string, b: string) => {
  return b.split("").every((b) => a.split("").some((i) => i === b))
}

const part2 = () => {
  const sums = input.map(({ patterns: ps, output }) => {
    const m = new Map([
      [1, ps.find((p) => p.length === 2)!],
      [4, ps.find((p) => p.length === 4)!],
      [7, ps.find((p) => p.length === 3)!],
      [8, ps.find((p) => p.length === 7)!],
    ])

    m.set(6, ps.find((p) => p.length === 6 && !incl(p, m.get(1)!))!)
    m.set(9, ps.find((p) => p.length === 6 && p !== m.get(6)! && incl(p, m.get(4)!))!)
    m.set(0, ps.find((p) => p.length === 6 && p !== m.get(6)! && p !== m.get(9)!)!)
    m.set(3, ps.find((p) => p.length === 5 && incl(p, m.get(1)!))!)
    m.set(5, ps.find((p) => p.length === 5 && p !== m.get(3)! && incl(m.get(6)!, p))!)
    m.set(2, ps.find((p) => p.length === 5 && p !== m.get(3)! && p !== m.get(5)!)!)

    const resolved = output.map((o) => [...m.entries()].find(([_, v]) => v === o)![0])
    const sum = parseInt(resolved.join(""))

    return sum
  })

  const total = sums.reduce((total, sum) => (total += sum), 0)

  return total
}

console.log(`Part 1: ${part1()}`)
console.log(`Part 2: ${part2()}`)
