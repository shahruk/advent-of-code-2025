import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

const cachedDistances: { [key: string]: { [key: string]: number } } = {};
export const findEuclidianDistance = (
  point1: string,
  point2: string
): number => {
  if (!(cachedDistances[point1] && cachedDistances[point1][point2])) {
    let numbersPoint1 = point1.split(",").map((val) => parseInt(val));
    let numbersPoint2 = point2.split(",").map((val) => parseInt(val));
    if (!cachedDistances[point1]) {
      cachedDistances[point1] = {};
    }
    cachedDistances[point1][point2] = Math.sqrt(
      Math.pow(numbersPoint2[0] - numbersPoint1[0], 2) +
        Math.pow(numbersPoint2[1] - numbersPoint1[1], 2) +
        Math.pow(numbersPoint2[2] - numbersPoint1[2], 2)
    );
  }
  return cachedDistances[point1][point2];
};

export const getClosestJunctions = (
  contents: string[],
  connectionTarget = 1000
): { [key: string]: string } => {
  let connections = 0;
  let closestJunctions: { [key: string]: string } = {};
  while (connections < connectionTarget) {
    contents.forEach((junctionPosition, index) => {
      let localMinDistance = Number.MAX_VALUE;
      let matchingJunction1 = junctionPosition;
      let matchingJunction2 = "";
      if (closestJunctions[junctionPosition]) return;
      contents.forEach((junctionPosition2, index2) => {
        if (junctionPosition2 === junctionPosition) return;
        if (closestJunctions[junctionPosition2] === junctionPosition) return;
        let newMinDistance = findEuclidianDistance(
          matchingJunction1,
          junctionPosition2
        );
        if (newMinDistance < localMinDistance) {
          matchingJunction2 = junctionPosition2;
          localMinDistance = newMinDistance;
        }
      });
      closestJunctions[matchingJunction1] = matchingJunction2;
    });
    connections++;
  }
  return closestJunctions;
};

export const getCircuitMap = (closestJunctions: {
  [key: string]: string;
}): { [key: string]: number } => {
  let scores: { [key: string]: number } = {};
  let nodesInCircuit: { [key: string]: boolean } = {};
  let nodesToExplore: string[] = Object.keys(closestJunctions);
  let visitedNodes: { [key: string]: boolean } = {};
  let pointerNodes: { [key: string]: string } = {};
  let circuits: { [key: string]: string } = {};

  Object.keys(closestJunctions).forEach((junctionKey) => {
    if (visitedNodes[junctionKey]) return;
    // Find all references to this key
    let pointers = [
      ...Object.keys(closestJunctions).filter(
        (key) => closestJunctions[key] === junctionKey
      ),
    ];
    let nodes = pointers.filter((pointer) => !visitedNodes[pointer]);
    let score = 0;
    // These all point to this key
    // nodes.forEach(node => {
    //   // console.log(node, pointerNodes)
    //   if (visitedNodes[node]) return;
    //   // There is a circuit that needs to be merged
    //   if (pointerNodes[node]) {
    //     console.log('there is a pointer here', node)
    //     return;
    //   }
    //   visitedNodes[node] = true;
    //   pointerNodes[node] = junctionKey;
    //   pointerNodes[junctionKey] = junctionKey;
    //   score++;
    // });
    // if (!scores[junctionKey]) scores[junctionKey] = 0;
    nodesInCircuit[junctionKey] = true;
    nodes.map((node) => {
      let targetToAddTo = junctionKey;
      if (nodesInCircuit[node]) {
        if (pointerNodes[node]) {
          targetToAddTo = pointerNodes[node];
          score += scores[pointerNodes[node]];
        }
      } else {
        score++;
        nodesInCircuit[node] = true;
        pointerNodes[node] = junctionKey;
      }
      scores[targetToAddTo] = score;
    });

    console.log("C", scores);
  });
  return scores;
};

export const findClosestNeighbor = (junction: string, contents: string[], exclusionList: string[] = []): [string, number] => {
  let minDistance = Number.MAX_VALUE;
  let discoveredCircuit = '';
  contents.forEach(line => {
    if (exclusionList.includes(line)) return;
    let euclidian = findEuclidianDistance(junction, line);
    if (euclidian < minDistance) {
      minDistance = euclidian;
      discoveredCircuit = line;
    }
  });
  return [discoveredCircuit, minDistance];
};

export const partOne = (
  userInput: string,
  connectionTarget = 1000
): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  const contents = splitUserInputByCharacter(userInput);
  let connections = 0;
  let result = 0;
  let messages: string[] = [];
  let scores: number[] = [];
  // let closestJunctions = getClosestJunctions(contents, connectionTarget);

  let circuits: { [key: string]: string[] } = contents.reduce((acc: {[key: string]: string[]}, value) => {
    acc[value] = [];
    return acc;
  }, {});

  let circuitReferenceMap : { [key: string]: string } = {};
  let visitedNodes: {[key: string]: boolean } = {};
  
  while (connections < connectionTarget) {
    let leastDistance = Number.MAX_VALUE;
    let circuitToAddTo = '';
    let circuitToAdd = '';
    Object.keys(circuits).forEach(circuit => {
      if (visitedNodes[circuit]) {
        return;
      }
        let exclusionList = [circuit].concat(circuits[circuit]);
        let [neighbor, distance] = findClosestNeighbor(circuit, contents, exclusionList);
        if (distance < leastDistance) {
          circuitToAddTo = circuit;
          circuitToAdd = neighbor;
          leastDistance = distance;
        }
      });
      if (circuitToAddTo) {
        circuits[circuitToAddTo].push(circuitToAdd);
        circuits[circuitToAdd].push(circuitToAddTo);
        visitedNodes[circuitToAddTo] = true;
      }
      connections++;
  }
  console.log('circuits', circuits);
    

  let circuitKeys = Object.keys(circuits);
  let scoreMap: {[key: string]: number } = {};
  let junctionMap: {[key: string]: string[]} = {};
  visitedNodes = {};
  while (circuitKeys.length) {
    let currentCircuit = circuitKeys.shift() as string;
    if (visitedNodes[currentCircuit]) continue;
    // visitedNodes[currentCircuit] = true;
    let score = 0;
    let junctions = [];
    let queue = circuits[currentCircuit];
    while (queue.length) {
      let nextCircuit = queue.pop() as string;
      if (visitedNodes[nextCircuit]) continue;
      visitedNodes[nextCircuit] = true;
      queue = queue.concat(circuits[nextCircuit]);
      junctions.push(nextCircuit);
      score++;
      scoreMap[currentCircuit] = score;
      junctionMap[currentCircuit] = junctions;
    }
    scores.push(score);
    // let connections = circuits[currentCircuit];
  }
  scores.sort((a,b) => b - a);
  console.log(circuits, 'score for', junctionMap);

  // let circuitScore = getCircuitMap(closestJunctions);
  console.log(scoreMap);

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
