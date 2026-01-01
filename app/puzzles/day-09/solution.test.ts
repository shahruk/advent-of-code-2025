import { describe, expect, it } from "vitest";
import {
  calculateAreaBetweenPoints,
  drawGrid,
  getGreenTilePositions,
  getRedTilePositions,
  isAllGreenOrRed,
  isGreenTile,
  isIntersected,
  isRedTile,
  isWithinPerimeter,
  partOne,
  partTwo,
} from "./solution";
import metadata from ".";

describe("Advent of Code - Day 9", () => {
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
    });
  });

  describe('isIntersected', () => {
    it('returns the correct value', () => {
      let input = `4,2
          13,2
          13,4
          8,4
          8,6
          11,6
          11,10
          4,10`;
          let redTilePositions = getRedTilePositions(input);
          let point1: [number, number] = [ 4, 2 ];
          let point2: [number, number] = [ 11, 10 ] ;
      expect(isIntersected(point1, point2, redTilePositions)).toEqual(true);
    })
  })

    describe('isGreenTile', () => {
      const greenTilePositions = getGreenTilePositions(metadata[0].sampleInput);
      it('returns the correct value', () => {
        expect(isGreenTile(greenTilePositions, [ 9, 3 ])).toEqual(true);
      });

      it('returns the correct value', () => {
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
          console.log(drawGrid(input, [12, 12]).join('\n'))
          expect(isGreenTile(greenTilePositions, [12, 12])).toEqual(false);
      })
    });

    describe('isRedTile', () => {
      it('returns the correct values', () => {
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
    })

    describe('isAllGreenOrRed', () => {
      it('returns the correct value', () => {
        const redTilePositions = getRedTilePositions(metadata[0].sampleInput);
        const greenTilePositions = getGreenTilePositions(metadata[0].sampleInput);
        expect(isAllGreenOrRed([11,1], [2,5], redTilePositions, greenTilePositions)).toEqual(false);
        expect(isAllGreenOrRed([11,1], [2,3], redTilePositions, greenTilePositions)).toEqual(false);
      });

      it('returns the correct value', () => {
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
        console.log(drawGrid(input, [12, 12]).join('\n'));
        expect(isGreenTile(greenTilePositions, [12, 12])).toEqual(false);
        expect(isAllGreenOrRed([17,2], [6,12], redTilePositions, greenTilePositions)).toBe(false);
      })
    })
  describe("isWithinPerimeter", () => {
    const redTilePositions = getRedTilePositions(metadata[0].sampleInput);
    const greenTilePositions = getGreenTilePositions(metadata[0].sampleInput);2
    it("returns the correct value", () => {
      expect(isWithinPerimeter([ 9, 5 ], [ 2, 3 ], redTilePositions, greenTilePositions)).toEqual(true);
      expect(isWithinPerimeter([ 11, 7 ], [ 2, 3 ], redTilePositions, greenTilePositions)).toEqual(false);
    });
  });

  describe("partOne", () => {
    it("returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(50);
    });
  });

  describe("partTwo", () => {
    it("returns the correct value", () => {
      drawGrid(metadata[0].sampleInput);
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

      // console.log(drawGrid(`0,0
      //     0,1
      //     2,1
      //     2,3
      //     0,3
      //     0,4
      //     3,4
      //     3,0`).join('\n'))
      // expect(
      //   partTwo(
      //     `0,0
      //     0,1
      //     2,1
      //     2,3
      //     0,3
      //     0,4
      //     3,4
      //     3,0`
      //   ).result
      // ).toEqual(8);
    });
  });
});
