import type { PuzzleMetadata } from "~/lib/types";
import { partOne, partTwo } from "./solution";

export const sampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

const metadata: PuzzleMetadata[] = [
  {
    srcUrl: `https://adventofcode.com/2025/day/4`,
    solution: partOne,
    prompt: `--- Day 4: Printing Department ---`,
    sampleInput,
  },
  {
    srcUrl: `https://adventofcode.com/2025/day/4#part2`,
    solution: partTwo,
    sampleInput,
    prompt: `--- Part Two ---`,
  },
];

export default metadata;
