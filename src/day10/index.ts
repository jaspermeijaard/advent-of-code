import run from "aocrunner"
import A from "fp-ts/lib/Array.js"
import { flow, pipe } from "fp-ts/lib/function.js"
import { multiply, sum } from "../utils/math.js"
import { splitLines, splitSpace, toNumber } from "../utils/parse.js"

type Command = ["addx" | "noop", number]
type Program = {
  register: number
  commands: Command[]
  history: number[]
  sprite: boolean[]
  crt: boolean[][]
}

const parseInputToCommands = flow(
  splitLines,
  A.map(flow(splitSpace, ([cmd, num]) => [cmd, toNumber(num ?? 0)] as Command)),
)

const createSprite = (at: number = -3): boolean[] => {
  const left = Array(Math.max(at - 1, 0)).fill(false)
  const middle = Array(Math.min(at + 3, 3)).fill(true)
  const leftMiddle = [...left, ...middle].slice(0, 40)
  const right = Array(Math.max(40 - middle.length - left.length, 0)).fill(false)
  return [...leftMiddle, ...right]
}

const runCommands = (commands: Command[]) =>
  A.reduce<Command, Program>(
    {
      commands,
      history: [],
      register: 1,
      sprite: createSprite(1),
      crt: [],
    },
    (program, [cmd, val]) => {
      let i = cmd === "noop" ? 1 : 2
      while (i--) {
        if (program.history.length % 40 === 0) {
          program.crt.push(createSprite())
        }

        const offset = sum(program.crt.map((crt) => crt.length)) - 40
        const pointer = program.history.length - offset
        program.crt[program.crt.length - 1][pointer] = program.sprite[pointer]

        program.history.push(program.register)
        if (i === 0) {
          program.register += val
          program.sprite = createSprite(program.register)
        }
      }

      return program
    },
  )(commands)

const part1 = flow(
  parseInputToCommands,
  runCommands,
  (program) =>
    [20, 60, 100, 140, 180, 220]
      .map((cycle) => [cycle, program.history[cycle - 1]])
      .map(multiply),
  sum,
)

const part2 = flow(parseInputToCommands, runCommands, (program) => {
  console.log(program.crt.map((c) => c.map((b) => (b ? "#" : ".")).join("")))
  return "RKAZAJBR"
})

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
