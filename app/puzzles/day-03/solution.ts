import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

export const getLargestBatteryPair = (input: string): number => {
  let result = 0;
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      let numericalPair = parseInt(`${input[i]}${input[j]}`);
      result = Math.max(result, numericalPair);
    }
  }
  return result;
};

// Loop until our result has the number of characters required
export const getLargestBatteryCombination = (
  input: string,
  numberOfSelections = 12
) => {
  let result = ``;
  let startingIndex = 0;
  while (result.length < numberOfSelections) {
    let localMaximum = 0;
    let numberOfCharactersRemaining = numberOfSelections - result.length;
    let rangeEnd = input.length - numberOfCharactersRemaining;
    for (let i = startingIndex; i <= rangeEnd; i++) {
      // Find largest number in the range
      let number = parseInt(input[i]);
      if (number > localMaximum) {
        localMaximum = number;
        startingIndex = i + 1;
      }
    }
    result += localMaximum;
  }
  return parseInt(result);
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput);
  const messages: string[] = [];
  const benchmark = performance.now();
  let result = 0;
  contents.forEach((line) => (result += getLargestBatteryPair(line)));
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  const messages: string[] = [];
  const benchmark = performance.now();
  contents.forEach((line) => (result += getLargestBatteryCombination(line)));
  return { result, messages, benchmark: performance.now() - benchmark };
};
