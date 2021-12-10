import { getInput } from "../../../utils/getInput"

const pairs: { [key: string]: string } = {
  "(": ")",
  "<": ">",
  "[": "]",
  "{": "}",
}

const illegalPoints: { [key: string]: number } = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
}

const autocompletePoints: { [key: string]: number } = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
}

const validate = (string: string) => {
  const tags = string.split("")
  const opens = []
  let invalid: string | undefined

  for (const tag of tags) {
    if (pairs[tag]) {
      opens.push(tag)
    } else {
      const lastOpen = opens.pop()!
      const expectedClose = pairs[lastOpen]

      if (tag !== expectedClose) {
        invalid = tag
      }
    }
  }

  return {
    unclosed: opens.map((o) => pairs[o]).reverse(),
    invalid,
  }
}

const part1 = () =>
  getInput(2021, 10)
    .map((string) => validate(string))
    .filter((result) => result.invalid)
    .map((result) => illegalPoints[result.invalid!])
    .reduce((sum, points) => (sum += points), 0)

const part2 = () =>
  getInput(2021, 10)
    .map((string) => validate(string))
    .filter((result) => !result.invalid)
    .map((result) =>
      result.unclosed
        .map((u) => autocompletePoints[u])
        .reduce((total, points) => (total = total * 5 + points), 0),
    )
    .sort((a, b) => b - a)
    .find((_, i, all) => i === (all.length - 1) / 2)

console.log(`Part 1: ${part1()}`)
console.log(`Part 2: ${part2()}`)
