import type { PuzzleMetadata } from "~/lib/types";
import { partOne, partTwo } from "./solution";

export const sampleInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

const metadata: PuzzleMetadata[] = [
  {
    srcUrl: `https://adventofcode.com/2025/day/3`,
    solution: partOne,
    prompt: `--- Day 3: Lobby ---`,
    sampleInput,
  },
  {
    srcUrl: `https://adventofcode.com/2025/day/3#part2`,
    solution: partTwo,
    sampleInput,
    prompt: `--- Part Two ---`,
  },
];

export default metadata;
