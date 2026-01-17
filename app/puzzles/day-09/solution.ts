import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

type TilePositions = { [key: string]: number[] };
type GreenTilePositionRanges = { [key: string]: [number, number][] };
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
    xResults[key].sort((a: number, b: number) => a - b);
  });

  Object.keys(yResults).forEach((key: string) => {
    yResults[key].sort((a: number, b: number) => a - b);
  });

  return [xResults, yResults];
};

export const getGreenTilePositions = (userInput: string): [GreenTilePositionRanges, GreenTilePositionRanges] => {
  const [redXCoords, redYCoords] = getRedTilePositions(userInput);
  const xResults: GreenTilePositionRanges = {};
  const yResults: GreenTilePositionRanges = {};
  // Need to be bridged vertically
  Object.keys(redXCoords)
    .filter((key) => redXCoords[key].length > 1)
    .forEach((key) => {
      let colData = redXCoords[key];
      let ranges: [number, number][] = [];
      let newPoint: number[] = [];
      colData.forEach((y) => {
        newPoint.push(y);
        if (newPoint.length === 2) {
          ranges.push(newPoint as [number, number]);
          newPoint = [];
        }
      });
      xResults[key] = ranges;
    });

  // Need to be bridged horizontally
  Object.keys(redYCoords)
    .filter((key) => redYCoords[key].length > 1)
    .forEach((key) => {
      let colData = redYCoords[key];
      let ranges: [number, number][] = [];
      let newPoint: number[] = [];
      colData.forEach((x) => {
        newPoint.push(x);
        if (newPoint.length === 2) {
          ranges.push(newPoint as [number, number]);
          newPoint = [];
        }
      });
      yResults[key] = ranges;
    });

  return [xResults, yResults];
};
const pointToCoord = (point: string): [number, number] => {
  return point.split(",").map((num) => parseInt(num)) as [number, number];
};

export const getHighestArea = (userInput: string): [number, [number, number], [number, number]] => {
  const contents = splitUserInputByCharacter(userInput);
  const visited: { [key: string]: boolean } = {};
  let result = 0;
  let pointCoord: [number, number] | unknown = undefined;
  let pointCoord2: [number, number] | unknown = undefined;
  contents.forEach((point) => {
    pointCoord = pointToCoord(point);
    contents.forEach((point2) => {
      if (visited[point2]) return;
      pointCoord2 = pointToCoord(point2);
      let area = calculateAreaBetweenPoints(pointCoord as [number, number], pointCoord2 as [number, number]);
      result = Math.max(result, area);
    });
    visited[point] = true;
  });
  return [result, pointCoord as [number, number], pointCoord2 as [number, number]];
};

export const calculateAreaBetweenPoints = (pointCoord: [number, number], pointCoord2: [number, number]): number => {
  let xWidth = Math.abs(pointCoord[0] - pointCoord2[0]) + 1;
  let yWidth = Math.abs(pointCoord[1] - pointCoord2[1]) + 1;
  return xWidth * yWidth;
};

export const isRedTile = (currentPoint: [number, number], [redXCoords]: [TilePositions, TilePositions]) => {
  return redXCoords[currentPoint[0]] !== undefined && redXCoords[currentPoint[0]].includes(currentPoint[1]);
};

