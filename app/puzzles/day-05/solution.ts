import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

export const parsePuzzleInput = (
  userInput: string
): [[number, number][], number[]] => {
  let splitInputs = splitUserInputByCharacter(userInput, "\n\n");
  let cleanedRanges = flattenAllRanges(
    splitUserInputByCharacter(splitInputs[0]).map(
      (row) =>
        row.split("-").map((range) => parseInt(range)) as [number, number]
    )
  );
  let cleanedNumbers = splitUserInputByCharacter(splitInputs[1]).map((row) =>
    parseInt(row)
  );

  return [cleanedRanges, cleanedNumbers];
};

export const isOverlappingRange = (
  range1: [number, number],
  range2: number[]
): boolean => {
  if (!(range1 && range2)) {
    return false;
  }

  return !(range2[1] < range1[0] || range2[0] > range1[1]);
};

export const flattenRange = (
  range1: [number, number],
  range2: [number, number]
): [number, number] => {
  let min = Math.min(range1[0], range2[0]);
  let max = Math.max(range1[1], range2[1]);
  return [min, max];
};

export const flattenAllRanges = (
  ranges: [number, number][]
): [number, number][] => {
  let results: [number, number][] = [];
  for (let i = 0; i < ranges.length; i++) {
    let overflowsFound = [];
    for (let j = i + 1; j < ranges.length; j++) {
      if (isOverlappingRange(ranges[i], ranges[j])) {
        overflowsFound.push(ranges[j]);
        ranges.splice(j, 1);
        j--;
      }
    }

    let result = ranges[i];
    overflowsFound.forEach((overflowRange) => {
      ranges[i] = result = flattenRange(result, overflowRange);
    });
    if (overflowsFound.length) {
      i--;
    } else {
      results.push(result);
    }
  }
  return results;
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const [ranges, ingredients] = parsePuzzleInput(userInput);
  let result = 0;
  const messages: string[] = [];
  const benchmark = performance.now();
  ingredients.forEach((item) => {
    let itemInRange = false;
    ranges.forEach((range) => {
      if (item >= range[0] && item <= range[1]) {
        itemInRange = true;
      }
    });
    if (itemInRange) {
      result++;
    }
  });
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const [ranges, _ingredients] = parsePuzzleInput(userInput);
  let result = 0;
  console.log(
    "my ranges",
    ranges.sort((a, b) => a[0] - b[0]),
    ranges.length
  );
  const messages: string[] = [];
  const benchmark = performance.now();
  ranges.forEach((range) => {
    result += range[1] + 1 - range[0];
  });
  return { result, messages, benchmark: performance.now() - benchmark };
};
