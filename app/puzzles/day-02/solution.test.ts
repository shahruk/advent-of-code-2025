import { describe, expect, it } from "vitest";
import {
  findInvalidId,
  findInvalidIdWithMultiples,
  partOne,
  partTwo,
  splitPair,
} from "./solution";
import metadata from ".";

describe("Advent of Code - Day 2", () => {
  describe("splitPair", () => {
    it("should return the correct value", () => {
      expect(splitPair("11-22")).toEqual(["11", "22"]);
    });
  });
  describe("findInvalidId", () => {
    it("should return the correct value", () => {
      expect(findInvalidId("11-22")).toEqual([11, 22]);
      expect(findInvalidId("95-115")).toEqual([99]);
      expect(findInvalidId("998-1012")).toEqual([1010]);
      expect(findInvalidId("95-115")).toEqual([99]);
      expect(findInvalidId("222220-222224")).toEqual([222222]);
      expect(findInvalidId("1698522-1698528")).toEqual([]);
      expect(findInvalidId("446443-446449")).toEqual([446446]);
      expect(findInvalidId("38593856-38593862")).toEqual([38593859]);
      expect(findInvalidId("1-23")).toEqual([11, 22]);
    });
  });

  describe("findInvalidIdWithMultiples", () => {
    it("should return the correct value", () => {
      expect(findInvalidIdWithMultiples("11-22")).toEqual([11, 22]);
      expect(findInvalidIdWithMultiples("95-115")).toEqual([99, 111]);
      expect(findInvalidIdWithMultiples("998-1012")).toEqual([999, 1010]);
      expect(findInvalidIdWithMultiples("1188511880-1188511890")).toEqual([
        1188511885,
      ]);
      expect(findInvalidIdWithMultiples("222220-222224")).toEqual([222222]);
      expect(findInvalidIdWithMultiples("1698522-1698528")).toEqual([]);
      expect(findInvalidIdWithMultiples("446443-446449")).toEqual([446446]);
      expect(findInvalidIdWithMultiples("38593856-38593862")).toEqual([
        38593859,
      ]);
      expect(findInvalidIdWithMultiples("565653-565659")).toEqual([565656]);
      expect(findInvalidIdWithMultiples("824824821-824824827")).toEqual([
        824824824,
      ]);
      expect(findInvalidIdWithMultiples("2121212118-2121212124")).toEqual([
        2121212121,
      ]);
    });
  });
  describe("Part 1", () => {
    it("should return the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(1227775554);
    });
  });

  describe("Part 2", () => {
    it("should return the correct value", () => {
      expect(partTwo(metadata[1].sampleInput).result).toEqual(4174379265);
    });
  });
});
