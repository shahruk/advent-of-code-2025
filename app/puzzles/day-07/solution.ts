import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  const contents = splitUserInputByCharacter(userInput);
  const maxColumns = contents[0].length - 1;
  let result = 0;
  let messages: string[] = contents;
  const startingColumn = contents[0].indexOf("S") as number;
  let allBeamPositions: [number, number][] = [[startingColumn, 1]];

  while (allBeamPositions.length) {
    let [column, row] = allBeamPositions.shift() as [number, number];
    if (row >= contents.length || column < 0 || column > maxColumns) {
      continue;
    }
    if (contents[row][column] === ".") {
      contents[row] =
        contents[row].substring(0, column) +
        "|" +
        contents[row].substring(column + 1);
      allBeamPositions.push([column, row + 1]);
    } else if (contents[row][column] === "^") {
      result++;
      allBeamPositions.push([column - 1, row]);
      allBeamPositions.push([column + 1, row]);
    }
  }
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  const contents = splitUserInputByCharacter(userInput);
  const maxColumns = contents[0].length - 1;
  let result = 0;
  let messages: string[] = contents;
  const startingColumn = contents[0].indexOf("S") as number;
  let nodesToExplore: number[][] = [[startingColumn, 1]];
  let ancestorNodes: {
    [key: number]: {
      [key: number]: number;
    };
  } = {
    1: {
      [startingColumn]: 1
    }
  };

  const markAncestorNodes = (
    futureRow: number,
    futureColumn: number,
    currentRow: number,
    currentColumn: number
  ) => {
    if (!ancestorNodes[futureRow]) {
      ancestorNodes[futureRow] = {};
    }
    if (!ancestorNodes[futureRow][futureColumn]) {
      ancestorNodes[futureRow][futureColumn] = ancestorNodes[currentRow][currentColumn];
      contents[futureRow] = contents[futureRow].substring(0, futureColumn) +
        "|" +
        contents[futureRow].substring(futureColumn + 1);
      let newPath = [futureColumn, futureRow];
      if (futureRow === currentRow) {
        nodesToExplore.unshift(newPath);
      } else {
        nodesToExplore.push(newPath);
      }
    } else {
      ancestorNodes[futureRow][futureColumn] += ancestorNodes[currentRow][currentColumn];
    }
  };
  while (nodesToExplore.length) {
    let path = nodesToExplore.shift() as number[];
    let [column, row] = path;
    if (column < 0 || column > maxColumns || row > contents.length - 1) {
      continue;
    }
    let futureRow = row + 1;
    let futureColumn = column;
    if (!contents[futureRow]) {
      continue;
    }
    if (['.', '|'].includes(contents[futureRow][futureColumn])) markAncestorNodes(futureRow, futureColumn, row, column);
    else if (contents[futureRow][futureColumn] === '^'){
      markAncestorNodes(futureRow, futureColumn - 1, row, column);
      markAncestorNodes(futureRow, futureColumn + 1, row, column);
    }
  }

  result = Object.values(ancestorNodes[contents.length - 1]).reduce((acc: number, value: number) => acc += value, 0);
  return { result, messages, benchmark: performance.now() - benchmark };
};
