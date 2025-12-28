import { describe, expect, it } from "vitest";
import {
  calculateAreaBetweenPoints,
  checkIsValidRectangle,
  getColumnMinMax,
  getTilePositions,
  partOne,
  partTwo,
} from "./solution";
import metadata from ".";
import { splitUserInputByCharacter } from "~/lib/utils";

describe("Advent of Code - Day 9", () => {
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

  describe("getColumnMinMax", () => {
    it("returns the correct value", () => {
      expect(getColumnMinMax(metadata[0].sampleInput)).toEqual({
        2: [3, 5],
        3: [3, 5],
        4: [3, 5],
        5: [3, 5],
        6: [3, 5],
        7: [1, 5],
        8: [1, 5],
        9: [1, 7],
        10: [1, 7],
        11: [1, 7],
      });
    });
  });

  describe("checkIsValidRectangle", () => {
    it("returns the correct value", () => {
      const allCoords = getTilePositions(metadata[0].sampleInput);
      const allCoordsRange = getColumnMinMax(metadata[0].sampleInput);
      let isValid = checkIsValidRectangle(allCoords, allCoordsRange, [11, 7], [2, 3]);
      expect(isValid).toEqual(false);

      isValid = checkIsValidRectangle(allCoords, allCoordsRange, [2, 3], [11, 7]);
      expect(isValid).toEqual(false);
    });
  });

  describe("calculateAreaBetweenPoints", () => {
    it("returns the correct value", () => {
      expect(calculateAreaBetweenPoints([7, 3], [11, 1])).toEqual(15);
      expect(calculateAreaBetweenPoints([9, 7], [9, 5])).toEqual(3);
      expect(calculateAreaBetweenPoints([9, 5], [2, 3])).toEqual(24);
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
      // Further examples courtesy of https://www.reddit.com/r/adventofcode/comments/1pi36pq/2025_day_9_part_2_more_examples_to_soften_your/
      expect(
        partTwo(
          `4,2
          13,2
          13,4
          8,4
          8,6
          11,6
          11,10
          4,10`
        ).result
      ).toEqual(40);

      expect(
        partTwo(`3,2
        13,2
        13,4
        8,4
        8,6
        11,6
        11,11
        7,11
        7,8
        5,8
        5,10
        3,10`).result
      ).toEqual(35);

      expect(
        partTwo(
          `3,2
          17,2
          17,13
          13,13
          13,11
          15,11
          15,8
          11,8
          11,15
          18,15
          18,17
          4,17
          4,12
          6,12
          6,5
          3,5`
        ).result
      ).toEqual(66);

      expect(partTwo(
        `0,0
          0,1
          2,1
          2,3
          0,3
          0,4
          3,4
          3,0`)
      .result).toEqual(8);
    });
  });
});
