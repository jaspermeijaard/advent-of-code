import { readFileSync } from "fs";

export function getInput(year: number, day: number): string[] {
  return readFileSync(`challenges/${year}/${day}/input.txt`, "utf-8")
    .trim()
    .split("\n");
}
