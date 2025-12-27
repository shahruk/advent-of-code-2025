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

export const isGreenTile = (allCoords: RedTilePositions, corner: [number, number]): boolean => {
  let topPoint: [number, number] = [corner[0], allCoords[corner[0]][0]];
  let bottomPoint: [number, number] = [corner[0], allCoords[corner[0]][allCoords[corner[0]].length - 1]];
  // let isValid = (isRedTile(allCoords, topPoint) || isGreenTile(allCoords, topPoint)) && (isRedTile(allCoords, bottomPoint) || isGreenTile(allCoords, bottomPoint));
  return topPoint.length > 0 || bottomPoint.length > 0;
};

export const isRedTile = (allCoords: RedTilePositions, corner: [number, number]): boolean => {
  return allCoords[corner[0]].includes(corner[1]);
}

export const calculateMaxAreaWithinPerimeter = (
  contents: string[],
  allCoords: RedTilePositions,
  pointCoord: [number, number]
): number => {
  let result = 0;
  contents.forEach((point2) => {
    // Determine if any points exist in between
    let pointCoord2 = pointToCoord(point2);
    let sortedCoords = [pointCoord, pointCoord2].sort((a: number[], b: number[]) => a[0] - b[0]);
    console.log('sorted coords:', sortedCoords);

    let redOrGreenTilesOnly = () => {
      let cornersOfInterest: [number, number][] = [[sortedCoords[0][0], sortedCoords[1][1]], [sortedCoords[1][0], sortedCoords[0][1]]];
      let validCorners = cornersOfInterest.filter(corner => {
        let isRed = isRedTile(allCoords, corner);
        if (isRed) return true;
        return isGreenTile(allCoords, corner);
      });

      return validCorners.length === cornersOfInterest.length;
    };
    if (!redOrGreenTilesOnly()) return;
    let intersectingPoint = Object.keys(allCoords).filter((key: string) => {
      if (!(parseInt(key) >= sortedCoords[0][0] && parseInt(key) <= sortedCoords[1][0])) return false;
      let yValues = allCoords[parseInt(key)].filter((yValue: number) => {
        return (
          (yValue > sortedCoords[0][1] && yValue < sortedCoords[1][1]) ||
          (yValue > sortedCoords[1][1] && yValue < sortedCoords[0][1])
        );
      });
      return yValues.length > 0;
    });
    if (intersectingPoint.length > 0) console.log('Rejecting due to intersection', intersectingPoint);
    if (intersectingPoint.length > 0) return;
    let xWidth = Math.abs(pointCoord[0] - pointCoord2[0]) + 1;
    let yWidth = Math.abs(pointCoord[1] - pointCoord2[1]) + 1;
    let area = xWidth * yWidth;
    console.log(sortedCoords, area);
    result = Math.max(result, area);
  });
  return result;
};

export const getHighestAreaWithinPerimeter = (userInput: string): number => {
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  let allCoords = getTilePositions(userInput);
  contents.forEach((point) => {
    let pointCoord = pointToCoord(point);
    result = Math.max(result, calculateMaxAreaWithinPerimeter(contents, allCoords, pointCoord));
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
