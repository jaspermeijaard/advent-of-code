import { getInput } from "../../../utils/getInput";

const states = getInput(2021, 6)[0]
  .split(",")
  .map((i) => parseInt(i));

const simulate = (days: number): number => {
  const perDay: number[] = Array(9).fill(0);
  states.forEach((s) => perDay[s]++);

  for (let i = 0; i < days; i++) {
    const atZero = perDay.shift()!;
    perDay[8] = atZero;
    perDay[6] += atZero;
  }

  return perDay.reduce((sum, count) => sum + count, 0);
};

const part1 = () => simulate(80);

const part2 = () => simulate(256);

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
