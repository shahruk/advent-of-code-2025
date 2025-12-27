import { describe, expect, it } from "vitest";
import { getTilePositions, partOne, partTwo } from "./solution";
import metadata from ".";

describe("Advent of Code - Day 9", () => {
  describe("getTilePositions", () => {
    it("returns the correct value", () => {
      expect(getTilePositions(metadata[0].sampleInput)).toEqual({
        2: [3, 5],
        7: [1, 3],
        9: [5, 7],
        11: [1, 7],
      });
    });
  });


  describe("partOne", () => {
    it("returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(50);
    });
  });

  describe("partTwo", () => {
    it("returns the correct value", () => {
      expect(partTwo(metadata[0].sampleInput).result).toEqual(0);
    });
  });
});
