import run from "aocrunner"
import Arr from "fp-ts/lib/Array.js"
import { flow } from "fp-ts/lib/function.js"
import { Parse, Math } from "../utils/index.js"

type File = {
  type: "file" | "dir"
  name: string
  size: number
  files: File[]
}

type FS = File & {
  pointer: number[]
}

const getFileSize = (f: File) => Math.sum(f.files.map((c) => c.size))

const getCwd = (f: File, pointer: number[]): File =>
  pointer.length === 0 ? f : getCwd(f.files[pointer[0]], pointer.slice(1))

const parseInputToFS: (rawInput: string) => FS = flow(
  Parse.splitLines,
  (lines) =>
    lines.reduce<FS>(
      (fs, cmd) => {
        const cwd = getCwd(fs, fs.pointer)

        if (cmd.startsWith("dir ")) {
          // add dir to cwd
          cwd.files.push({
            type: "dir",
            name: cmd.split(" ")[1],
            size: 0,
            files: [],
          })
        } else if (cmd.match(/\d+/)) {
          // add file to cwd
          const [size, name] = cmd.split(" ")
          cwd.files.push({
            type: "file",
            name: name,
            size: parseInt(size),
            files: [],
          })
        } else if (cmd.includes("$ cd ..")) {
          // move cwd to parent
          fs.pointer.pop()
        } else if (cmd.match(/\$ cd [^.\/]/)) {
          // move cwd to file
          const name = cmd.split(" ")[2]
          fs.pointer.push(cwd.files.findIndex((f) => f.name === name))
        }

        cwd.size = getFileSize(cwd)
        fs.size = getFileSize(fs)
        return fs
      },
      {
        pointer: [],
        type: "dir",
        size: 0,
        name: "/",
        files: [],
      },
    ),
)

const searchFiles =
  (predicate: (file: File) => boolean) =>
  (files: File[]): File[] =>
    [
      ...files.filter((f) => predicate(f)),
      ...files.map((f) => searchFiles(predicate)(f.files)),
    ].flat()

const part1 = flow(
  parseInputToFS,
  (fs) => fs.files,
  searchFiles((f) => f.type === "dir"),
  Arr.map((f) => f.size),
  Arr.filter((size) => size <= 100000),
  Math.sum,
)

const part2 = flow(
  parseInputToFS,
  (fs) => searchFiles((f) => f.size > 30000000 - (70000000 - fs.size))([fs]),
  (dirs) => dirs.sort((a, b) => b.size - a.size),
  (dirs) => dirs.pop()!,
  (dir) => dir.size,
)

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
