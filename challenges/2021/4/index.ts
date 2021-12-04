import { groupBy, toArray } from "lodash";
import { getInput } from "../../../utils/getInput";

type Number = {
  board: number;
  value: number;
  x: number;
  y: number;
  checked: boolean;
};

const getNumbers = (input: string[]): Number[] => {
  let board = 0;
  return input.slice(2).reduce<Number[]>((list, row) => {
    const numbers = row.match(/\d+/g);
    if (!numbers) {
      board++;
      return list;
    }

    return [
      ...list,
      ...numbers.map<Number>((value, i) => ({
        board,
        value: parseInt(value),
        x: i,
        y: list.filter((i) => i.board === board).length / 5,
        checked: false,
      })),
    ];
  }, []);
};

const findBingo = (
  numbers: Number[],
  length: number,
  group: (number: Number) => string
) => {
  return toArray(groupBy(numbers, group))!.find((m) => m.length === length);
};

const findFirstBingo = (numbers: Number[], length: number) => {
  const filtered = numbers.filter((n) => n.checked);
  const xBingo = findBingo(filtered, length, (n) => `${n.board}-${n.y}`);
  const yBingo = findBingo(filtered, length, (n) => `${n.board}-${n.x}`);

  return xBingo ? xBingo[0].board : yBingo ? yBingo[0].board : false;
};

const input = getInput(2021, 4);
const drawn = input[0].split(",").map((s) => parseInt(s));

const part1 = () => {
  let numbers = getNumbers(input);
  let numberLength = numbers.filter((n) => n.board === 0 && n.x === 0).length;

  for (const draw of drawn) {
    numbers = numbers.map((n) =>
      n.value === draw ? { ...n, checked: true } : n
    );

    const bingo = findFirstBingo(numbers, numberLength);
    if (bingo !== false) {
      const boardSum = numbers
        .filter((n) => n.board === bingo && !n.checked)
        .reduce((sum, { value }) => sum + value, 0);

      return boardSum * draw;
    }
  }
};

const part2 = () => {
  let numbers = getNumbers(input);
  let numberLength = numbers.filter((n) => n.board === 0 && n.x === 0).length;

  const boards = new Set(numbers.map((n) => n.board));
  const boardBingos = [...boards.values()].map((board) => {
    let draws = 0;
    let boardNumbers = numbers.filter((n) => n.board === board);

    for (const draw of drawn) {
      boardNumbers = boardNumbers.map((n) =>
        n.value === draw ? { ...n, checked: true } : n
      );

      const bingo = findFirstBingo(boardNumbers, numberLength);
      if (bingo !== false) {
        return { draw, draws, boardNumbers };
      }

      draws++;
    }
  });

  const loser = boardBingos.find(
    (b) => b!.draws === Math.max(...boardBingos.map((b) => b!.draws))
  )!;

  const boardSum = loser.boardNumbers
    .filter((n) => !n.checked)
    .reduce((sum, { value }) => sum + value, 0);

  return loser.draw * boardSum;
};

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
