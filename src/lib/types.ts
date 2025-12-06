export type PuzzleMetadata = {
  srcUrl: string;
  prompt: string;
  solution: Function;
  sampleInput?: string
};
export type PuzzleSolutionMetadata = {
  result: string | number,
  messages?: string[],
  benchmark?: string
}

export type PuzzleSolutionHandler = {
  (userInput: string): PuzzleSolutionMetadata
}