import { describe, expect, it } from "vitest";
import { getLargestBatteryPair, partOne } from "./solution";
import metadata from ".";

describe("Advent of Code - Day 3", () => {
  describe('getLargestBatteryPair', () => {
    it('returns the correct value', () => {
      expect(getLargestBatteryPair('987654321111111')).toEqual(98);
      expect(getLargestBatteryPair('811111111111119')).toEqual(89);
      expect(getLargestBatteryPair('234234234234278')).toEqual(78);
      expect(getLargestBatteryPair('818181911112111')).toEqual(92);
    });
  })
  describe('Part One', () => {
    it('it returns the correct value', () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(357);
    });
  })
});
