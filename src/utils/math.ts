export const sum = (numbers: number[]) =>
  numbers.reduce((total, value) => (total += value), 0)

export const min = (numbers: number[]) => Math.min(...numbers)

export const max = (numbers: number[]) => Math.max(...numbers)

export const multiply = (numbers: number[]) =>
  numbers.reduce((total, value) => (total = total * value), numbers.pop()!)

export const pow = Math.pow

export const abs = Math.abs
