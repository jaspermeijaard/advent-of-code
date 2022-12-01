export const sum = (numbers: number[]) =>
  numbers.reduce((total, value) => (total += value))

export const max = (numbers: number[]) => Math.max(...numbers)
