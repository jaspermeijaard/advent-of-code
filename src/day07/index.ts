import run from "aocrunner"
import Arr from "fp-ts/lib/Array.js"
import { flow, pipe } from "fp-ts/lib/function.js"
import { Parse, Math } from "../utils/index.js"

type File = {
  type: "file" | "dir"
  name: string
  size: number
  files: File[]
}

type FS = File & {
  pointer: string
  totalSize: number
}

const getFileSize = (file: File) => Math.sum(file.files.map((c) => c.size))

const parseInputToFS: (rawInput: string) => FS = flow(
  Parse.splitLines,
  (lines) =>
    lines.reduce<FS>(
      (fs, cmd) => {
        const cwd = eval(fs.pointer) as File // #yolo

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
          fs.pointer = fs.pointer.split(".").slice(0, -1).join(".")
        } else if (cmd.match(/\$ cd [^.\/]/)) {
          // move cwd to file
          const name = cmd.split(" ")[2]
          const index = cwd.files.findIndex((f) => f.name === name)
          fs.pointer = `${fs.pointer}.files[${index}]`
        }

        cwd.size = getFileSize(cwd)
        return { ...fs }
      },
      {
        pointer: "fs",
        type: "dir",
        size: 0,
        name: "/",
        files: [],
        totalSize: 70000000,
      },
    ),
  (fs) => ({
    ...fs,
    size: getFileSize(fs),
  }),
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
  (fs) => ({
    files: [fs],
    needMoreSize: 30000000 - (fs.totalSize - fs.size),
  }),
  ({ files, needMoreSize }) =>
    searchFiles((f) => f.type === "dir" && f.size > needMoreSize)(files),
  (dirs) => dirs.sort((a, b) => b.size - a.size),
  (dirs) => dirs.pop()!,
  (dir) => dir.size,
)

run({
  part1: { solution: part1 },
  part2: { solution: part2 },
})
