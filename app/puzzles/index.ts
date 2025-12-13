import type { PuzzleMetadata } from "~/lib/types";
import day01Puzzles from "~/puzzles/day-01";
import day02Puzzles from "~/puzzles/day-02";
import day03Puzzles from "~/puzzles/day-03";
import day04Puzzles from "~/puzzles/day-04";
import day05Puzzles from "~/puzzles/day-05";
export const puzzles: { [key: number]: PuzzleMetadata[] } = {
  1: day01Puzzles,
  2: day02Puzzles,
  3: day03Puzzles,
  4: day04Puzzles,
  5: day05Puzzles,
};
