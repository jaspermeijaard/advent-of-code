import { getInput } from "../../../utils/getInput";

const positions = getInput(2021, 7)[0]
  .split(",")
  .map((p) => parseInt(p));

const calcFuels = (constantRate: boolean) =>
  Array(Math.max(...positions))
    .fill(0)
    .reduce<number[]>(
      (fuel, _, i) =>
        fuel.concat(
          positions
            .map((p) => Math.abs(p - i))
            .reduce((sum, fuels) =>
              constantRate
                ? (sum += fuels)
                : (sum += Array<number>(fuels + 1)
                    .fill(0)
                    .reduce<number>(
                      (sum, _, multiplier) => (sum += multiplier * 1),
                      0
                    ))
            )
        ),
      []
    );

const part1 = () => Math.min(...calcFuels(true));

const part2 = () => Math.min(...calcFuels(false));

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
