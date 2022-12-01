export const toNumber = (number: string | number) => parseInt(number.toString())

export const split =
  (pattern: string) =>
  (string: string): string[] =>
    string.split(pattern)

export const splitParagraphs = split("\n\n")

export const splitLines = split("\n")
