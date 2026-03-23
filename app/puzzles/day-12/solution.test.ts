import { describe, expect, it } from "vitest";
import { partOne, ProblemSolver } from "./solution";
import metadata, { sampleInput } from ".";

describe("Advent of Code - Day 12", () => {
  describe("ProblemSolver", () => {
    const solver = new ProblemSolver(sampleInput);
    it("parses the inputs correctly", () => {
      console.log(solver.regions);
      expect(solver.shapes.length).toEqual(6);
      expect(solver.regions.length).toEqual(3);
    });
  });
});
