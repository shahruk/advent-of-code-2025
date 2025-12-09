import { describe, expect, it } from "vitest";
import { findInvalidId, partOne, splitPair } from "./solution";
import metadata from ".";

describe("Advent of Code - Day 2", () => {
  describe('splitPair', () => {
    it('should return the correct value', () => {
      expect(splitPair('11-22')).toEqual(['11', '22']);
    });
  });
  describe('findInvalidId', () => {
    it('should return the correct value', () => {
      expect(findInvalidId('11-22')).toEqual([11, 22]);
      expect(findInvalidId('95-115')).toEqual([99]);
      expect(findInvalidId('998-1012')).toEqual([1010]);
      expect(findInvalidId('95-115')).toEqual([99]);
      expect(findInvalidId('222220-222224')).toEqual([222222]);
      expect(findInvalidId('1698522-1698528')).toEqual([]);
      expect(findInvalidId('446443-446449')).toEqual([446446]);
      expect(findInvalidId('38593856-38593862')).toEqual([38593859]);
      expect(findInvalidId('1-23')).toEqual([11, 22]);
    });
  });
  describe('Part 1', () => {
    it('should return the correct value', () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(1227775554);
    });
  });
});
