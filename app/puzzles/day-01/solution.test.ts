import { describe, expect, it } from "vitest";
import {
  calculateFullRotationCount,
  calculateNumericalRotation,
  partOne,
  partTwo,
  calculateNewPositionWithRotation,
} from "./solution";
import metadata from ".";

describe("Day one", () => {
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
    });
  });

  describe("Part 1", () => {
    it("Returns the correct position for the sample data", () => {
      expect(partOne(metadata[0].sampleInput as string).result).toEqual(3);
    });
  });

  describe("Part 2", () => {
    it("Returns the correct rotations for the sample data", () => {
      expect(partTwo(metadata[0].sampleInput as string).result).toEqual(6);
      expect(partTwo(`R1000`).result).toEqual(10);
    });
  });
});
