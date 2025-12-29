import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

type TilePositions = { [key: number]: number[] };
type GreenTilePositionRanges = { [key: number]: [number, number][] };
type SingleTilePosition = [number, number];

export const getRedTilePositions = (userInput: string): [TilePositions, TilePositions] => {
  const contents = splitUserInputByCharacter(userInput);
  let xResults: TilePositions = {};
  let yResults: TilePositions = {};
  contents.forEach((line) => {
    let [x, y] = line.split(",").map((coord) => parseInt(coord));
    if (!xResults[x]) xResults[x] = [];
    if (!yResults[y]) yResults[y] = [];
    xResults[x].push(y);
    yResults[y].push(x);
  });

  Object.keys(xResults).forEach((key: string) => {
    xResults[parseInt(key)].sort((a: number, b: number) => a - b);
  });

  Object.keys(yResults).forEach((key: string) => {
    yResults[parseInt(key)].sort((a: number, b: number) => a - b);
  });

  return [xResults, yResults];
};

export const getGreenTilePositions = (userInput: string): [GreenTilePositionRanges, GreenTilePositionRanges] => {
  const [redXCoords, redYCoords] = getRedTilePositions(userInput);
  const xResults: GreenTilePositionRanges = {};
  const yResults: GreenTilePositionRanges = {};
  // Need to be bridged vertically
  Object.keys(redXCoords)
    .filter((key) => redXCoords[parseInt(key)].length > 1)
    .forEach((key) => {
      let yPointToBridge: number;
      let colData = redXCoords[parseInt(key)];
      let ranges: [number, number][] = [];
      colData.forEach((y) => {
        if (yPointToBridge) {
          ranges.push([yPointToBridge, y]);
        } else {
          yPointToBridge = y;
        }
      });
      xResults[parseInt(key)] = ranges;
    });

  // Need to be bridged horizontally
  Object.keys(redYCoords)
    .filter((key) => redYCoords[parseInt(key)].length > 1)
    .forEach((key) => {
      let xPointToBridge: number;
      let colData = redYCoords[parseInt(key)];
      let ranges: [number, number][] = [];
      colData.forEach((x) => {
        if (xPointToBridge) {
          ranges.push([xPointToBridge, x]);
        } else {
          xPointToBridge = x;
        }
      });
      yResults[parseInt(key)] = ranges;
    });

  return [xResults, yResults];
};
const pointToCoord = (point: string): [number, number] => {
  return point.split(",").map((num) => parseInt(num)) as [number, number];
};

export const getHighestArea = (userInput: string): number => {
  const contents = splitUserInputByCharacter(userInput);
  const visited: {[key: string]: boolean} = {};
  let result = 0;
  contents.forEach((point) => {
    let pointCoord = pointToCoord(point);
    contents.forEach((point2) => {
      if (visited[point2]) return;
      let pointCoord2 = pointToCoord(point2);
      let area = calculateAreaBetweenPoints(pointCoord, pointCoord2);
      result = Math.max(result, area);
    });
    visited[point] = true;
  });
  return result;
};

export const calculateAreaBetweenPoints = (pointCoord: [number, number], pointCoord2: [number, number]): number => {
  let xWidth = Math.abs(pointCoord[0] - pointCoord2[0]) + 1;
  let yWidth = Math.abs(pointCoord[1] - pointCoord2[1]) + 1;
  return xWidth * yWidth;
};

export const isGreenTile = ([greenXCoords, greenYCoords]: [GreenTilePositionRanges, GreenTilePositionRanges], pointCoord: [number, number]): boolean => {
  let isHorizontal = greenYCoords[pointCoord[1]]?.filter((range) => range[0] < pointCoord[0] && range[1] > pointCoord[0]).length >= 1;
  let isVertical = greenXCoords[pointCoord[0]]?.filter((range) => range[0] < pointCoord[1] && range[1] > pointCoord[1]).length >= 1;
  return isHorizontal || isVertical;
};
export const getHighestAreaWithinPerimeter = (userInput: string): number => {
  const [redXCoords, redYCoords] = getRedTilePositions(userInput);
  const [greenXCoords, greenYCoords] = getGreenTilePositions(userInput);
  const contents = splitUserInputByCharacter(userInput);
  const visited: {[key: string]: boolean} = {};
  let result = 0;
  contents.forEach((point) => {
    let pointCoord = pointToCoord(point);
    contents.forEach((point2) => {
      if (visited[point2]) return;
      let pointCoord2 = pointToCoord(point2);
      let sortedLeftToRight = [pointCoord, pointCoord2].sort((a, b) => a[0] - b[0]);
      let sortedTopToBottom = [pointCoord, pointCoord2].sort((a, b) => a[1] - b[1]);
      let xRange = [sortedLeftToRight[0][0], sortedLeftToRight[1][0]];
      let yRange = [sortedTopToBottom[0][1], sortedTopToBottom[1][1]];
      // let noRedTilesInside = (() => {
      //   let filteredX = Object.keys(redXCoords).filter(key => {
      //     let index = parseInt(key);
      //     if (index < xRange[0] || index > xRange[1]) return false;
      //     return redXCoords[index].filter(y => y > yRange[0] && y < yRange[1]).length > 0;
      //   });
      //   return filteredX.length === 0;
      // })();
      // if (!noRedTilesInside) return;
      // let noGreenTilesInside = (() => {
      //   let filteredX = Object.keys(greenXCoords).filter(key => {
      //     let index = parseInt(key);
      //     if (index < xRange[0] || index > xRange[1]) return false;
      //     return greenXCoords[index].filter(y => {
      //       // If the range is outside our range, return false
      //       if (y[1] < yRange[0] || y[0] > yRange[1]) return false;

      //       return (yRange[0] > y[0] > || y[0] > yRange[1]).length > 0;
      //     });
      //   });
      //   return filteredX.length === 0;
      // })();
      // if (!noGreenTilesInside) return;
      // Determine if our entire range is within spec
      let area = calculateAreaBetweenPoints(pointCoord, pointCoord2);
      result = Math.max(result, area);
    });
    visited[point] = true;
  });
  return result;
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  let result = 0;
  let messages: string[] = [];
  result = getHighestArea(userInput);
  return { result, messages, benchmark: performance.now() - benchmark };
};


export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  let result: number = 0;
  let messages: string[] = drawGrid(userInput);
  result = getHighestAreaWithinPerimeter(userInput);
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const drawGrid = (userInput: string) => {
  const [redXCoords, redYCoords] = getRedTilePositions(userInput);
  const [greenXCoords, greenYCoords] = getGreenTilePositions(userInput);
  let minX = parseInt(Object.keys(redXCoords)[0]);
  let maxX = parseInt(Object.keys(redXCoords)[Object.keys(redXCoords).length - 1]);
  let minY = parseInt(Object.keys(redYCoords)[0]);
  let maxY = parseInt(Object.keys(redYCoords)[Object.keys(redYCoords).length - 1]);
  const results = [];
  for (let i = minY; i <= maxY; i++) {
    let row = '';
    for (let j = minX; j <= maxX; j++) {
      let character = redYCoords[i]?.includes(j)
        ? "#"
        : isGreenTile([greenXCoords, greenYCoords], [j, i]) ? 'X' : '.';

      row += (character);
    }
    results.push(row);
  }
  return results;
};
