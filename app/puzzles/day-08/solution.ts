import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

const cachedDistances: { [key: string]: { [key: string]: number } } = {};
export const findEuclidianDistance = (
  point1: string,
  point2: string
): number => {
  let numbersPoint1 = point1.split(",").map((val) => parseInt(val));
  let numbersPoint2 = point2.split(",").map((val) => parseInt(val));
  return Math.sqrt(
    Math.pow(numbersPoint2[0] - numbersPoint1[0], 2) +
      Math.pow(numbersPoint2[1] - numbersPoint1[1], 2) +
      Math.pow(numbersPoint2[2] - numbersPoint1[2], 2)
  );
};

export type JunctionPair = [string, string, number];
export const getClosestPairs = (contents: string[]): JunctionPair[] => {
  let results: JunctionPair[] = [];
  let directConnections: {[key: string]: string} = {};
  contents.forEach(junction => {
    let result: JunctionPair = [junction, junction, Number.MAX_VALUE];
    contents.forEach(junction2 => {
      if (junction === junction2) return;
      // if ((directConnections[junction] && directConnections[junction] == junction2) || (directConnections[junction2] && directConnections[junction2] === junction)) return;
      let distance = findEuclidianDistance(junction, junction2);
      if (distance < result[2]) {
        result = [junction, junction2, distance];
      }
    });
    directConnections[result[0]] = result[1];
    results.push(result);
  });
  return results.sort((a,b) => a[2] - b[2]);
};

export const getCircuits = (closestPairs: JunctionPair[], connectionCount = 1000) => {
  let connections = 0;
  let directConnections: {[key: string]: string[]} = {};
  while (connections++ < connectionCount) {
    let nextPair = closestPairs.shift() as JunctionPair;
    if (!directConnections[nextPair[0]]) directConnections[nextPair[0]] = [];
    if (!directConnections[nextPair[1]]) directConnections[nextPair[1]] = [];
    directConnections[nextPair[0]].push(nextPair[1]);
    directConnections[nextPair[1]].push(nextPair[0]);
  }

  let circuits: {[key: string]: string[]} = {};
  let visitedJunctions: {[key: string]: boolean} = {};
  Object.keys(directConnections).forEach(circuitName => {
    let queue = [circuitName];
    while (queue.length) {
      let junction = queue.shift() as string;
      if (visitedJunctions[junction]) continue;
      visitedJunctions[junction] = true;
      if (!circuits[circuitName]) circuits[circuitName] = [];
      circuits[circuitName].push(junction);
      queue = queue.concat(directConnections[junction]);
    }
  });
  return circuits;
};

export const partOne = (
  userInput: string,
  connectionTarget = 1000
): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  let messages: string[] = [];
  let scores: number[] = [];
  const pairs = getClosestPairs(contents);
  const circuits = getCircuits(pairs, connectionTarget);
  Object.keys(circuits).forEach(circuit => scores.push(circuits[circuit].length));
  scores.sort((a,b) => b - a);
  console.log(circuits, scores);
  result = scores.slice(0, 3).reduce((acc, value) => (acc *= value), 1);
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  let messages: string[] = contents;
  return { result, messages, benchmark: performance.now() - benchmark };
};
