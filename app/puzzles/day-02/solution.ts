import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

export const splitPair = (input: string): string[] => {
  return input.trim().split("-");
};

export const findInvalidId = (inputs: string): number[] => {
  let result: number[] = [];
  let stringPair = splitPair(inputs);
  let firstNum = parseFloat(stringPair[0]);
  let lastNum = parseFloat(stringPair[1]);
  // If both odd and the range is the same
  if (
    stringPair[0].length % 2 != 0 &&
    stringPair[0].length === stringPair[1].length
  ) {
    return result;
  }
  for (let i = firstNum; i <= lastNum; i++) {
    let numberString = i.toString();
    if (numberString.length % 2 != 0) {
      i = Math.pow(10, numberString.length) - 1;
    } else {
      let firstHalf = numberString.substring(0, numberString.length / 2);
      let secondHalf = numberString.substring(numberString.length / 2);
      if (firstHalf === secondHalf) result.push(i);
    }
  }
  return result;
};

export const findInvalidIdWithMultiples = (inputs: string): number[] => {
  let result: number[] = [];
  let stringPair = splitPair(inputs);
  let firstNum = parseFloat(stringPair[0]);
  let lastNum = parseFloat(stringPair[1]);
  for (let i = firstNum; i <= lastNum; i++) {
    let numberString = i.toString();
    for (let j = 1; j <= numberString.length; j++) {
      // If the number of digits is cleanly divisible lets check if it's repeating
      if (numberString.length % j === 0) {
        let isRepeatingSequence = false;
        let strings = [];
        for (let k = 0; k < numberString.length; k += j) {
          strings.push(numberString.substring(k, k + j));
        }
        if (
          strings.length > 1 &&
          strings.filter((str) => str === strings[0]).length === strings.length
        ) {
          isRepeatingSequence = true;
        }
        if (isRepeatingSequence && !result.includes(i)) result.push(i);
      }
    }
  }
  return result;
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput, ",");
  let result = 0;
  const messages: string[] = [];
  const benchmark = performance.now();
  contents.forEach((pair) => {
    let invalids = findInvalidId(pair);
    if (invalids.length) {
      result += invalids.reduce((acc, val) => acc + val, 0);
      messages.push(
        `${pair} has ${invalids.length} invalid IDs, ${invalids.join(" and ")}.`
      );
    } else {
      messages.push(`${pair} contains no invalid IDs.`);
    }
  });
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput, ",");
  let result = 0;
  const messages: string[] = [];
  const benchmark = performance.now();
  contents.forEach((pair) => {
    let invalids = findInvalidIdWithMultiples(pair);
    if (invalids.length) {
      result += invalids.reduce((acc, val) => acc + val, 0);
      messages.push(
        `${pair} has ${invalids.length} invalid IDs, ${invalids.join(" and ")}.`
      );
    } else {
      messages.push(`${pair} contains no invalid IDs.`);
    }
  });
  return { result, messages, benchmark: performance.now() - benchmark };
};
