import type { PuzzleMetadata } from "~/lib/types";
import { partOne, partTwo } from "./solution";

export const sampleInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

const metadata: PuzzleMetadata[] = [
  {
    srcUrl: `https://adventofcode.com/2025/day/9`,
    solution: partOne,
    prompt: `
--- Day 9: Movie Theater ---
`,
    sampleInput,
  },
  {
    srcUrl: `https://adventofcode.com/2025/day/9#part2`,
    solution: partTwo,
    sampleInput,
    prompt: `--- Part Two ---`,
  },
];

export default metadata;
