import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

type RedTilePositions = { [key: number]: number[] };
type SingleTilePosition = [number, number];

export const getTilePositions = (userInput: string): RedTilePositions => {
  const contents = splitUserInputByCharacter(userInput);
  let results: RedTilePositions = {};
  contents.forEach((line) => {
    let [x, y] = line.split(",").map((coord) => parseInt(coord));
    if (!results[x]) results[x] = [];
    results[x].push(y);
  });

  Object.keys(results).forEach((key: string) => {
    results[parseInt(key)].sort((a: number, b: number) => a - b);
  });

  return results;
};

export const getColumnMinMax = (userInput: string): RedTilePositions => {
  let allCoords = getTilePositions(userInput);
  let sortedXCols = Object.keys(allCoords).sort((a: string, b: string) => parseInt(a) - parseInt(b));
  let min = allCoords[parseInt(sortedXCols[0])][0];
  let max = allCoords[parseInt(sortedXCols[0])][allCoords[parseInt(sortedXCols[0])].length - 1];

  // Loop each column, and set the min max
  for (let i = parseInt(sortedXCols[0]); i < parseInt(sortedXCols[sortedXCols.length - 1]); i++) {
    min = Math.min(min, allCoords[i] ? allCoords[i][0] : Number.MAX_VALUE);
    max = Math.max(max, allCoords[i] ? allCoords[i][allCoords[i].length - 1] : Number.MIN_VALUE);
    allCoords[i] = [min, max];
  }

  return allCoords;
};

const pointToCoord = (point: string): [number, number] => {
  return point.split(",").map((num) => parseInt(num)) as [number, number];
};

export const getHighestArea = (userInput: string): number => {
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  contents.forEach((point) => {
    let pointCoord = pointToCoord(point);
    contents.forEach((point2) => {
      let pointCoord2 = pointToCoord(point2);
      let area = Math.abs(pointCoord[0] - pointCoord2[0] + 1) * Math.abs(pointCoord[1] - pointCoord2[1] + 1);
      result = Math.max(result, area);
    });
  });
  return result;
};

export const calculateAreaBetweenPoints = (pointCoord: [number, number], pointCoord2: [number, number]): number => {
  let xWidth = Math.abs(pointCoord[0] - pointCoord2[0]) + 1;
  let yWidth = Math.abs(pointCoord[1] - pointCoord2[1]) + 1;
  return xWidth * yWidth;
};

// Loop through the X columns and determine if the Y values are within the min max pair
export const checkIsValidRectangle = (
  allCoords: RedTilePositions,
  allCoordsRange: RedTilePositions,
  point1: [number, number],
  point2: [number, number]
): boolean => {
  let [pointCoord, pointCoord2] = [point1, point2].sort((a, b) => a[0] - b[0]);
  let [min, max] = allCoordsRange[pointCoord[0]];
  if (pointCoord[1] < min || pointCoord[1] > max) return false;
  if (pointCoord2[1] < min || pointCoord2[1] > max) return false;
  
  [min, max] = allCoordsRange[pointCoord2[0]];
  if (pointCoord[1] < min || pointCoord[1] > max) return false;
  if (pointCoord2[1] < min || pointCoord2[1] > max) return false;
  
  let [[_x1, y1], [_x2, y2]] = [point1, point2].sort((a, b) => a[1] - b[1]);
  // Loop and see if there are any lines in between in this column
  for (let i = pointCoord[0] + 1; i < pointCoord2[0]; i++) {
    let columnData = allCoords[i];
    if (!columnData) continue;
    let linesWithin = columnData.filter((y) => y > y1 && y < y2);
    if (linesWithin.length > 0) return false;
  }
  return true;
};

export const calculateMaxAreaWithinPerimeter = (
  contents: string[],
  allCoords: RedTilePositions,
  allCoordsRange: RedTilePositions,
  pointCoord: [number, number],
  visited: { [key: string]: boolean } = {}
): number => {
  let result = 0;
  contents.forEach((point2) => {
    if (visited[point2]) return;
    // Determine if any points exist in between
    let pointCoord2 = pointToCoord(point2);
    // Determine if each point in between is part of the maxrange for each column
    let isValid = checkIsValidRectangle(allCoords, allCoordsRange, pointCoord, pointCoord2);
    if (!isValid) return;
    let area = calculateAreaBetweenPoints(pointCoord, pointCoord2);
    console.log(pointCoord, pointCoord2, 'area:', area);
    result = Math.max(result, area);
  });
  return result;
};

export const getHighestAreaWithinPerimeter = (userInput: string): number => {
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  const allCoords = getTilePositions(userInput);
  const allCoordsRange = getColumnMinMax(userInput);
  let visited: { [key: string]: boolean } = {};
  contents.forEach((point) => {
    let pointCoord = pointToCoord(point);
    result = Math.max(
      result,
      calculateMaxAreaWithinPerimeter(contents, allCoords, allCoordsRange, pointCoord, visited)
    );
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
  let messages: string[] = [];
  result = getHighestAreaWithinPerimeter(userInput);
  return { result, messages, benchmark: performance.now() - benchmark };
};
