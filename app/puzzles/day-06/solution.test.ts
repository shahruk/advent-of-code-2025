import { describe, expect, it } from "vitest";
import { parsePuzzleInput, partOne, partTwo, solveProblem } from "./solution";
import metadata, { sampleInput } from ".";

describe("Advent of Code - Day 6", () => {
  describe("parsePuzzleInput", () => {
    it("returns the correct value", () => {
      expect(parsePuzzleInput(metadata[0].sampleInput)).toEqual([
        ["123", "45", "6", "*"],
        ["328", "64", "98", "+"],
        ["51", "387", "215", "*"],
        ["64", "23", "314", "+"],
      ]);
    });
  });

  describe("solveProblem", () => {
    it("returns the correct value", () => {
      expect(solveProblem(["123", "45", "6", "*"])).toEqual(33210);
      expect(solveProblem(["328", "64", "98", "+"])).toEqual(490);
      expect(solveProblem(["51", "387", "215", "*"])).toEqual(4243455);

      expect(solveProblem(["64", "23", "314", "+"])).toEqual(401);
    });
  });

  describe("Part One", () => {
    it("it returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(4277556);
    });
  });

  // describe("Part Two", () => {
  //   it("it returns the correct value", () => {
  //     expect(partTwo(metadata[0].sampleInput).result).toEqual(14);
  //   });
  // });
});
