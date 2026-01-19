import { describe, expect, it } from "vitest";
import { Machine, partOne } from "./solution";
import metadata from ".";

describe("Advent of Code - Day 10", () => {
  describe("Machine class", () => {
    const machine = new Machine(`[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}`);
    const machine2 = new Machine(`[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}`);
    const machine3 = new Machine(`[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`);
    const machine4 = new Machine(
          `[..##..#..] (0,4,8) (1,4,8) (1,2,3,5,7,8) (3,4,6,7) (1,2,4,6,7) (0,5,6,7,8) (0,1,3,6,7,8) (0,1,4,5,7) {31,52,25,41,41,43,43,71,52})`
        );
    describe("parseLine", () => {
      it("returns the correct value", () => {
        expect(machine.attributes).toEqual({
          indicator: "[.##.]",
          buttons: [[3], [1, 3], [2], [2, 3], [0, 2], [0, 1]],
          joules: [3, 5, 4, 7],
        });
      });
      describe("getIndicatorTarget", () => {
        it("returns the correct value", () => {
          expect(machine.getIndicatorTarget()).toEqual([0, 1, 1, 0]);
        });
      });

      describe("pressButtons", () => {
        it("returns the correct value", () => {
          expect(
            machine.pressButtons([
              [1, 2, 3],
              [1, 2, 3],
            ])
          ).toEqual([[0, 0, 0, 0], [0,2,2,2]]);
          expect(machine.pressButtons([[1, 2, 3]])).toEqual([[0, 1, 1, 1], [0,1,1,1]]);
          expect(
            machine.pressButtons([
              [1, 2, 3],
              [1, 2],
              [1, 2, 3],
            ])
          ).toEqual([[0, 1, 1, 0], [0,3,3,2]]);
        });

        it("returns the correct value", () => {
          expect(
            machine2.pressButtons([
              [0, 4],
              [0, 1, 2],
              [1, 2, 3, 4],
            ])
          ).toEqual([[0, 0, 0, 1, 0], [2,2,2,1,2]]);
        });
      });
    });

    describe("findStateDifference", () => {
      it("returns the correct value", () => {
        expect(machine.findStateDifference([1, 0, 1, 0])).toEqual([0, 2]);
      });
    });

    describe("configureWithFewestPresses", () => {
      it("returns the correct value", () => {
        expect(machine.configureWithFewestPresses().length).toEqual(2);
        expect(machine2.configureWithFewestPresses().length).toEqual(3);
        expect(machine3.configureWithFewestPresses().length).toEqual(2);
        expect(machine4.configureWithFewestPresses().length).toEqual(4);
      });

      it("returns the correct value with joltage", () => {
        console.log(machine, machine.configureWithFewestPresses(true));
        expect(machine.configureWithFewestPresses(true).length).toEqual(10);
      });
    });
  });

  describe("Part One", () => {
    it("returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(7);
    });
  });
});
