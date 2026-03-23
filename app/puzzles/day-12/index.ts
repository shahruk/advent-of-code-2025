import type { PuzzleMetadata } from "~/lib/types";
import { partOne } from "./solution";

export const sampleInput = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;

const metadata: PuzzleMetadata[] = [
  {
    srcUrl: `https://adventofcode.com/2025/day/12`,
    solution: partOne,
    prompt: `
--- Day 12: Christmas Tree Farm ---
`,
    sampleInput: "",
  },
];

export default metadata;
