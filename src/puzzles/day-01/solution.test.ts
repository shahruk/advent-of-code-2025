import { describe, expect, it } from "@jest/globals";
import {
  calculateFullRotationCount,
  calculateNumericalRotation,
  partOne,
  partTwo,
  calculateNewPositionWithRotation,
  //   partTwo,
} from "./solution";
import metadata from ".";

describe("Advent of Code - 2025", () => {
  describe("calculateNumericalRotation", () => {
    it("should correctly return the value from a movement string", () => {
      expect(calculateNumericalRotation("L28")).toEqual(-28);
      expect(calculateNumericalRotation("L128")).toEqual(-128);
      expect(calculateNumericalRotation("R28")).toEqual(28);
      expect(calculateNumericalRotation("R128")).toEqual(128);
    });
  });

  describe("calculateNewPositionWithRotation", () => {
    it("Returns the correct calculated position after a certain rotation", () => {
      expect(calculateNewPositionWithRotation(50, -150)).toEqual(0);
      expect(calculateNewPositionWithRotation(50, -50)).toEqual(0);
      expect(calculateNewPositionWithRotation(50, -49)).toEqual(1);
      expect(calculateNewPositionWithRotation(50, 150)).toEqual(0);
      expect(calculateNewPositionWithRotation(50, 50)).toEqual(0);
      expect(calculateNewPositionWithRotation(50, 49)).toEqual(99);
    });
  });

    describe("calculateFullRotationCount", () => {
      it("Returns the correct number of full rotations", () => {
        expect(calculateFullRotationCount(50, -50)).toEqual(1);
        expect(calculateFullRotationCount(50, 50)).toEqual(1);
        expect(calculateFullRotationCount(50, -150)).toEqual(2);
        expect(calculateFullRotationCount(50, 150)).toEqual(2);
      })
    });

  describe("Day 1", () => {
    it("Returns the correct position for the sample data", () => {
      expect(partOne(metadata[0].sampleInput as string).result).toEqual(3);
    });
  });

  describe("Day 2", () => {
    it("Returns the correct rotations for the sample data", () => {
      expect(partTwo(metadata[0].sampleInput as string).result).toEqual(6);
        expect(partTwo(
        `R1000`
      ).result).toEqual(10);

      expect(partTwo(
        `L50
        L50`
      ).result).toEqual(1);

      expect(partTwo(
        `R50
        L50`
      ).result).toEqual(1);

      expect(partTwo(
        `R50
        R50`
      ).result).toEqual(1);

      expect(partTwo(
        `L150
        L50`
      ).result).toEqual(2);
      expect(partTwo(
        `L150
        R50`
      ).result).toEqual(2);
            expect(partTwo(
        `R150
        R50`
      ).result).toEqual(2);
            expect(partTwo(
        `R150
        R50`
      ).result).toEqual(2);
    });
  });
});
