import { describe, expect, it } from "vitest";
import {
  findEuclidianDistance,
  getCircuitMap,
  getClosestJunctions,
  partOne,
  partTwo,
} from "./solution";
import metadata from ".";
import { splitUserInputByCharacter } from "~/lib/utils";

describe("Advent of Code - Day 8", () => {
  describe("findEuclidianDistance", () => {
    it("returns the correct value", () => {
      expect(
        Math.floor(findEuclidianDistance("431,825,988", "162,817,812"))
      ).toEqual(321);
    });
  });

  describe("getClosestJunctions", () => {
    it("returns the correct value", () => {
      expect(
        getClosestJunctions(
          splitUserInputByCharacter(metadata[0].sampleInput),
          10
        )
      ).toEqual({
        "117,168,530": "352,342,300",
        "162,817,812": "425,690,689",
        "216,146,977": "117,168,530",
        "346,949,466": "425,690,689",
        "352,342,300": "542,29,236",
        "425,690,689": "431,825,988",
        "431,825,988": "162,817,812",
        "466,668,158": "352,342,300",
        "52,470,668": "117,168,530",
        "542,29,236": "862,61,35",
        "57,618,57": "466,668,158",
        "592,479,940": "425,690,689",
        "739,650,466": "906,360,560",
        "805,96,715": "984,92,344",
        "819,987,18": "941,993,340",
        "862,61,35": "984,92,344",
        "906,360,560": "805,96,715",
        "941,993,340": "739,650,466",
        "970,615,88": "819,987,18",
        "984,92,344": "906,360,560",
      });
    });
  });
  describe("getCircuitMap", () => {
    it("returns the correct value", () => {
      expect(
        getCircuitMap({
          "1": "4",
          "2": "1",
          "3": "1",
          "4": "2",
          "5": "2",
        })
      ).toEqual({
        "1": 5,
        // "2": 0,
        // "3": 0,
        // "4": 0,
      });
    });
  });
  describe.only("partOne", () => {
    it("returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput, 10).result).toEqual(40);
    });
  });

  // describe("partTwo", () => {
  //   it("returns the correct value", () => {
  //     expect(partTwo(metadata[0].sampleInput).result).toEqual(40);
  //   });
  // });
});
