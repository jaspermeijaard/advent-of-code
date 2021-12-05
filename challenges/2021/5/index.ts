import { groupBy, toArray } from "lodash";
import { getInput } from "../../../utils/getInput";

type Pos = { x: number; y: number };

const lines = getInput(2021, 5)
  .map((s) => s.match(/\d+/g)!.map((nr) => parseInt(nr)))
  .map<[Pos, Pos]>(([x1, y1, x2, y2]) => [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ]);

const part1 = () => {
  const points = lines.reduce<Pos[]>((list, line) => {
    const [start, end] = line;

    const points: Pos[] = [];
    if (start.x === end.x) {
      const { minY, maxY } = minMax(line);
      for (let y = minY; y <= maxY; y++) {
        points.push({ x: start.x, y });
      }
    } else if (start.y === end.y) {
      const { minX, maxX } = minMax(line);
      for (let x = minX; x <= maxX; x++) {
        points.push({ x, y: start.y });
      }
    }

    return [...list, ...points];
  }, []);

  return countOverlap(points);
};

const part2 = () => {
  const points = lines.reduce<Pos[]>((list, line) => {
    const [start, end] = line;

    const points: Pos[] = [];
    if (start.x === end.x) {
      const { minY, maxY } = minMax(line);
      for (let y = minY; y <= maxY; y++) {
        points.push({ x: start.x, y });
      }
    } else if (start.y === end.y) {
      const { minX, maxX } = minMax(line);
      for (let x = minX; x <= maxX; x++) {
        points.push({ x, y: start.y });
      }
    } else {
      const incrX = start.x < end.x;
      const incrY = start.y < end.y;
      for (
        let x = start.x, y = start.y;
        incrX ? x <= end.x : x >= end.x;
        incrX ? x++ : x--
      ) {
        points.push({ x, y });
        incrY ? y++ : y--;
      }
    }

    return [...list, ...points];
  }, []);

  return countOverlap(points);
};

const minMax = ([start, end]: [Pos, Pos]) => {
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);
  return { minX, maxX, maxY, minY };
};

const countOverlap = (points: Pos[]) =>
  toArray(groupBy(points, (p) => `${p.x}-${p.y}`))
    .map((points) => points.length)
    .filter((length) => length >= 2).length;

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