export const isGreenTile = (
  [greenVerticalXCoords, greenHorizontalYCoords]: [GreenTilePositionRanges, GreenTilePositionRanges],
  pointCoord: [number, number]
): boolean => {
  let isHorizontal =
    greenHorizontalYCoords[pointCoord[1]]?.findIndex(
      (range) => range[0] < pointCoord[0] && range[1] >= pointCoord[0]
    ) >= 0;
  let isVertical =
    greenVerticalXCoords[pointCoord[0]]?.findIndex((range) => range[0] < pointCoord[1] && range[1] > pointCoord[1]) >=
    0;

  if (isHorizontal || isVertical) return true;
  // Find four edge points
  // This x,y point should have a green tile above it
  // That is, a greenHorizontalYCoords key that is less than this with a range where the range contains this pointCoord[0]
  let hasTopEdge = () => {
    let topHorizontalKeys = Object.keys(greenHorizontalYCoords).filter((key) => parseInt(key) <= pointCoord[1]);
    let found = 0;
    for (let i = 0; i < topHorizontalKeys.length; i++) {
      let key = topHorizontalKeys[i];
      let values = greenHorizontalYCoords[key];
      let foundValue = values.filter((pair) => pair[0] <= pointCoord[0] && pair[1] >= pointCoord[0]);
      if (foundValue.length >= 1) found += foundValue.length;
    }
    return found;
  };
  let hasBottomEdge = () => {
    let bottomBorizontalKeys = Object.keys(greenHorizontalYCoords).filter((key) => parseInt(key) >= pointCoord[1]);
    let found = 0;
    for (let i = 0; i < bottomBorizontalKeys.length; i++) {
      let key = bottomBorizontalKeys[i];
      let values = greenHorizontalYCoords[key];
      let foundValue = values.filter((pair) => pair[0] <= pointCoord[0] && pair[1] >= pointCoord[0]);
      if (foundValue.length >= 1) found += foundValue.length;
    }
    return found;
  };

  let hasLeftEdge = () => {
    let leftVerticalKeys = Object.keys(greenVerticalXCoords).filter((key) => parseInt(key) <= pointCoord[0]);
    let found = 0;
    for (let i = 0; i < leftVerticalKeys.length; i++) {
      let key = leftVerticalKeys[i];
      let values = greenVerticalXCoords[key];
      let foundValue = values.filter((pair) => pair[0] <= pointCoord[1] && pair[1] >= pointCoord[1]);
      if (foundValue.length >= 1) found += foundValue.length;
    }
    return found;
  };

  let hasRightEdge = () => {
    let rightVerticalKeys = Object.keys(greenVerticalXCoords).filter((key) => parseInt(key) >= pointCoord[0]);
    let found = 0;
    for (let i = 0; i < rightVerticalKeys.length; i++) {
      let key = rightVerticalKeys[i];
      let values = greenVerticalXCoords[key];
      let foundValue = values.filter((pair) => pair[0] <= pointCoord[1] && pair[1] >= pointCoord[1]);
      if (foundValue.length >= 1) found += foundValue.length;
    }
    return found;
  };

  let leftEdgeCount = hasLeftEdge();
  let rightEdgeCount = hasRightEdge();
  let topEdgeCount = hasTopEdge();
  let bottomEdgeCount = hasBottomEdge();

  let isEnclosed = leftEdgeCount > 1 && rightEdgeCount > 1 && topEdgeCount > 1 && bottomEdgeCount > 1;
  return !isEnclosed && leftEdgeCount > 0 && rightEdgeCount > 0 && topEdgeCount > 0 && bottomEdgeCount > 0;
};

export const isTileValid = (
  line: [number, number],
  redTilePositions: [TilePositions, TilePositions],
  greenTilePositions: [GreenTilePositionRanges, GreenTilePositionRanges],
  knownTiles: { [key: string]: boolean } = {}
) => {
  let cacheKey = `${line}`;
  if (knownTiles[cacheKey]) return knownTiles[cacheKey];
  let result = isRedTile(line, redTilePositions) || isGreenTile(greenTilePositions, line);
  knownTiles[cacheKey] = result;
  return result;
};

