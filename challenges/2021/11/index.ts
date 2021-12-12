import { getInput } from "../../../utils/getInput"

const moves = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const increase = (grid: number[][]) => {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      grid[x][y]++
    }
  }
}

const flashAndAdjecents = (grid: number[][], x: number, y: number, flashes: Set<string>) => {
  if (grid[x][y] > 9) {
    flashes.add(`${x}-${y}`)
    grid[x][y] = 0

    moves.forEach(([moveX, moveY]) => {
      if (grid[x + moveX] && grid[x + moveX][y + moveY]) {
        grid[x + moveX][y + moveY]++

        if (grid[x + moveX][y + moveY] === 10) {
          flashAndAdjecents(grid, x + moveX, y + moveY, flashes)
        }
      }
    })
  }
}

const flash = (grid: number[][]) => {
  let flashes = new Set<string>()

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      flashAndAdjecents(grid, x, y, flashes)
    }
  }

  for (let flash of flashes.values()) {
    let [x, y] = flash.split("-").map((f) => parseInt(f))
    grid[x][y] = 0
  }

  return flashes
}

const part1 = () => {
  const grid = getInput(2021, 11).map((x) => x.split("").map((y) => parseInt(y)))

  let total = 0
  for (let i = 0; i < 100; i++) {
    increase(grid)
    const flashes = flash(grid)
    total += flashes.size
  }

  return total
}

const part2 = () => {
  const grid = getInput(2021, 11).map((x) => x.split("").map((y) => parseInt(y)))

  for (let i = 1; i <= 500; i++) {
    increase(grid)
    const flashes = flash(grid)
    if (flashes.size === grid.length * grid[0].length) {
      return i
    }
  }
}

console.log(`Part 1: ${part1()}`)
console.log(`Part 2: ${part2()}`)
