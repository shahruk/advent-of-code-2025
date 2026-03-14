import { describe, expect, it } from "vitest";
import { Machine, partOne, partTwo } from "./solution";
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
          expect(machine.pressButtons([])[1]).toEqual([0, 0, 0, 0]);
          expect(
            machine.pressButtons([
              [1, 2, 3],
              [1, 2, 3],
            ])
          ).toEqual([
            [0, 0, 0, 0],
            [0, 2, 2, 2],
          ]);
          expect(machine.pressButtons([[1, 2, 3]])).toEqual([
            [0, 1, 1, 1],
            [0, 1, 1, 1],
          ]);
          expect(
            machine.pressButtons([
              [1, 2, 3],
              [1, 2],
              [1, 2, 3],
            ])
          ).toEqual([
            [0, 1, 1, 0],
            [0, 3, 3, 2],
          ]);
        });

        it("returns the correct value", () => {
          expect(
            machine2.pressButtons([
              [0, 4],
              [0, 1, 2],
              [1, 2, 3, 4],
            ])
          ).toEqual([
            [0, 0, 0, 1, 0],
            [2, 2, 2, 1, 2],
          ]);
        });
      });
    });

    describe("findStateDifference", () => {
      it("returns the correct value", () => {
        expect(machine.findStateDifference([1, 0, 1, 0])).toEqual([0, 2]);
      });
    });

    describe("subtractMatrixes", () => {
      it("returns the correct value", () => {
        expect(machine.subtractMatrixes([1, 1, 1, 1, 1], [1, 0, 1, 0, 1])).toEqual([0, 1, 0, 1, 0]);
      });

      it("returns the correct value", () => {
        expect(machine.subtractMatrixes([0, 1, 0], [1, 1, 1], 0)).toEqual([0, 0, 0]);
      });
    });

    describe("isJoltageMet", () => {
      it("returns the correct value", () => {
        expect(machine.isJoltageMet([4, 4, 4, 0], [1, 2, 3, 4])).toEqual(false);
        expect(machine.isJoltageMet([1, 0, 1, 1], [0, 0, 0, 1])).toEqual(true);
      });
    });

    describe("calculateMinPresses", () => {
      it("returns the correct value", () => {
        expect(machine.calculateMinimumPresses([7, 7, 7, 7])).toEqual(0);
      });
    });

    describe("calculateNextButtonPresses", () => {
      it("returns the correct value", () => {
        const newMachine = new Machine(`[.##] (1) (0,1,2) (2) {0,5,1}`);
        expect(newMachine.calculateNextButtonPresses([], 0)).toEqual([]);
        expect(newMachine.calculateNextButtonPresses([[2]], 0)).toEqual([]);

        expect(newMachine.calculateNextButtonPresses([[1]], 1)).toEqual([
          [[1], [1], [1], [1]],
          [
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2],
          ],
        ]);
      });
    });

    describe("configureWithFewestPresses", () => {
      it("returns the correct value", () => {
        expect(machine.configureWithFewestPresses().length).toEqual(2);
        expect(machine2.configureWithFewestPresses().length).toEqual(3);
        expect(machine3.configureWithFewestPresses().length).toEqual(2);
        expect(machine4.configureWithFewestPresses().length).toEqual(4);
      });
    });


    describe('getAllKnownStates', () => {
      it('returns the correct value', () => {
        const paths = machine.getAllKnownStates();
        expect(Object.keys(paths).length).toEqual(16);
      });
    });


    describe('getStartingPressPaths', () => {
      it('returns the correct value', () => {
        const smallMachine = new Machine(`[.##] (1) (0,1,2) (2) {0,5,1}`);
        const paths = smallMachine.getStartingPressPaths();
        expect(paths.length).toEqual(3);
      })

      it('returns the correct value', () => {
        const paths = machine.getStartingPressPaths();
        expect(paths.length).toEqual(3);
      });

    });

    describe.skip('reduceToZero', () => {
      it('returns the correct value', () => {
        const smallMachine = new Machine(`[.#.] (1) {0,5,0}`);
        expect(smallMachine.reduceToZero(smallMachine.attributes.joules)).toEqual(5);
      });
      it('returns the correct value', () => {
        const smallMachine = new Machine(`[.##] (1) (0,1,2) (2) {0,5,1}`);
        expect(smallMachine.reduceToZero(smallMachine.attributes.joules)).toEqual(5);
      });
      it('returns the correct value', () => {
        expect(machine.reduceToZero(machine.attributes.joules)).toEqual(10);
      });
    })

    describe("configureWithJoltage", () => {
      it('returns the correct value with joltage', () => {
        expect(machine.configureWithJoltage()).toEqual(10);
      });
      it('returns the correct value with joltage', () => {
        expect(machine2.configureWithJoltage()).toEqual(12);
      });
      it('returns the correct value with joltage', () => {
        expect(machine3.reduceToZero([4,4,4,2,4,2])).toEqual(4);
        expect(machine3.configureWithJoltage()).toEqual(11);
      });
      it('returns the correct value with joltage', () => {
        expect(new Machine(`[......##] (0,3,5,6,7) (4,5) (0,1,2,3,5,6) (0,1,2,6,7) (0,1,2,3,5,7) (0,1) (3,4,5,6,7) (0,2,5) (1,2,3,4,5,6) (2,5) {68,44,56,31,32,79,41,38}`).configureWithJoltage()).toEqual(102);
      });
      it('handles long inputs well', () => {
        expect(new Machine(`[.#......#.] (2,9) (3,5,6,7,8) (0,7,8,9) (4) (0,2,3) (2,3,4,5,6,7,8,9) (1,2,3,7) (1,8) (0,2,5,6,9) (0,1,2,3,5,6,7) {59,48,81,71,11,42,42,70,42,42}`).configureWithJoltage()).toEqual(112);
      })
      it('handles long inputs well', () => {
        expect(new Machine(`[.##...##..] (9) (4,9) (2,4,5,6) (2,3,4,5,7,8,9) (0,2,3,4,5,6,7,9) (2,3,8,9) (1,2,4,8) (2,3,6,7,8) (0,1,8,9) (0,2,4,5,6,8,9) (2,3,4,8,9) (5,8) (5,9) {44,29,89,38,189,79,57,24,89,211}`).configureWithJoltage()).toEqual(253);
      })
    });
  });

  describe("Part One", () => {
    it("returns the correct value", () => {
      expect(partOne(metadata[0].sampleInput).result).toEqual(7);
    });
  });

  describe("Part Two", () => {
    it("returns the correct value", () => {
      const machineTest = new Machine(`[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`);
      let [, futureJoltageTest] = machineTest.pressButtons([
        [0,1,2,3,4],
        [0,1,2,3,4],
        [0,1,2,3,4],
        [0,1,2,3,4],
        [0,1,2,3,4],
        [0,1,2,4,5],
        [0,1,2,4,5],
        [0,1,2,4,5],
        [0,1,2,4,5],
        [0,1,2,4,5],
        [1,2]
      ]);

      expect(partTwo(metadata[0].sampleInput).result).toEqual(33);
    });
  });
});
