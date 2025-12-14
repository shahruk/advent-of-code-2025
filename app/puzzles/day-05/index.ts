import type { PuzzleMetadata } from "~/lib/types";
import { partOne, partTwo } from "./solution";

export const sampleInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

const metadata: PuzzleMetadata[] = [
  {
    srcUrl: `https://adventofcode.com/2025/day/5`,
    solution: partOne,
    prompt: `--- Day 5: Cafeteria ---`,
    sampleInput,
  },
  {
    srcUrl: `https://adventofcode.com/2025/day/5#part2`,
    solution: partTwo,
    sampleInput,
    prompt: `--- Part Two ---`,
  },
];

export default metadata;
