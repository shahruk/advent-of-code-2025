import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

export const findEuclidianDistance = (point1: string, point2: string): number => {
  let numbersPoint1 = point1.split(",").map((val) => parseInt(val));
  let numbersPoint2 = point2.split(",").map((val) => parseInt(val));
  return Math.sqrt(
    Math.pow(numbersPoint2[0] - numbersPoint1[0], 2) +
      Math.pow(numbersPoint2[1] - numbersPoint1[1], 2) +
      Math.pow(numbersPoint2[2] - numbersPoint1[2], 2)
  );
};

export type JunctionPair = [string, string, number];

export const getClosestPairs = (
  contents: string[],
  calculatedPairs: { [key: string]: number } = {}
): JunctionPair[] => {
  let results: JunctionPair[] = [];
  for (let i = 0; i < contents.length; i++) {
    const junction = contents[i];
    for (let j = i + 1; j < contents.length; j++) {
      const junction2 = contents[j];
      if (junction === junction2) continue;
      if (calculatedPairs[`${junction2}::${junction}`]) continue;
      let distance = findEuclidianDistance(junction, junction2);
      calculatedPairs[`${junction}::${junction2}`] = distance;
      results.push([junction, junction2, distance]);
    }
  }

  return results.sort((a, b) => b[2] - a[2]);
};

export const getCircuits = (contents: string[], connectionCount = 1000) => {
  let connections = 0;
  let directConnections: { [key: string]: string[] } = {};
  let closestPairs: JunctionPair[] = getClosestPairs(contents);
  while (connections < connectionCount) {
    let nextPair = closestPairs.pop() as JunctionPair;
    if (nextPair) {
      if (!directConnections[nextPair[0]]) directConnections[nextPair[0]] = [];
      if (!directConnections[nextPair[1]]) directConnections[nextPair[1]] = [];
      directConnections[nextPair[0]].push(nextPair[1]);
      directConnections[nextPair[1]].push(nextPair[0]);
    }
    connections++;
  }

  let circuits: { [key: string]: string[] } = {};
  let visitedJunctions: { [key: string]: boolean } = {};
  Object.keys(directConnections).forEach((circuitName) => {
    let queue = [circuitName];
    while (queue.length) {
      let junction = queue.pop() as string;
      if (visitedJunctions[junction]) continue;
      visitedJunctions[junction] = true;
      if (!circuits[circuitName]) circuits[circuitName] = [];
      circuits[circuitName].push(junction);
      queue = [...queue, ...directConnections[junction]];
    }
  });
  return circuits;
};

export const getFullCircuit = (contents: string[]): [{ [key: string]: string[] }, JunctionPair] => {
  let closestPairs: JunctionPair[] = getClosestPairs(contents);
  let circuits: { [key: string]: string[] } = contents.reduce((acc: { [key: string]: string[] }, curr: string) => {
    acc[curr] = [curr];
    return acc;
  }, {});
  let circuitReferenceMap: { [key: string]: { id: string; pointer: string } } = {};
  let lastPair = closestPairs[0];
  // let objectKeys = Object.keys(circuits).length;
  // let objectValues = Object.values(circuits)[0];
  let circuitsLeft = contents.length;

  while (circuitsLeft > 1) {
    let nextPair = closestPairs.pop() as JunctionPair;
    if (nextPair) {
      if (!circuitReferenceMap[nextPair[0]])
        circuitReferenceMap[nextPair[0]] = {
          id: nextPair[0],
          pointer: nextPair[0],
        };
      if (!circuitReferenceMap[nextPair[1]])
        circuitReferenceMap[nextPair[1]] = {
          id: nextPair[1],
          pointer: nextPair[1],
        };
      let rootInsert = nextPair[0];
      while (circuitReferenceMap[rootInsert].pointer !== circuitReferenceMap[rootInsert].id) {
        circuitReferenceMap[rootInsert].pointer = circuitReferenceMap[circuitReferenceMap[rootInsert].pointer].pointer;
        rootInsert = circuitReferenceMap[rootInsert].pointer;
      }

      let secondCircuitMerge = nextPair[1];
      while (circuitReferenceMap[secondCircuitMerge].pointer !== circuitReferenceMap[secondCircuitMerge].id) {
        circuitReferenceMap[secondCircuitMerge].pointer =
          circuitReferenceMap[circuitReferenceMap[secondCircuitMerge].pointer].pointer;
        secondCircuitMerge = circuitReferenceMap[secondCircuitMerge].pointer;
      }

      if (rootInsert === secondCircuitMerge) continue;

      let junctionsToMerge = circuits[circuitReferenceMap[secondCircuitMerge].pointer];
      circuits[circuitReferenceMap[rootInsert].pointer] = [
        ...circuits[circuitReferenceMap[rootInsert].pointer],
        ...junctionsToMerge,
      ];
      delete circuits[secondCircuitMerge];
      circuitReferenceMap[secondCircuitMerge].pointer = circuitReferenceMap[rootInsert].pointer;
      lastPair = nextPair;
      circuitsLeft--;
    } else {
      throw new Error("There are no more closest pairs of junctions to connect.");
    }
  }

  return [circuits, lastPair];
};

export const partOne = (userInput: string, connectionTarget = 1000): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  let messages: string[] = [];
  let scores: number[] = [];
  const circuits = getCircuits(contents, connectionTarget);
  Object.keys(circuits).forEach((circuit) => scores.push(circuits[circuit].length));
  scores.sort((a, b) => b - a);
  result = scores.slice(0, 3).reduce((acc, value) => (acc *= value), 1);
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  const contents = splitUserInputByCharacter(userInput);
  let result: number = 0;
  let messages: string[] = contents;
  const [circuit, lastPair] = getFullCircuit(contents);
  result = lastPair.slice(0, 2).reduce((acc, value) => {
    (acc as number) *= parseInt(value as string);
    return acc;
  }, 1) as number;
  return { result, messages, benchmark: performance.now() - benchmark };
};
