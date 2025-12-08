import type { PuzzleMetadata } from "~/lib/types";
import { partOne, partTwo } from "./solution";

export const sampleInput = ``;

const metadata: PuzzleMetadata[] = [
  {
    srcUrl: `https://adventofcode.com/2025/day/X`,
    solution: partOne,
    prompt: `
--- Day 1: Secret Entrance ---
`,
    sampleInput,
  },
  {
    srcUrl: `https://adventofcode.com/2025/day/X#part2`,
    solution: partTwo,
    sampleInput,
    prompt: `--- Part Two ---`
  },
];

export default metadata;
