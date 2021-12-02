import { getInput } from "../../../utils/getInput";

type Instruction = ["down" | "up" | "forward", number];

const instructions = getInput(2021, 2).map((str) => {
  const split = str.split(" ");
  return [split[0], parseInt(split[1])];
}) as Instruction[];

const part1 = () => {
  const me = { x: 0, y: 0, aim: 0 };

  instructions.forEach(([direction, number]) => {
    if (direction === "forward") {
      me.x += number;
    } else if (direction === "up") {
      me.y -= number;
    } else if (direction === "down") {
      me.y += number;
    }
  });

  return me.y * me.x;
};

const part2 = () => {
  const me = { x: 0, y: 0, aim: 0 };

  instructions.forEach(([direction, number]) => {
    if (direction === "forward") {
      me.x += number;
      me.y += number * me.aim;
    } else if (direction === "up") {
      me.aim -= number;
    } else if (direction === "down") {
      me.aim += number;
    }
  });

  return me.y * me.x;
};

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
