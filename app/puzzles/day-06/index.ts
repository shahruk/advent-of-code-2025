import type { PuzzleMetadata } from "~/lib/types";
import { partOne, partTwo } from "./solution";

export const sampleInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   + `;

const metadata: PuzzleMetadata[] = [
  {
    srcUrl: `https://adventofcode.com/2025/day/6`,
    solution: partOne,
    prompt: `
--- Day 6: Trash Compactor ---
`,
    sampleInput,
  },
  {
    srcUrl: `https://adventofcode.com/2025/day/6#part2`,
    solution: partTwo,
    sampleInput,
    prompt: `--- Part Two ---`,
  },
];

export default metadata;
