import { describe, expect, it } from "vitest";
import {
  findEuclidianDistance,
  getCircuits,
  getClosestPairs,
  getFullCircuit,
  partOne,
  partTwo,
  // partTwo,
} from "./solution";
import metadata from ".";
import { splitUserInputByCharacter } from "~/lib/utils";

function shuffle(arr: any[]): any[] {
  let array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


describe("Advent of Code - Day 8", () => {
  describe("findEuclidianDistance", () => {
    it("returns the correct value", () => {
      expect(
        Math.floor(findEuclidianDistance("431,825,988", "162,817,812"))
      ).toEqual(321);
    });
  });


  describe('getClosestPairs', () => {
    it("returns the correct value", () => {
      const pairs = getClosestPairs(shuffle(splitUserInputByCharacter(metadata[0].sampleInput))).reverse();
      console.log('pairs', pairs);
      expect(pairs[0].slice(0,2).sort((a, b) => parseInt(a as string) - parseInt(b as string))).toEqual(["162,817,812", "425,690,689"]);
      expect(pairs[1].slice(0,2).sort((a, b) => parseInt(a as string) - parseInt(b as string))).toEqual(['162,817,812', '431,825,988']);
      expect(pairs[2].slice(0,2).sort((a, b) => parseInt(a as string) - parseInt(b as string))).toEqual(['805,96,715', '906,360,560']);
      expect(Math.floor(parseInt((pairs[3].slice(2))[0] as string))).toEqual(328);
      expect(pairs[3].slice(0,2).sort((a, b) => parseInt(a as string) - parseInt(b as string))).toEqual(['425,690,689', '431,825,988']);
    });
  });

  describe('getCircuits', () => {
    it('returns the correct value', () => {
      const circuits = getCircuits(splitUserInputByCharacter(metadata[0].sampleInput), 10);
      console.log('circuits', circuits);
      expect(circuits['162,817,812'].length).toEqual(4);
      expect(circuits['906,360,560'].length).toEqual(5);
      expect(circuits['52,470,668'].length).toEqual(2);
      expect(circuits['819,987,18'].length).toEqual(2);
    });
  });

  describe('getFullCircuit', () => {
    it('returns the correct value', () => {
      const circuit = getFullCircuit(splitUserInputByCharacter(metadata[0].sampleInput));
      console.log('full circuit', circuit);
    });
  });

  describe("partOne", () => {
    it("returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput, 10).result).toEqual(40);
    });
  });

  describe("partTwo", () => {
    it("returns the correct value", () => {
      expect(partTwo(metadata[0].sampleInput).result).toEqual(25272);
    });
  });
});
