export const split =
  (pattern: string) =>
  (string: string): string[] =>
    string.split(pattern)

export const splitParagraphs = split("\n\n")

export const splitLines = split("\n")

export const splitSpaces = split(" ")

export const splitChars = split("")

export const toNumber = (number: string) => parseInt(number.toString())

export const join = (strings: string[]) => strings.join("")

export const reverse = (s: string) => s.split("").reverse().join("")
