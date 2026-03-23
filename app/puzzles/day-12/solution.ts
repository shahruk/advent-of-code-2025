import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

type Shape = {};
type Region = {};
export class ProblemSolver {
  shapes: string[][];
  regions: string[][];
  regionSizes: number[];
  constructor(userInput: string) {
    const contents = splitUserInputByCharacter(userInput);
    const shapeLines = contents.filter((line) => !line.includes("x"));
    const shapes = [];
    this.regions = contents
      .filter((line) => line.includes("x"))
      .map((region) => region.split(": ")[1])
      .map((line) => line.split(" "));
    let regionSizes = contents.filter((line) => line.includes("x")).map((region) => region.split(": ")[0]);
    this.regionSizes = regionSizes.map((size) => size.split("x").reduce((acc, value) => (acc *= parseInt(value)), 1));
    let acc: string[] = [];
    for (let i = 0; i < shapeLines.length; i++) {
      if (shapeLines[i].includes(":")) continue;
      else if (!shapeLines[i].trim().length) {
        shapes.push(acc);
        acc = [];
      } else {
        acc.push(shapeLines[i]);
      }
    }
    this.shapes = shapes;
  }

  solve() {
    let result = 0;
    this.regions.map((region, regionIndex) => {
      let isValid = true;
      let currentArea = 0;
      for (let [index, presentsNeeded] of region.entries()) {
        let needed = parseInt(presentsNeeded);
        let presentFill = this.shapes[index].join().match(/#/g)?.length || 0;
        while (needed-- > 0) {
          currentArea += presentFill;
        }
      }
      if (currentArea >= this.regionSizes[regionIndex]) {
        isValid = false;
      }
      if (isValid) result++;
    });
    return result;
  }
}

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const solver = new ProblemSolver(userInput);
  const result = solver.solve();
  const messages: string[] = [];
  const benchmark = performance.now();
  return { result, messages, benchmark: performance.now() - benchmark };
};
