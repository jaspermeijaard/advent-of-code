import run from "aocrunner"
import { flow } from "fp-ts/lib/function.js"
import { Math, String } from "../utils/index.js"
import Array from "fp-ts/lib/Array.js"

type Scratchcard = {
  card: number
  winning: number[]
  playing: number[]
}

const parseLine = (s: string): Scratchcard => {
  const [l, m, r] = s.split(/:|\|/g)
  const card = parseInt(l.match(/\d+/g)![0]) - 1
  const winning = m.match(/\d+/g)!.map(String.toNumber)
  const playing = r.match(/\d+/g)!.map(String.toNumber)

  return { card, winning, playing }
}

const getPlayerWinningNumbers = (scratchard: Scratchcard): number[] =>
  scratchard.playing.filter((p) => scratchard.winning.includes(p))

const calculateWinningNumbersScore = (numbers: number[]): number =>
  numbers.length < 2 ? numbers.length : Math.pow(2, numbers.length - 1)

const getPlayerNumberOfScratchcards = (initial: Scratchcard[]) => {
  const staged = [...initial]

  let round = 0
  while (round < initial.length) {
    staged
      .filter((s) => s.card === round)
      .forEach((scratchcard) => {
        const winningCount = getPlayerWinningNumbers(scratchcard).length + 1
        const copyCards = initial.filter(
          (i) => i.card > round && i.card < round + winningCount,
        )
        staged.push(...copyCards)
      })

    round++
  }

  return staged.length
}

const part1 = flow(
  String.splitLines,
  Array.map(parseLine),
  Array.map(flow(getPlayerWinningNumbers, calculateWinningNumbersScore)),
  Math.sum,
)

const part2 = flow(
  String.splitLines,
  Array.map(parseLine),
  getPlayerNumberOfScratchcards,
)

run({
  part1: {
    solution: part1,
    tests: [
      {
        input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 13,
      },
    ],
  },
  part2: {
    solution: part2,
    tests: [
      {
        input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 30,
      },
    ],
  },
})
