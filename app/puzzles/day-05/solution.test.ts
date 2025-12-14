import { describe, expect, it } from "vitest";
import {
  flattenAllRanges,
  flattenRange,
  isOverlappingRange,
  parsePuzzleInput,
  partOne,
  partTwo,
} from "./solution";
import metadata, { sampleInput } from ".";

describe("Advent of Code - Day 5", () => {
  describe("parsePuzzleInput", () => {
    it("returns the correct value", () => {
      expect(parsePuzzleInput(sampleInput).length).toEqual(2);
      expect(parsePuzzleInput(sampleInput)[0]).toEqual([
        [3, 5],
        [10, 20],
      ]);
    });
  });

  describe("isOverlappingRange", () => {
    it("returns the correct value", () => {
      expect(isOverlappingRange([1, 5], [5, 10])).toEqual(true);
      expect(isOverlappingRange([3, 5], [10, 14])).toEqual(false);
      expect(isOverlappingRange([16, 20], [12, 18])).toEqual(true);
    });
  });

  describe("flattenRange", () => {
    it("returns the correct value", () => {
      expect(flattenRange([16, 20], [12, 18])).toEqual([12, 20]);
    });
  });
  describe("flattenAllRanges", () => {
    it("returns the correct value", () => {
      expect(
        flattenAllRanges([
          [16, 20],
          [12, 18],
        ])
      ).toEqual([[12, 20]]);
      expect(
        flattenAllRanges([
          [16, 20],
          [12, 18],
          [15, 18],
          [16, 20],
        ])
      ).toEqual([[12, 20]]);
      expect(
        flattenAllRanges([
          [3, 5],
          [10, 14],
          [16, 20],
          [12, 18],
        ])
      ).toEqual([
        [3, 5],
        [10, 20],
      ]);
    });
  });

  describe("Part One", () => {
    it("it returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(3);
    });
  });

  describe("Part Two", () => {
    it("it returns the correct value", () => {
      expect(partTwo(metadata[0].sampleInput).result).toEqual(14);
    });
  });
});
