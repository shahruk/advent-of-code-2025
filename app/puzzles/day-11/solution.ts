import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

export const createNodeMap = (nodeList: string[]) => {
  const result: Record<string, string[]> = {};
  nodeList.map((line) => {
    const [nodeName, nodeChildrenArray] = line.split(":").map((item) => item.trim());
    const nodeChildren = nodeChildrenArray.split(" ");
    if (!result[nodeName]) {
      result[nodeName] = nodeChildren;
    } else {
      result[nodeName] = [...result[nodeName], ...nodeChildren];
    }
  });
  return result;
};

export const findAllPathsOfNodeMap = (
  nodeMap: Record<string, string[]> = {},
  startKey = "you",
  endKey = "out"
): number => {
  const queue = [[startKey]];
  const visitedCache: Record<string, string[][]> = {};
  let maxIterations = 0;
  while (queue.length) {
    if (maxIterations++ > 500000) throw new Error("EXIT! Too many executions");
    const currentPath = queue.pop() as string[];
    const lastNode = currentPath[currentPath.length - 1];
    const futurePaths = nodeMap[lastNode];
    if (futurePaths) {
      for (let path of futurePaths) {
        if (currentPath.includes(path)) continue;
        const futurePath = currentPath.concat(path);
        queue.push(futurePath);
        if (path === endKey) {
          if (visitedCache[endKey]) visitedCache[endKey].push(futurePath);
          else visitedCache[endKey] = [futurePath];
          continue;
        }
      }
    }
  }
  return visitedCache[`${endKey}`].length;
};

export const findAllPathsThroughNodes = (
  nodeMap: Record<string, string[]> = {},
  startKey = "you",
  endKey = "out",
  requiredNodes: string[] = []
): number => {
  const visitedCache: Record<string, number> = {};
  const explore = (node: string = startKey, base = 1, flagOneCaptured = false, flagTwoCaptured = false) => {
    const futurePaths = nodeMap[node];
    const cacheKey = `${node}:${flagOneCaptured};${flagTwoCaptured}`;
    let answer = 0;
    if (visitedCache[cacheKey] !== undefined) {
      return visitedCache[cacheKey];
    }
    if (futurePaths) {
      for (let future of futurePaths) {
        if (future === endKey) {
          answer += flagOneCaptured && flagTwoCaptured ? 1 : 0;
          continue;
        }
        answer += explore(
          future,
          base,
          flagOneCaptured || future === requiredNodes[0],
          flagTwoCaptured || future === requiredNodes[1]
        );
      }
    }
    visitedCache[cacheKey] = answer;
    return answer;
  };

  return explore(startKey);
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput);
  const nodeMap = createNodeMap(contents);
  const result = findAllPathsOfNodeMap(nodeMap);
  const messages: string[] = [];
  const benchmark = performance.now();
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput);
  const nodeMap = createNodeMap(contents);
  let allPaths = findAllPathsThroughNodes(nodeMap, "svr", "out", ["fft", "dac"]);
  const result = allPaths;
  const messages: string[] = [];
  const benchmark = performance.now();
  contents.forEach((line) => {});
  return { result, messages, benchmark: performance.now() - benchmark };
};
