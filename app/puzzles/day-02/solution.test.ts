import { describe, expect, it } from "vitest";
import { partOne } from "./solution";
import metadata from ".";

describe("Advent of Code - Day 2", () => {
  describe('Part 1', () => {
    expect(partOne(metadata[0].sampleInput).result).toEqual(1227775554);
  });
});
