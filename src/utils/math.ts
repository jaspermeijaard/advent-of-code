export const sum = (numbers: number[]) =>
  numbers.reduce((total, value) => (total += value), 0)

export const max = (numbers: number[]) => Math.max(...numbers)
