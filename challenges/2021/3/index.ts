import { getInput } from "../../../utils/getInput";

type BinaryList = string[][];

const binaries = getInput(2021, 3).map((binary) => binary.split(""));

const part1 = () => {
  const calc = binaries[0].map(() => 0);

  for (let row = 0; row < binaries.length; row++) {
    for (let col = 0; col < binaries[row].length; col++) {
      if (binaries[row][col] === "1") calc[col]++;
    }
  }

  const gamma = toNumber(
    calc.map((nr) => (nr >= binaries.length / 2 ? "1" : "0"))
  );

  const epsiolon = toNumber(
    calc.map((nr) => (nr >= binaries.length / 2 ? "0" : "1"))
  );

  return gamma * epsiolon;
};

const getNumbersAtIndex = (binaries: BinaryList, index: number) => {
  return binaries.map((numbers) => numbers[index]);
};

const toNumber = (binary: (string | number)[]) => parseInt(binary.join(""), 2);

const commonNumberAtIndex = (
  list: BinaryList,
  index: number,
  keep: "least" | "most"
) => {
  const numbersAtIndex = getNumbersAtIndex(list, index);
  const occurencesOfOne = numbersAtIndex.filter((nr) => nr === "1").length;
  const truthy = keep === "most" ? "1" : "0";
  const falsy = keep === "most" ? "0" : "1";
  return occurencesOfOne >= numbersAtIndex.length / 2 ? truthy : falsy;
};

const filterListByMostCommonNumberAtIndex = (
  list: BinaryList,
  index: number,
  keep: "least" | "most"
) => {
  const mostCommonNumber = commonNumberAtIndex(list, index, keep);
  return list.filter((binary) => binary[index] === mostCommonNumber);
};

const getRating = (
  list: BinaryList,
  index: number,
  keep: "least" | "most"
): string[] => {
  const filteredByMostCommon = filterListByMostCommonNumberAtIndex(
    list,
    index,
    keep
  );

  if (filteredByMostCommon.length <= 1) {
    return filteredByMostCommon[0];
  }

  return getRating(filteredByMostCommon, index + 1, keep);
};

const part2 = () => {
  const oxygenRating = toNumber(getRating(binaries, 0, "most"));
  const co2ScrubberRating = toNumber(getRating(binaries, 0, "least"));

  return oxygenRating * co2ScrubberRating;
};

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
