import { describe, expect, it } from "vitest";
import {
  drawGrid,
  getGreenTilePositions,
  getRedTilePositions,
  isAllGreenOrRed,
  isGreenTile,
  isRedTile,
  partOne,
  partTwo,
} from "./solution";
import metadata from ".";

const doubleSquare = `
1,0
18,0
18,9
1,9
1,0
3,2
16,2
16,7
3,7
3,2`;

const hShape = `1,0
3,0
3,6
16,6
16,0
18,0
18,9
13,9
13,7
6,7
6,9
1,9`;
const lShape = `1,1
    8,1
    8,3
    3,3
    3,4
    8,4
    8,9
    18,9
    18,11
    5,11
    5,9
    4,9
    4,11
    1,11
    1,7
    6,7
    6,6
    1,6`;

describe("Advent of Code - Day 9", () => {
  describe('drawGrid', () => {
    it.only('returns the correct value', () => {
      const outerRectangle = `
1,0
18,0
18,9
1,9
1,0`;

const innerRectangle = `
3,2
16,2
16,7
3,7
3,2`;
console.log(drawGrid(outerRectangle));
console.log(drawGrid(innerRectangle));
      console.log(drawGrid(doubleSquare));
      const redTilePositions = getRedTilePositions(doubleSquare);
      const greenTilePositions = getGreenTilePositions(doubleSquare);
      expect(isAllGreenOrRed([1, 0], [18, 11], redTilePositions, greenTilePositions)).toEqual(false);
    })
  });
  describe("getRedTilePositions", () => {
    it("returns the correct value", () => {
      expect(getRedTilePositions(metadata[0].sampleInput)[0]).toEqual({
        2: [3, 5],
        7: [1, 3],
        9: [5, 7],
        11: [1, 7],
      });

      expect(getRedTilePositions(metadata[0].sampleInput)[1]).toEqual({
        1: [7, 11],
        3: [2, 7],
        5: [2, 9],
        7: [9, 11],
      });
    });
  });

  describe("getGreenTilePositions", () => {
    it("returns the correct value", () => {
      expect(getGreenTilePositions(metadata[0].sampleInput)[0]).toEqual({
        2: [[3, 5]],
        7: [[1, 3]],
        9: [[5, 7]],
        11: [[1, 7]],
      });

      expect(getGreenTilePositions(hShape)[1][0]).toEqual([
        [1, 3],
        [16, 18],
      ]);
    });

    it("merges adjacent pairs", () => {
      console.log(getGreenTilePositions(lShape)[1]);
      expect(getGreenTilePositions(lShape)[0]).toEqual({
        "1": [
          [1, 6],
          [7, 11],
        ],
        "3": [[3, 4]],
        "4": [[9, 11]],
        "5": [[9, 11]],
        "6": [[6, 7]],
        "8": [
          [1, 3],
          [4, 9],
        ],
        "18": [[9, 11]],
      });

      expect(getGreenTilePositions(lShape)[1]).toEqual({
        "1": [[1, 8]],
        "3": [[3, 8]],
        "4": [[3, 8]],
        "6": [[1, 6]],
        "7": [[1, 6]],
        "9": [
          [4, 5],
          [8, 18],
        ],
        "11": [
          [1, 4],
          [5, 18],
        ],
      });
    });
  });

  describe("isGreenTile", () => {
    const greenTilePositions = getGreenTilePositions(metadata[0].sampleInput);
    it("returns the correct value", () => {
      expect(isGreenTile(greenTilePositions, [9, 3])).toEqual(true);
    });

    it("returns the correct value", () => {
      const input = `3,2
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
          3,5`;
      const greenTilePositions = getGreenTilePositions(input);
      expect(isGreenTile(greenTilePositions, [12, 12])).toEqual(false);
    });
  });

  describe("isRedTile", () => {
    it("returns the correct values", () => {
      let input = `3,2
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
          3,5`;
      const redTilePositions = getRedTilePositions(input);
      expect(isRedTile([12, 12], redTilePositions)).toEqual(false);
    });
  });

  describe("isAllGreenOrRed", () => {
    it("returns the correct value", () => {
      const redTilePositions = getRedTilePositions(metadata[0].sampleInput);
      const greenTilePositions = getGreenTilePositions(metadata[0].sampleInput);
      expect(isAllGreenOrRed([11, 1], [2, 5], redTilePositions, greenTilePositions)).toEqual(false);
      expect(isAllGreenOrRed([11, 1], [2, 3], redTilePositions, greenTilePositions)).toEqual(false);
    });

    it("returns the correct value", () => {
      let input = `3,2
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
          3,5`;
      const redTilePositions = getRedTilePositions(input);
      const greenTilePositions = getGreenTilePositions(input);
      expect(isGreenTile(greenTilePositions, [12, 12])).toEqual(false);
      expect(isAllGreenOrRed([17, 2], [6, 12], redTilePositions, greenTilePositions)).toBe(false);
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

      // https://www.reddit.com/r/adventofcode/comments/1pi5rqn/2025_day_9_part_2_check_your_solution_with_this/

      expect(partTwo(hShape).result).toEqual(30);
      expect(partTwo(lShape).result).toEqual(88);
    });

    expect(
      partTwo(`1,5
    3,5
    3,8
    7,8
    7,5
    9,5
    9,10
    11,10
    11,3
    6,3
    6,7
    4,7
    4,1
    13,1
    13,12
    1,12`).result
    ).toEqual(72);

    it("returns the correct value", () => {
      const input = `0,0
          0,1
          2,1
          2,3
          0,3
          0,4
          3,4
          3,0`;
      console.log(drawGrid(input).join("\n"));
      expect(partTwo(input).result).toEqual(8);
    });

    it("handles large ranges", () => {
      const input = `0,0
      0,10000000
      10000000,0
      999999999999910000000,0
      10000000,10000000`;
      expect(partTwo(input).result).toEqual(100000020000001);
    });
  });
});
