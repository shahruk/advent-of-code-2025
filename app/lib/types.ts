export type PuzzleMetadata = {
  srcUrl: string;
  prompt: string;
  solution: (input: string) => PuzzleSolutionMetadata;
  sampleInput: string;
};
export type PuzzleSolutionMetadata = {
  result: string | number;
  messages?: string[];
  benchmark?: number;
};

export type PuzzleSolutionHandler = {
  (userInput: string): PuzzleSolutionMetadata;
};