export const isAllGreenOrRed = (
  pointCoord: [number, number],
  pointCoord2: [number, number],
  redTilePositions: [TilePositions, TilePositions],
  greenTilePositions: [GreenTilePositionRanges, GreenTilePositionRanges],
  knownTiles: { [key: string]: boolean } = {}
): boolean => {
  if (JSON.stringify(pointCoord) === JSON.stringify(pointCoord2)) {
    return false;
  }
  let [redXCoords, redYCoords] = redTilePositions;
  const [greenXCoords, greenYCoords] = greenTilePositions;
  let coords = [pointCoord, pointCoord2];
  let [[minX], [maxX]] = coords.sort((a, b) => a[0] - b[0]);
  let [[_x1, minY], [_x2, maxY]] = coords.sort((a, b) => a[1] - b[1]);

  let innerYCoords = Object.keys(greenYCoords).filter((y) => parseInt(y) >= minY && parseInt(y) <= maxY);
  for (let i of innerYCoords) {
    let innerBreaches = greenYCoords[i].filter(
      (range) =>
        (range[0] > minX && range[0] < maxX && range[1] > maxX) ||
        (range[0] < minX && range[1] > minX && range[1] < maxX)
    );
    if (innerBreaches.length > 0) return false;

    // Find intersecting lines
    if (parseInt(i) > minY && parseInt(i) < maxY) {
      let outerBreaches = greenYCoords[i].filter((range) => range[0] <= minX && range[1] >= maxX);
      if (outerBreaches.length > 0) return false;
    }
  }

  let innerXCoords = Object.keys(redXCoords).filter((x) => parseInt(x) >= minX && parseInt(x) <= maxX);
  for (let i of innerXCoords) {
    let innerEdges = (redXCoords[i] || []).filter((y) => y >= minY && y <= maxY);
    let gapFound = false;
    let options = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];
    for (let innerPoint of innerEdges) {
      let point = [parseInt(i), innerPoint];
      for (let option of options) {
        let newPoint: [number, number] = [point[0] + option[0], point[1] + option[1]];
        if (newPoint[0] > maxX || newPoint[0] < minX) continue;
        if (newPoint[1] > maxY || newPoint[1] < minY) continue;
        if (!isTileValid(newPoint, redTilePositions, greenTilePositions, knownTiles)) {
          gapFound = true;
          return false;
        }
      }
      if (gapFound) return false;
    }
    if (gapFound) return false;
  }
  return true;
};

export const getHighestAreaWithinPerimeter = (userInput: string): [number, [number, number]?, [number, number]?] => {
  const redTilePositions = getRedTilePositions(userInput);
  const greenTilePositions = getGreenTilePositions(userInput);
  const contents = splitUserInputByCharacter(userInput);
  const visited: { [key: string]: boolean } = {};
  let areaResults: [[number, number], [number, number], number][] = [];
  contents.forEach((point) => {
    let pointCoord = pointToCoord(point);
    contents.forEach((point2) => {
      if (visited[point2]) return;
      let pointCoord2 = pointToCoord(point2);
      let area = calculateAreaBetweenPoints(pointCoord, pointCoord2);
      areaResults.push([pointCoord, pointCoord2, area]);
    });
    visited[point] = true;
  });
  areaResults.sort((a, b) => b[2] - a[2]);

  let knownTiles = {};
  for (let result of areaResults) {
    let [pointCoord, pointCoord2, area] = result;
    let allValid = isAllGreenOrRed(pointCoord, pointCoord2, redTilePositions, greenTilePositions, knownTiles);
    if (allValid) {
      return [area, pointCoord, pointCoord2];
    }
  }
  return [0];
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  let result = 0;
  let messages: string[] = drawGrid(userInput);
  result = getHighestArea(userInput);
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  let benchmark = performance.now();
  let [result, pointCoord, pointCoord2] = getHighestAreaWithinPerimeter(userInput);
  benchmark = performance.now() - benchmark;
  let messages: string[] = [`Largest area is between points: ${pointCoord} and ${pointCoord2}`];
  return { result, messages, benchmark };
};

export const drawGrid = (userInput: string, markSpot?: [number, number]) => {
  const [redXCoords, redYCoords] = getRedTilePositions(userInput);
  const [greenXCoords, greenYCoords] = getGreenTilePositions(userInput);
  let minX = parseInt(Object.keys(redXCoords)[0]);
  let maxX = parseInt(Object.keys(redXCoords)[Object.keys(redXCoords).length - 1]);
  let minY = parseInt(Object.keys(redYCoords)[0]);
  let maxY = parseInt(Object.keys(redYCoords)[Object.keys(redYCoords).length - 1]);
  const results: string[] = [];
  if (maxY - minY > 100) return ["Message too long, could not print grid drawing."];
  for (let i = minY; i <= maxY; i++) {
    let row = "";
    for (let j = minX; j <= maxX; j++) {
      let character = redYCoords[i]?.includes(j) ? "#" : isGreenTile([greenXCoords, greenYCoords], [j, i]) ? "X" : ".";
      if (markSpot && markSpot[0] === j && markSpot[1] === i) character = "S";
      row += character;
    }
    results.push(row);
  }
  return results;
};
