import run from "aocrunner"
import Arr from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { Math, Parse } from "../utils/index.js"

type Move = "rock" | "paper" | "scissors"

const mapLetterToMove = (letter: string): Move =>
  letter === "A" || letter == "X"
    ? "rock"
    : letter === "B" || letter === "Y"
    ? "paper"
    : "scissors"

const mapLettersToRound = ([opp, me]: string[]): [Move, Move] => [
  mapLetterToMove(opp),
  mapLetterToMove(me),
]

const getRoundScore = ([opp, me]: [Move, Move]) => {
  const moveScore = me === "rock" ? 1 : me === "paper" ? 2 : 3
  if (
    (opp === "scissors" && me === "rock") ||
    (opp === "paper" && me === "scissors") ||
    (opp === "rock" && me === "paper")
  ) {
    return moveScore + 6
  } else if (opp === me) {
    return moveScore + 3
  } else {
    return moveScore
  }
}

const manipulateOpponent = ([opp, me]: [Move, Move]): [Move, Move] => {
  if (me === "rock") {
    // must loose
    return [
      opp,
      opp === "rock" ? "scissors" : opp === "scissors" ? "paper" : "rock",
    ]
  } else if (me === "paper") {
    // must draw
    return [opp, opp]
  } else {
    // must win
    return [
      opp,
      opp === "rock" ? "paper" : opp === "paper" ? "scissors" : "rock",
    ]
  }
}

const part1 = flow(
  Parse.splitLines,
  Arr.map(flow(Parse.splitSpace, mapLettersToRound)),
  Arr.map(getRoundScore),
  Math.sum,
)

const part2 = flow(
  Parse.splitLines,
  Arr.map(flow(Parse.splitSpace, mapLettersToRound, manipulateOpponent)),
  Arr.map(getRoundScore),
  Math.sum,
)

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
