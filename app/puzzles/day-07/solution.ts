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
  let pathsToExplore: number[][][] = [[[startingColumn, 1]]];
  let results = [];
  let visitedNodes = {};
  
  while (pathsToExplore.length) {
    let path = pathsToExplore.pop() as number[][];
    let [column, row] = path[path.length - 1];
    if (column < 0 || column > maxColumns) {
      continue;
    }
    if (row >= contents.length) {
      results.push(path);
    } else {
      if (contents[row][column] === ".") {
        pathsToExplore.push(path.concat([[column, row + 1]]));
      } else if (contents[row][column] === "^") {
        pathsToExplore.push(path.concat([[column - 1, row]]));
        pathsToExplore.push(path.concat([[column + 1, row]]));
      }
    }
  }
  result = results.length;
  return { result, messages, benchmark: performance.now() - benchmark };
};
