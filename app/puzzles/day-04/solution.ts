import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

export const findAccessibleWithForklift = (input: string[], row: number): number[] => {
  let result = [];
  let positions = [-1, 0, 1];
  for(let i = 0; i < input[row].length; i++) {
    if (input[row][i] === '@') {
      let blockingRollsCount = 0;
      for(const positionX of positions) {
        for(const positionY of positions) {
          if (input[row + positionY] && input[row + positionY][i + positionX] === '@' && !(positionX == positionY && positionX == 0)) {
            blockingRollsCount++;
            if (blockingRollsCount >= 4) break;
          }
        }
        if (blockingRollsCount >= 4) break;
      }
      if (blockingRollsCount < 4) result.push(i);
    }
  }
  return result;
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const messages: string[] = [];
  const benchmark = performance.now();
  let result = 0;
  const contents = splitUserInputByCharacter(userInput);
  contents.forEach((line, index) => {
    let newMessage = line.split('');
    let markedResults = findAccessibleWithForklift(contents, index);
    markedResults.forEach(index => {
      newMessage[index] = 'x';
    });
    result += markedResults.length;
    messages.push(newMessage.join(''));
  });
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  let result = 0;
  const messages: string[] = [];
  const benchmark = performance.now();
  const contents = splitUserInputByCharacter(userInput);
  // contents.forEach((line, index) => {
  //   result += findAccessibleWithForklift(contents, index).length;
  // });
  return { result, messages, benchmark: performance.now() - benchmark };
};
