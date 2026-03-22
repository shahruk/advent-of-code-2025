import type { PuzzleMetadata } from "~/lib/types";
import { partOne, partTwo } from "./solution";

export const sampleInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

export const sampleInputDayTwo = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

const metadata: PuzzleMetadata[] = [
  {
    srcUrl: `https://adventofcode.com/2025/day/11`,
    solution: partOne,
    prompt: `
--- Day 11: Reactor ---
`,
    sampleInput,
  },
  {
    srcUrl: `https://adventofcode.com/2025/day/11#part2`,
    solution: partTwo,
    sampleInput: sampleInputDayTwo,
    prompt: `--- Part Two ---`,
  },
];

export default metadata;
