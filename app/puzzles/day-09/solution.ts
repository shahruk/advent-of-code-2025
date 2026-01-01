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
  const visited: { [key: string]: boolean } = {};
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

export const isGreenTile = (
  [greenVerticalXCoords, greenHorizontalYCoords]: [GreenTilePositionRanges, GreenTilePositionRanges],
  pointCoord: [number, number]
): boolean => {
  let isHorizontal =
    greenHorizontalYCoords[pointCoord[1]]?.findIndex((range) => range[0] < pointCoord[0] && range[1] >= pointCoord[0]) >= 0;
  let isVertical =
    greenVerticalXCoords[pointCoord[0]]?.findIndex((range) => range[0] < pointCoord[1] && range[1] > pointCoord[1]) >= 0;

  if (isHorizontal || isVertical) return true;
  // Find four edge points
  // This x,y point should have a green tile above it
  // That is, a greenHorizontalYCoords key that is less than this with a range where the range contains this pointCoord[0]
  let hasTopEdge = () => {
    let topHorizontalKeys = Object.keys(greenHorizontalYCoords).filter(key => parseInt(key) <= pointCoord[1]);
    let result = false;
    for(let i = 0; i < topHorizontalKeys.length; i++) {
      let key = topHorizontalKeys[i];
      let values = greenHorizontalYCoords[parseInt(key)];
      let foundValue = values.findIndex(pair => pair[0] <= pointCoord[0] && pair[1] >= pointCoord[0]);
      if (foundValue >= 0) {
        result = true;
        i = topHorizontalKeys.length;
      }
    }
    return result;
  };
  let hasBottomEdge = () => {
    let bottomBorizontalKeys = Object.keys(greenHorizontalYCoords).filter(key => parseInt(key) >= pointCoord[1]);
    let result = false;
    for(let i = 0; i < bottomBorizontalKeys.length; i++) {
      let key = bottomBorizontalKeys[i];
      let values = greenHorizontalYCoords[parseInt(key)];
      let foundValue = values.findIndex(pair => pair[0] <= pointCoord[0] && pair[1] >= pointCoord[0]);
      if (foundValue >= 0) {
        result = true;
        i = bottomBorizontalKeys.length;
      }
    }
    return result;
  };

  let hasLeftEdge = () => {
    let leftVerticalKeys = Object.keys(greenVerticalXCoords).filter(key => parseInt(key) <= pointCoord[0]);
    let result = false;
    for(let i = 0; i < leftVerticalKeys.length; i++) {
      let key = leftVerticalKeys[i];
      let values = greenVerticalXCoords[parseInt(key)];
      let foundValue = values.findIndex(pair => pair[0] <= pointCoord[1] && pair[1] >= pointCoord[1]);
      if (foundValue >= 0) {
        result = true;
        i = leftVerticalKeys.length;
      }
    }
    return result;
  };

let hasRightEdge = () => {
    let rightVerticalKeys = Object.keys(greenVerticalXCoords).filter(key => parseInt(key) >= pointCoord[0]);
    let result = false;
    for(let i = 0; i < rightVerticalKeys.length; i++) {
      let key = rightVerticalKeys[i];
      let values = greenVerticalXCoords[parseInt(key)];
      let foundValue = values.findIndex(pair => pair[0] <= pointCoord[1] && pair[1] >= pointCoord[1]);
      if (foundValue >= 0) {
        result = true;
        i = rightVerticalKeys.length;
      }
    }
    return result;
  };
  return hasLeftEdge() && hasRightEdge() && hasTopEdge() && hasBottomEdge();
};

