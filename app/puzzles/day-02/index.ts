import type { PuzzleMetadata } from "~/lib/types";
import { partOne, partTwo } from "./solution";

export const sampleInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

const metadata: PuzzleMetadata[] = [
  {
    srcUrl: `https://adventofcode.com/2025/day/2`,
    solution: partOne,
    prompt: `
--- Day 2: Gift Shop ---
We are asked to find the invalid IDs by taking a range of numbers and finding the repeating values that exist within the range.
`,
    sampleInput,
  },
  {
    srcUrl: `https://adventofcode.com/2025/day/2#part2`,
    solution: partTwo,
    sampleInput,
    prompt: `--- Part Two ---
We are asked to find the invalid IDs this time by looking for any repeating sequence of numbers.

To solve this, we will loop through the length of the digits as a string to find the cleanly divisible factors and determine if substrings of that amount are repeating.
`,
  },
];

export default metadata;
