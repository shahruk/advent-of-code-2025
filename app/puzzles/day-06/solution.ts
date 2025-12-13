import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

export const parsePuzzleInput = (userInput: string) => {
  let rows = splitUserInputByCharacter(userInput);
  let problems: string[][] = [];
  rows.forEach((row) => {
    let columns = row
      .split(" ")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    columns.forEach((column, index) => {
      if (!problems[index]) problems[index] = [];
      problems[index].push(column);
    });
  });
  return problems;
};

export const solveProblem = (problem: string[]): number => {
  let result = parseInt(problem[0]);
  const operator = problem[problem.length - 1];
  for (let i = 1; i < problem.length - 1; i++) {
    if (operator === "*") result *= parseInt(problem[i]);
    else if (operator === "+") result += parseInt(problem[i]);
  }
  return result;
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const problems = parsePuzzleInput(userInput);
  let result = 0;
  const messages: string[] = [];
  const benchmark = performance.now();
  problems.forEach((problem) => {
    result += solveProblem(problem);
  });
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
