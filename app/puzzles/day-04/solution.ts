import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

export const findAccessibleWithForklift = (input: string[], row: number): number[] => {
  let result = [];
  let positions = [-1, 0, 1];
  for (let i = 0; i < input[row].length; i++) {
    if (input[row][i] === "@") {
      let blockingRollsCount = 0;
      for (const positionX of positions) {
        for (const positionY of positions) {
          if (
            input[row + positionY] &&
            input[row + positionY][i + positionX] === "@" &&
            !(positionX == positionY && positionX == 0)
          ) {
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
    let newMessage = line.split("");
    let markedResults = findAccessibleWithForklift(contents, index);
    result += markedResults.length;
    markedResults.forEach((index) => {
      newMessage[index] = "x";
    });
    messages.push(newMessage.join(""));
  });
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  let result = 0;
  const messages: string[] = [];
  const benchmark = performance.now();
  let contents = splitUserInputByCharacter(userInput);
  let shouldLoop = true;

  messages.push(`Initial state:\n`);
  messages.push(contents.join("\n"));
  messages.push("\n");

  while (shouldLoop) {
    let futureContents: string[] = [];
    let positionsMoved = 0;
    let userMessageContents: string[] = [];
    contents.forEach((line, index) => {
      let markedResults = findAccessibleWithForklift(contents, index);
      userMessageContents[index] = line;
      futureContents[index] = line;
      positionsMoved += markedResults.length;
      markedResults.forEach((column) => {
        futureContents[index] =
          futureContents[index].substring(0, column) + "." + futureContents[index].substring(column + 1);
        userMessageContents[index] =
          userMessageContents[index].substring(0, column) + "x" + userMessageContents[index].substring(column + 1);
      });
    });

    messages.push(`Remove ${positionsMoved} rolls of paper:`);
    messages.push(userMessageContents.join("\n"));
    messages.push("\n");
    result += positionsMoved;
    if (positionsMoved === 0) shouldLoop = false;
    contents = futureContents;
  }
  return { result, messages, benchmark: performance.now() - benchmark };
};
