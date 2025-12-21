import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

const cachedDistances: {[key: string]: {[key: string]: number}} = {};
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

export const findClosestNeighbor = (
  contents: string[],
  connection: connectionInfo,
  currentPoint: string
): [string, number] => {
  let leastDistance = Number.MAX_VALUE;
  let result = contents[0];
  for (let i = 0; i < contents.length; i++) {
    if (contents[i] === currentPoint || connection.circuitReference === contents[i] || connection.connections.includes(contents[i])) continue;
    const newLeastDistance = findEuclidianDistance(currentPoint, contents[i]);
    if (newLeastDistance < leastDistance) {
      result = contents[i];
      leastDistance = newLeastDistance;
    }
  }
  return [result, leastDistance];
};

export const findClosestDistanceInSet = (
  unpairedCircuits: string[],
  allCircuits: string[]
): [string, string] => {
  let minimalDistance = Number.MAX_VALUE;
  let firstPoint: string = "";
  let secondPoint: string = "";
  unpairedCircuits.forEach((unpairedCircuit, index) => {
    allCircuits.forEach((circuit) => {
      if (circuit === unpairedCircuit) return;
      let distance = findEuclidianDistance(unpairedCircuit, circuit);
      if (distance < minimalDistance) {
        minimalDistance = distance;
        firstPoint = unpairedCircuit;
        secondPoint = circuit;
      }
    });
  });
  return [firstPoint, secondPoint];
};

export const generateCircuitMap = (connections: {
  [key: string]: string[];
}): { [key: string]: number } => {
  let result: { [key: string]: number } = {};
  let connectionKeys = Object.keys(connections);
  let allConnectionsToExplore = [...connectionKeys];
  let getCircuitScore = (
    connection: string,
    visitedJunctions: { [key: string]: boolean } = {}
  ): number => {
    if (visitedJunctions[connection]) return 0;
    visitedJunctions[connection] = true;
    connectionKeys.splice(connectionKeys.indexOf(connection), 1);
    console.log("visiting", connection);
    return connections[connection].reduce(
      (acc, conn) => (acc += getCircuitScore(conn, visitedJunctions)),
      1
    );
  };
  connectionKeys.forEach((connection) => {
    result[connection] = getCircuitScore(connection);
    console.log(result);
  });

  return result;
};

type connectionInfo = {
  id: string;
  connections: string[];
  circuitReference?: string;
};
type connectionMap = { [key: string]: connectionInfo };

export const partOne = (
  userInput: string,
  connectionTarget = 1000
): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  const contents = splitUserInputByCharacter(userInput);
  let connections = 0;
  let result = 0;
  let messages: string[] = [];
  let directConnections: { [key: string]: string[] } = {};
  let circuits: connectionMap = contents.reduce(
    (acc: connectionMap, value: string) => {
      acc[value] = { id: value, connections: [] };
      return acc;
    },
    {}
  );

  const findCircuitRecord = (record: connectionInfo) => {
    while (record.circuitReference) {
      record = circuits[record.circuitReference];
    }
    return record;
  };

  const connectJunctions = (junction1: string, junction2: string) => {
    if (!circuits[junction1]) {
      circuits[junction1] = {
        id: junction1,
        connections: [],
      };
    }
    if (!circuits[junction2]) {
      circuits[junction2] = {
        id: junction2,
        connections: [],
      };
    }

    // Merge junction2 into junction 1
    circuits[junction1].connections.push(junction2);
    circuits[junction2].connections.push(junction1);
    // If there's a reference to a circuit, merge circuits
    // if (circuits[junction1].circuitReference) {
    // let circuitRecord = findCircuitRecord(circuits[junction1]);
    // let circuitRecordToMerge = findCircuitRecord(circuits[junction2]);
    // circuitRecord.connections.push(junction2);
    // circuitRecord.connections = circuitRecord.connections.concat(
    //   circuitRecordToMerge.connections
    // );
    // if (circuitRecordToMerge.id !== circuitRecord.id) {
    //   circuitRecordToMerge.circuitReference = circuitRecord.id;
    // }
  };

  // while (connections < connectionTarget) {
    // connections++;
    let lowestDistance = Number.MAX_VALUE;
    let junction1: string = "";
    let junction2: string = "";
    // We need to find the shortest connection amongst all the unconnected
    Object.values(circuits).filter(circuit => !circuit.connections.length).forEach((junction) => {
      let [connection, score] = findClosestNeighbor(
        contents,
        circuits[junction.id],
        junction.id
      );
      if (score < lowestDistance) {
        lowestDistance = score;
        junction1 = junction.id;
        junction2 = connection;
      }
    });

    // connectJunctions(junction1, junction2);
    // If both have references, merge the two circuits
    // if (circuits[junction1].circuitReference && circuits[junction2].circuitReference) {
    //   circuits[circuits[junction1].circuitReference as string].connections = circuits[junction1].connections.concat(circuits[circuits[junction2].circuitReference as string].connections);
    //   circuits[junction2].circuitReference = circuits[junction1].circuitReference;
    // } else {
    // // if (!circuits[junction1].circuitReference) {
    //   // If the connection we're interested in isn't also connected
    //   if (!(circuits[junction2].connections.length)) {
    //     circuits[junction1].connections = [junction2].concat(circuits[junction1].connections.concat(circuits[junction2].connections));
    //     circuits[junction2].connections = [junction1];
    //     circuits[junction2].circuitReference = circuits[junction1].circuitReference || junction1;
    //   } else {
    //     // We want to insert our circuit into the existing reference
    //     circuits[junction2].connections = circuits[junction2].connections.concat(circuits[junction1].connections);
    //     circuits[junction1].connections = [junction2];
    //     circuits[junction1].circuitReference = circuits[junction2].circuitReference || junction2;
    //     // console.log('here for 1', connectionToPlace);
    //   }
    // } else {
    // }
  // }

  const remainingCircuits = Object.fromEntries(
    Object.entries(circuits).filter(([key]) => !circuits[key].circuitReference)
  );
  let scores: number[] = [];
  let connectedJunctions: {[key: string]: boolean} = {};
  Object.values(remainingCircuits).map(value => {
    let score = 0;
    let queue = [value];
    while (queue.length) {
      let junction = queue.pop() as connectionInfo;
      if (connectedJunctions[junction.id]) continue;
      connectedJunctions[junction.id] = true;
      remainingCircuits[junction.id].connections.forEach(junction => {
        queue.push(remainingCircuits[junction]);
      })
      score++;
    }
    if (score > 0) scores.push(score);
  });
  scores.sort((a,b) => b - a);
  result = scores.slice(0, 3).reduce((acc, value) => acc *= value, 1);
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  let messages: string[] = contents;
  return { result, messages, benchmark: performance.now() - benchmark };
};
