import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

type RedTilePositions = {[key: number]: number[]};
type SingleTilePosition = [number, number];

export const getTilePositions = (userInput: string): RedTilePositions => {
  const contents = splitUserInputByCharacter(userInput);
  let results: RedTilePositions = {};
  contents.forEach(line => {
    let [x, y] = line.split(',').map(coord => parseInt(coord));
    if (!results[x]) results[x] = [];
    results[x].push(y);
  });

  Object.keys(results).forEach((key: string) => {
    results[parseInt(key)].sort((a: number, b: number) => a - b);
  })
  return results;
}

export const partOne = (
  userInput: string,
): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput);
  const benchmark = performance.now();
  let result = 0;
  let messages: string[] = [];
  let calculatedPairs: {[key: string]: boolean} = {};
  contents.forEach(point => {
    let pointCoord = point.split(',').map(num => parseInt(num));
    contents.forEach(point2 => {
      if (calculatedPairs[`${point}::${point2}`]) return;
      if (calculatedPairs[`${point2}::${point}`]) return;
      let pointCoord2 = point2.split(',').map(num => parseInt(num));
      calculatedPairs[`${point}::${point2}`] = true;
      let area = Math.abs(pointCoord[0] - pointCoord2[0] + 1) * Math.abs(pointCoord[1] - pointCoord2[1] + 1);
      result = Math.max(result, area);
    })
  });

  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  let result: number = 0;
  let messages: string[] = [];
  return { result, messages, benchmark: performance.now() - benchmark };
};
