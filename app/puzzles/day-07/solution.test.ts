import { describe, expect, it } from "vitest";
import { partOne } from "./solution";
import metadata from ".";

describe("Advent of Code - Day 7", () => {
  describe("partOne", () => {
    it("returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(21);
    });
  });
});
