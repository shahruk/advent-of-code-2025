import { describe, expect, it } from "vitest";
import { calculateAreaBetweenPoints, calculateMaxAreaWithinPerimeter, getTilePositions, isGreenTile, isRedTile, partOne, partTwo } from "./solution";
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

  describe('calculateAreaBetweenPoints', () => {
    it('returns the correct value', () => {
      expect(calculateAreaBetweenPoints([7,3], [11,1])).toEqual(15);
      expect(calculateAreaBetweenPoints([9,7], [9,5])).toEqual(3);
      expect(calculateAreaBetweenPoints([9,5], [2,3])).toEqual(24);
    })
  });
  
  describe('isRedTile', () => {
    it('returns the correct value', () => {
      expect(isRedTile(allCoords, [9,5])).toEqual(true);
      expect(isRedTile(allCoords, [2, 3])).toEqual(true);
    });
  });

  describe('isGreenTile', () => {
    it('returns the correct value', () => {
      expect(isGreenTile(allCoords, [2,1])).toEqual(false);
      expect(isGreenTile(allCoords, [9, 3])).toEqual(true);
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
