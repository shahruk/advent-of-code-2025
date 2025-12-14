import { describe, expect, it } from "vitest";
import { partOne, partTwo } from "./solution";
import metadata from ".";

describe("Advent of Code - Day 7", () => {
  describe("partOne", () => {
    it("returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(21);
    });
  });

  describe("partTwo", () => {
    it("returns the correct value", () => {
      expect(partTwo(metadata[0].sampleInput).result).toEqual(40);
    });
  });
});
