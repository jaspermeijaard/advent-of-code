import { getInput } from "../../../utils/getInput";

const depths = getInput(2021, 1).map((l) => parseInt(l));

const countIncreases = (numbers: number[]) =>
  numbers.reduce(
    (total, current, i, all) =>
      all[i - 1] && current > all[i - 1] ? total + 1 : total,
    0
  );

const part1 = () => {
  return countIncreases(depths);
};

const part2 = () => {
  const windowDepths = depths
    .map((curr, i) => {
      const prev = depths[i - 1];
      const next = depths[i + 1];
      return prev && next ? prev + curr + next : 0;
    })
    .filter((d) => d !== 0);

  return countIncreases(windowDepths);
};

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