export const isWithinPerimeter = (
  pointCoord: [number, number],
  pointCoord2: [number, number],
  [redXCoords, redYCoords]: [TilePositions, TilePositions],
  greenTilePositions: [GreenTilePositionRanges, GreenTilePositionRanges]
): boolean => {
  let result = true;
  let isRedTile = (currentPoint: [number, number]) => {
    return (
      // redXCoords[currentPoint[0]] !== undefined &&
      // redYCoords[currentPoint[1]] !== undefined &&
      redXCoords[currentPoint[0]].includes(currentPoint[1])
    );
  };

  let allCorners: [number, number][] = [
    [pointCoord[0], pointCoord[1]],
    [pointCoord[0], pointCoord2[1]],
    [pointCoord2[0], pointCoord[1]],
    [pointCoord2[0], pointCoord2[1]],
  ];

  for (let i = 0; i < allCorners.length; i++) {
    let isValidTile = isRedTile(allCorners[i]) || isGreenTile(greenTilePositions, allCorners[i]);
    if (!isValidTile) {
      result = false;
      i = allCorners.length;
    }
  }

  return result;

  // let sortedLeftToRight = [pointCoord, pointCoord2].sort((a, b) => a[0] - b[0]);
  // let sortedTopToBottom = [pointCoord, pointCoord2].sort((a, b) => a[1] - b[1]);
  // let xRange = [sortedLeftToRight[0][0], sortedLeftToRight[1][0]];
  // let yRange = [sortedTopToBottom[0][1], sortedTopToBottom[1][1]];
  // // let xSorted = Object.keys(redXCoords);
  // // let ySorted = Object.keys(redYCoords);
  // let xMin = xSorted[0];
  // let xMax = xSorted[xSorted.length - 1];
  // let yMin = ySorted[0];
  // let yMax = ySorted[ySorted.length - 1];
  // // return true;
  // // Find top
  // const findBoundary = (direction: string, currentPoint: [number, number]) => {
  //   let indexToUpdate: number = 0;
  //   let indexIncrement: number = 0;
  //   if (direction === 'top') {
  //     indexToUpdate = 1;
  //     indexIncrement = -1;
  //   } else if (direction === 'left') {
  //     indexToUpdate = 0;
  //     indexIncrement = -1;
  //   } else if (direction === 'right') {
  //     indexToUpdate = 0;
  //     indexIncrement = 1;
  //   } else if (direction === 'bottom') {
  //     indexToUpdate = 1;
  //     indexIncrement = 1;
  //   }
  //   let edgeFound = false;
  //   let isOutOfBounds = false;
  //   while (!edgeFound && !isOutOfBounds) {
  //     if (currentPoint[0] < xMin || currentPoint[0] > xMax || currentPoint[1] < yMin || currentPoint[1] > yMax) {
  //       isOutOfBounds = true;
  //     } else {
  //       let isRedTile: boolean = (redXCoords[currentPoint[0]] !== undefined && redYCoords[currentPoint[1]] !== undefined) && redXCoords[currentPoint[0]].includes(currentPoint[1]);
  //       if (isRedTile || isGreenTile(greenTilePositions, currentPoint)) {
  //         edgeFound = true;
  //       } else {
  //         currentPoint[indexToUpdate] = currentPoint[indexToUpdate] + indexIncrement;
  //       }
  //     }
  //   }
  //   return edgeFound;
  // };

  // let topEnclosed = () => findBoundary('top', [xRange[0], yRange[0]]);
  // let leftEnclosed = () => findBoundary('left', [xRange[0], yRange[1]]);
  // let rightEnclosed = () => findBoundary('right', [xRange[1], yRange[0]]);
  // let bottomEnclosed = () => findBoundary('bottom', [xRange[1], yRange[1]]);

  // result = topEnclosed() && leftEnclosed() && rightEnclosed() && bottomEnclosed();
  // return result;
};
export const isIntersected = (pointCoord: [number, number], pointCoord2: [number, number], redTilePositions: [TilePositions, TilePositions]) => {
  let [redXCoords, redYCoords] = redTilePositions;
  let coords = [pointCoord, pointCoord2];
  let [[minX], [maxX]] = coords.sort((a,b) => a[0] - b[0]);
  let [[_x1, minY], [_x2, maxY]] = coords.sort((a,b) => a[1] - b[1]);
  
  let xValuesWithin = Object.keys(redXCoords).filter(key => parseInt(key) > minX && parseInt(key) < maxX);
  let xValuesIntersectY = xValuesWithin.map(xValue => redXCoords[parseInt(xValue)].filter(value => value > minY && value < maxY));
  return xValuesIntersectY.filter(value => value.length > 0).length > 0;
  
};
export const getHighestAreaWithinPerimeter = (userInput: string): number => {
  const redTilePositions = getRedTilePositions(userInput);
  const greenTilePositions = getGreenTilePositions(userInput);
  const contents = splitUserInputByCharacter(userInput);
  const visited: { [key: string]: boolean } = {};
  let result = 0;
  contents.forEach((point) => {
    let pointCoord = pointToCoord(point);
    contents.forEach((point2) => {
      if (visited[point2]) return;
      let pointCoord2 = pointToCoord(point2);
      let hasIntersections = isIntersected(pointCoord, pointCoord2, redTilePositions);
      let isInside = isWithinPerimeter(pointCoord, pointCoord2, redTilePositions, greenTilePositions);

      // Check four corners for a green or red tile
      // Determine if our entire range is within spec
      let area = calculateAreaBetweenPoints(pointCoord, pointCoord2);
      if (hasIntersections || !isInside) return;
      if (area > result) console.log(pointCoord, pointCoord2, isInside, hasIntersections, area);
      result = Math.max(result, area);
    });
    visited[point] = true;
  });
  return result;
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  let result = 0;
  let messages: string[] = drawGrid(userInput);
  result = getHighestArea(userInput);
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const benchmark = performance.now();
  let result: number = 0;
  let messages: string[] = drawGrid(userInput);
  result = getHighestAreaWithinPerimeter(userInput);
  // console.log('my messages', messages.map(message => message.length !== 96402 && console.log(message)));
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const drawGrid = (userInput: string) => {
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

      row += character;
    }
    results.push(row);
  }
  return results;
};
