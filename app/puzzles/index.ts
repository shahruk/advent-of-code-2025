import type { PuzzleMetadata } from "~/lib/types";
import day01Puzzles from "~/puzzles/day-01";
import day02Puzzles from "~/puzzles/day-02";
import day03Puzzles from "~/puzzles/day-03";
import day04Puzzles from "~/puzzles/day-04";
import day05Puzzles from "~/puzzles/day-05";
import day06Puzzles from "~/puzzles/day-06";
import day07Puzzles from "~/puzzles/day-07";
import day08Puzzles from "~/puzzles/day-08";
import day09Puzzles from "~/puzzles/day-09";
import day10Puzzles from "~/puzzles/day-10";
import day11Puzzles from "~/puzzles/day-11";
import day12Puzzles from "~/puzzles/day-12";

export const puzzles: { [key: number]: PuzzleMetadata[] } = {
  1: day01Puzzles,
  2: day02Puzzles,
  3: day03Puzzles,
  4: day04Puzzles,
  5: day05Puzzles,
  6: day06Puzzles,
  7: day07Puzzles,
  8: day08Puzzles,
  9: day09Puzzles,
  10: day10Puzzles,
  11: day11Puzzles,
  12: day12Puzzles,
};
