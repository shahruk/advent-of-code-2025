import { describe, expect, it } from "vitest";
import { calculateMaxAreaWithinPerimeter, getTilePositions, isGreenTile, isRedTile, partOne, partTwo } from "./solution";
import metadata from ".";
import { splitUserInputByCharacter } from "~/lib/utils";

describe("Advent of Code - Day 9", () => {
  const contents = splitUserInputByCharacter(metadata[0].sampleInput);
  const allCoords = getTilePositions(metadata[0].sampleInput);

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

  
  describe('isRedTile', () => {
    it('returns the correct value', () => {
      expect(isRedTile(allCoords, [9,5])).toEqual(true);
      expect(isRedTile(allCoords, [2, 3])).toEqual(true);
    });
  });

  describe.only('isGreenTile', () => {
    it('returns the correct value', () => {
      expect(isGreenTile(allCoords, [2,5])).toEqual(true);
      expect(isGreenTile(allCoords, [9, 3])).toEqual(true);
    });
  });

  describe('calculateMaxAreaWithinPerimeter', () => {

    it('returns the correct value', () => {
      expect(calculateMaxAreaWithinPerimeter(contents, allCoords, [7, 3])).toEqual(15);
    });
  });

  describe("partOne", () => {
    it("returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(50);
    });
  });

  describe("partTwo", () => {
    it("returns the correct value", () => {
      expect(partTwo(metadata[0].sampleInput).result).toEqual(24);
    });
  });
});
