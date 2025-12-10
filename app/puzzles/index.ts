import type { PuzzleMetadata } from "~/lib/types";
import day01Puzzles from "~/puzzles/day-01";
import day02Puzzles from "~/puzzles/day-02";
import day03Puzzles from "~/puzzles/day-03";
export const puzzles: { [key: number]: PuzzleMetadata[] } = {
  1: day01Puzzles,
  2: day02Puzzles,
  3: day03Puzzles
};
