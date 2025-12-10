import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

export const getLargestBatteryPair = (input: string): number => {
  let result = 0;
  for(let i = 0; i < input.length - 1; i++) {
    for(let j = i + 1; j < input.length; j++) {
      let numericalPair = parseInt(`${input[i]}${input[j]}`);
      result = Math.max(result, numericalPair);
    }
  }
  return result;
};
export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  contents.forEach(line => result += getLargestBatteryPair(line));
  const messages: string[] = [];
  const benchmark = performance.now();
  contents.forEach((line) => {});
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  const messages: string[] = [];
  const benchmark = performance.now();
  contents.forEach((line) => {});
  return { result, messages, benchmark: performance.now() - benchmark };
};
