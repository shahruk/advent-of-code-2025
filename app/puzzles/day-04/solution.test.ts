import { describe, expect, it } from "vitest";
import { findAccessibleWithForklift, partOne, partTwo } from "./solution";
import metadata, { sampleInput } from ".";
import { splitUserInputByCharacter } from "~/lib/utils";

describe("Advent of Code - Day 4", () => {
  describe('findAccessibleWithForklift', () => {
    it('returns the correct value', () => {
      expect(findAccessibleWithForklift(splitUserInputByCharacter(sampleInput), 0)).toEqual([2,3,5,6,8]);
      expect(findAccessibleWithForklift(splitUserInputByCharacter(sampleInput), 1)).toEqual([0]);
      expect(findAccessibleWithForklift(splitUserInputByCharacter(sampleInput), 2)).toEqual([6]);
      expect(findAccessibleWithForklift(splitUserInputByCharacter(sampleInput), 3)).toEqual([]);
      expect(findAccessibleWithForklift(splitUserInputByCharacter(sampleInput), 4)).toEqual([0, 9]);
      expect(findAccessibleWithForklift(splitUserInputByCharacter(sampleInput), 5)).toEqual([]);
      expect(findAccessibleWithForklift(splitUserInputByCharacter(sampleInput), 6)).toEqual([]);
      expect(findAccessibleWithForklift(splitUserInputByCharacter(sampleInput), 7)).toEqual([0]);
      expect(findAccessibleWithForklift(splitUserInputByCharacter(sampleInput), 8)).toEqual([]);
      expect(findAccessibleWithForklift(splitUserInputByCharacter(sampleInput), 9)).toEqual([0,2,8]);
      
    });
  });

  describe('Part One', () => {
    it('it returns the correct value', () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(13);
    });
  })

  describe('Part Two', () => {
    it('it returns the correct value', () => {
      expect(partTwo(metadata[0].sampleInput).result).toEqual(43);
    });
  })
});
