import { describe, expect, it } from "vitest";
import { createNodeMap, partOne, partTwo } from "./solution";
import metadata, { sampleInput, sampleInputDayTwo } from ".";
import { splitUserInputByCharacter } from "~/lib/utils";

describe("Advent of Code - Day 11", () => {
  describe('createNodeMap', () => {
    it('returns a nodeMap', () => {
      const nodeLines = splitUserInputByCharacter(sampleInput);
      const nodeMap = createNodeMap(nodeLines);
      expect(Object.keys(nodeMap).length).toEqual(nodeLines.length);
    });
  });
  describe('partOne', () => {
    it('returns the correct value', () => {
      expect(partOne(sampleInput).result).toEqual(5);
    });
  });
  
  describe('partTwo', () => {
    it('returns the correct value', () => {
      expect(partTwo(sampleInputDayTwo).result).toEqual(2);
    });
  })
});
