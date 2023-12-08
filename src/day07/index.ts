import run from "aocrunner"
import { flow, pipe } from "fp-ts/lib/function.js"
import { Math, String } from "../utils/index.js"
import A from "fp-ts/lib/Array.js"
import O, { as } from "fp-ts/lib/Option.js"
import S from "fp-ts/lib/String.js"
import N from "fp-ts/lib/String.js"
import { log } from "../utils/debug.js"
import { number } from "fp-ts"

type Count = [string, number]

type Hand = {
  string: string
  bid: number
  counts: Count[]
}

const mapStringToHands = flow(
  String.splitLines,
  A.map(
    flow(String.splitSpaces, ([string, rBid]): Hand => {
      const counts = pipe(
        string,
        String.splitChars,
        A.reduce<string, Record<string, number>>({}, (all, c) => {
          all[c] = all[c] ? all[c] + 1 : 1
          return all
        }),
        (map) => Object.keys(map).map<Count>((i) => [i, map[i]]),
      )

      return {
        string,
        bid: String.toNumber(rBid),
        counts,
      }
    }),
  ),
)

const getHandScoreByCombinations = (h: Hand, useJoker: boolean) => {
  const countCount = (n: number) =>
    h.counts.filter(([char, c]) => c === n).length
  const jokerCount = useJoker
    ? h.counts.find(([char]) => char === "J")?.[1] ?? 0
    : 0

  const fiveOfAKind = countCount(5) === 1
  const fourOfAKind = countCount(4) === 1
  const fullHouse = countCount(3) === 1 && countCount(2) === 1
  const threeOfAKind = countCount(3) === 1 && countCount(1) === 2
  const twoPair = countCount(2) === 2 && countCount(1) === 1
  const onePair = countCount(2) === 1 && countCount(1) === 3
  const highCard = countCount(1) === 5

  return [
    fiveOfAKind,
    fourOfAKind,
    fullHouse,
    threeOfAKind,
    twoPair,
    onePair,
    highCard,
  ]
    .reverse()
    .indexOf(true)
}

const getLabelScore = (label: string, useJoker: boolean): number =>
  (useJoker
    ? ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"]
    : ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
  )
    .reverse()
    .indexOf(label)

const compareHandsByLabels = (a: Hand, b: Hand, useJoker: boolean) => {
  for (let i = 0; i < a.string.length; i++) {
    const aScore = getLabelScore(a.string[i], useJoker)
    const bScore = getLabelScore(b.string[i], useJoker)

    if (aScore > bScore) {
      return 1
    } else if (bScore > aScore) {
      return -1
    }
  }

  throw new Error("")
}

const compareHands = (a: Hand, b: Hand, useJoker: boolean) => {
  const aScore = getHandScoreByCombinations(a, useJoker)
  const bScore = getHandScoreByCombinations(b, useJoker)

  if (aScore !== bScore) {
    return aScore - bScore
  }

  return compareHandsByLabels(a, b, useJoker)
}

const part1 = flow(
  mapStringToHands,
  (a) => a.sort((a, b) => compareHands(a, b, false)),
  (a) => a.map((h, i) => (i + 1) * h.bid),
  Math.sum,
)

const part2 = flow(
  mapStringToHands,
  (a) => a.sort((a, b) => compareHands(a, b, true)),
  (a) => a.map((h, i) => (i + 1) * h.bid),
  Math.sum,
)

run({
  onlyTests: true,
  part1: {
    solution: part1,
    tests: [
      {
        input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483
        `,
        expected: 6440,
      },
    ],
  },
  part2: {
    solution: part2,
    tests: [
      {
        input: `
        32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483
      `,
        expected: 6440,
      },
    ],
  },
})
