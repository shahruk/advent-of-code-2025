import type { PuzzleMetadata } from "~/lib/types";
import { partOne, partTwo } from "./solution";

export const sampleInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

const metadata: PuzzleMetadata[] = [
  {
    srcUrl: `https://adventofcode.com/2025/day/1`,
    solution: partOne,
    prompt: `
--- Day 1: Secret Entrance ---
This challenge asks us to calculate the final position of a dial as it's rotated around. To solve this we need to keep track of the current position and reset it to 100 or 0, depending on which direction the rotation is taking place.
`,
    sampleInput,
  },
  {
    srcUrl: `https://adventofcode.com/2025/day/1#part2`,
    solution: partTwo,
    sampleInput,
    prompt: `--- Part Two ---
Part two of this problem requires us to keep track of the number of times the dial has been reset during its rotation.`,
  },
];

export default metadata;
