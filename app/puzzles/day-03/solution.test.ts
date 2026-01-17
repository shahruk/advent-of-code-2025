import { describe, expect, it } from "vitest";
import { getLargestBatteryCombination, getLargestBatteryPair, partOne, partTwo } from "./solution";
import metadata from ".";

describe("Advent of Code - Day 3", () => {
  describe("getLargestBatteryPair", () => {
    it("returns the correct value", () => {
      expect(getLargestBatteryPair("987654321111111")).toEqual(98);
      expect(getLargestBatteryPair("811111111111119")).toEqual(89);
      expect(getLargestBatteryPair("234234234234278")).toEqual(78);
      expect(getLargestBatteryPair("818181911112111")).toEqual(92);
    });
  });

  describe("getLargestBatteryCombination", () => {
    it("returns the correct value", () => {
      expect(getLargestBatteryCombination("1234", 2)).toEqual(34);
      expect(getLargestBatteryCombination("91234", 2)).toEqual(94);
      expect(getLargestBatteryCombination("987654321111111")).toEqual(987654321111);
      expect(getLargestBatteryCombination("811111111111119")).toEqual(811111111119);
      expect(getLargestBatteryCombination("234234234234278")).toEqual(434234234278);
      expect(getLargestBatteryCombination("818181911112111")).toEqual(888911112111);
    });
  });
  describe("Part One", () => {
    it("it returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(357);
    });
  });

  describe("Part Two", () => {
    it("it returns the correct value", () => {
      expect(partTwo(metadata[0].sampleInput).result).toEqual(3121910778619);
    });
  });
});
