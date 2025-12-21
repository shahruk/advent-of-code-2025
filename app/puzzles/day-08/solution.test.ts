import { describe, expect, it } from "vitest";
import { findEuclidianDistance, partOne, partTwo } from "./solution";
import metadata from ".";

describe("Advent of Code - Day 8", () => {
  describe("findEuclidianDistance", () => {
    it("returns the correct value", () => {
      expect(Math.floor(findEuclidianDistance("431,825,988", "162,817,812"))).toEqual(321);
    });
  });

  describe("partOne", () => {
    it("returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput, 10).result).toEqual(40);
    });
  });

  // describe("partTwo", () => {
  //   it("returns the correct value", () => {
  //     expect(partTwo(metadata[0].sampleInput).result).toEqual(40);
  //   });
  // });
});
