import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

type Buttons = number[][];
type PuzzleStructure = {
  indicator: string;
  buttons: Buttons;
  joules: number[];
};

type QueueOperation = {
  indexToMatch: number;
  buttonsToPress: Buttons;
};

export class Machine {
  attributes: PuzzleStructure;
  state: number[] = [];
  buttonsPressed: Buttons[] = [];
  input: string;
  joltageCacheMap: Record<string, Buttons> = {};
  constructor(input: string) {
    this.input = input;
    this.attributes = this.parseLine(this.input);
    this.state = this.getInitialState();
  }

  toString() {
    return this.input;
  }

  getInitialState(): number[] {
    let lights = this.attributes.indicator.substring(1, this.attributes.indicator.length - 1);
    return Array(lights.length).fill(0);
  }

  getIndicatorTarget(): number[] {
    let result: number[] = [];
    let lights = this.attributes.indicator.substring(1, this.attributes.indicator.length - 1);
    for (let light of lights) {
      result.push(light === "." ? 0 : 1);
    }
    return result;
  }

pressButtons(presses: Buttons): [number[], number[]] {
    let result: number[] = [...this.state];
    let joltage: number[] = new Array(this.state.length).fill(0);

    for (let i = 0; i < presses.length; i++) {
      let buttons = presses[i];
      for (let j = 0; j < buttons.length; j++) {
        let lightIndex = buttons[j];
        joltage[lightIndex]++;
      }
    }
    
    for (let i = 0; i < result.length; i++) {
      result[i] = (result[i] + joltage[i]) % 2;
    }
    
    return [result, joltage];
  }

  findStateDifference(futureState: number[], currentState?: number[]) {
    let state = currentState || this.state;
    let results: number[] = [];
    for (let i = 0; i < futureState.length; i++) {
      if (state[i] !== futureState[i]) results.push(i);
    }
    return results;
  }

  // Loop until we find the fewest number of button presses to turn the machine on
  configureWithFewestPresses(): Buttons {
    const targetIndicators = this.getIndicatorTarget().join("");
    const indexOfInterest = this.findStateDifference(this.getIndicatorTarget());
    let queue: Buttons[] = [...this.attributes.buttons]
      .filter((buttons) => {
        return indexOfInterest.some((index) => {
          return buttons.includes(index);
        });
      })
      .map((button) => [button]);
    let iterations = 0;
    const exploredStates = new Map();
    let results: Buttons = [];
    while (queue.length) {
      let buttonsToPress = queue.shift() as Buttons;
      let [futureState, futureJoltage] = this.pressButtons(buttonsToPress);
      if (futureState.filter((char) => char === 0).length === futureState.length) continue;
      if (futureState.join("") === targetIndicators) return buttonsToPress;
      if (exploredStates.has(futureState.join(""))) continue;
      exploredStates.set(futureState.join(""), futureState);
      if (iterations++ > 5000) {
        // console.error("Fail at", futureState.join(""), "===", targetIndicators);
        queue = [];
        return [];
      }

      for (let button of this.attributes.buttons) {
        const newQueueItem = buttonsToPress.concat([button]);
        queue.push(newQueueItem);
      }
    }
    return results;
  }

  subtractMatrixes(matrix1: number[], matrix2: number[], minValue = 0): number[] {
    let results: number[] = [];
    for (let i = 0; i < matrix1.length; i++) {
      results[i] = Math.max(minValue, matrix1[i] - matrix2[i]);
    }
    return results;
  }

  isJoltageMet(currentJoltage: number[], targetJoltage: number[] = this.attributes.joules): boolean {
    for (let i = 0; i < currentJoltage.length; i++) {
      if (currentJoltage[i] < targetJoltage[i]) {
        return false;
      }
    }
    return true;
  }

  calculateRemainingJoltages(joltage: number[]): number[] {
    let indexes = [];
    for (let i = 0; i < this.attributes.joules.length; i++) {
      indexes.push(this.attributes.joules[i] - joltage[i]);
    }
    return indexes;
  }

  calculateMinimumPresses(joltage: number[]) {
    let joltagesRemaining = this.subtractMatrixes(this.attributes.joules, joltage);
    return joltagesRemaining.reduce((acc: number, value: number, index: number) => {
      if (value > 0) acc++;
      return acc;
    }, 0);
  }

  calculateJoltageNotMetByIndex(joltage: number[]) {
    let result = [];
    for (let i = 0; i < joltage.length; i++) {
      if (joltage[i] < this.attributes.joules[i]) result.push(i);
    }
    return result;
  }

  buttonsOfInterest(currentJoules: number[], buttonIndex: number) {
    let results = this.attributes.buttons.filter((button) => button.includes(buttonIndex));
    return results;
  }

  // Find the different possibilities to reach the joule target
  calculateNextButtonPresses(buttons: Buttons, indexToMatch: number) {
    let results = [];
    let [, currentJoules] = this.pressButtons(buttons);
    let buttonsOfInterest = this.buttonsOfInterest(currentJoules, indexToMatch);
    for (let button of buttonsOfInterest) {
      let buttonsPressed = [];
      for (let i = currentJoules[indexToMatch]; i < this.attributes.joules[indexToMatch]; i++) {
        buttonsPressed.push(button);
      }
      if (buttonsPressed.length) {
        results.push(buttonsPressed);
      }
    }
    return results;
  }

  generateIndexMap(buttons: Buttons) {
    const counts = buttons.reduce((acc: { [key: string]: number }, pair) => {
      const key = pair.join(",");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return counts;
  }

  getHighestJoltagesNeeded(joules: number[], targetJoltage = this.attributes.joules) {
    let difference = this.subtractMatrixes(targetJoltage, joules);
    return [...new Set(difference)].sort((a, b) => b - a);
  }

  getHighlightedButtons(presses: Buttons = [], targetJoltage = this.attributes.joules) {
    let [, futureJoules] = this.pressButtons(presses);
    let difference = this.subtractMatrixes(targetJoltage, futureJoules);
    let highestJoltages = this.getHighestJoltagesNeeded(futureJoules, targetJoltage);
    let indexes = [];
    for (let [index, joule] of difference.entries()) {
      if (joule === highestJoltages[0]) {
        indexes.push(index);
      }
    }
    let results = [...this.attributes.buttons.filter((button) => button.some((index) => indexes.includes(index)))];
    return results;
  }

  findJoltageWithLeastPresses(targetJoltage: number[], existingJoules: { [key: string]: number } = {}) {
    let result: Buttons = [];
    let iterations = 0;
    let queue: Buttons[] = [...this.attributes.buttons.map((button) => [button])];
    if (targetJoltage.filter((num) => num > 0).length === 0) return result;
    while (queue.length) {
      let path = queue.pop() as Buttons;
      let buttonsToPress = this.getHighlightedButtons(path, targetJoltage);
      let [, currentJoltage] = this.pressButtons(path as Buttons);
      if (this.isJoltageMet(currentJoltage, targetJoltage)) {
        if (!result.length || path.length < result.length) {
          result = path;
        }
      } else {
        if (iterations++ > 10000000) {
          console.log('error;', targetJoltage);
          throw new Error("Breaking due to execution iteration overflow.");
        }
        for (let button of buttonsToPress) {
          let newPath = path.concat([button]);
          let [, futureJoltage] = this.pressButtons(newPath);
          const key = futureJoltage.join("");
          if (existingJoules[key] && existingJoules[key] <= newPath.length) {
            continue;
          }
          existingJoules[key] = newPath.length;
          queue.push(newPath);
        }
      }
    }
    return result;
  }

  getAllKnownStates(): Record<string, Buttons[]> {
    const visitedJoltages: Record<string, number> = {};
    const queue: Buttons[] = [...this.attributes.buttons.map((button) => [button])];
    const results: Record<string, Buttons[]> = {};
    let iterations = 0;
    while (queue.length) {
      (iterations++);
      const path = queue.pop() as Buttons;
      const [futureState, futureJoltage] = this.pressButtons(path);
      const key = futureState.join("");
      if (!results[key]) results[key] = [];
      results[key].push(path);
      for (let button of this.attributes.buttons) {
        if (path.some(buttonPress => JSON.stringify(buttonPress) === JSON.stringify(button))) continue;
        let newPath = path.concat([button]);
        let [, newJoltage] = this.pressButtons(newPath);
        const joltageKey = newJoltage.join(',');
        if (visitedJoltages[joltageKey] && visitedJoltages[joltageKey] <= newPath.length) continue;
        visitedJoltages[joltageKey] = newPath.length;
        queue.push(newPath);
      }
    }

    return results;
  }

reduceToZero(targetJoules: number[], knownStates: Record<string, Buttons[]> = {}, knownReductions: Record<string, number> = {}, depth = 1): number {
  if (targetJoules.every(num => num === 0)) {
    return 0;
  }
  if (Object.keys(knownStates).length === 0) {
    knownStates = this.getAllKnownStates();
  }
  const key = targetJoules.join(',');
  if (knownReductions[key]) return knownReductions[key];
  const solutionParity = targetJoules.map(joule => joule % 2);
  const solutionAllEven = solutionParity.filter(num => num !== 0).length === 0;
  let potentialOffsetPresses = knownStates[solutionParity.join('')] || [];
  const potentialAdditionalExceedingParity = targetJoules.map(joule => joule === 0 ? 1 : joule % 2);
  const potentialAltStates = knownStates[potentialAdditionalExceedingParity.join('')];
  if (targetJoules.includes(0) && potentialOffsetPresses && potentialAltStates?.length > 0) potentialOffsetPresses = potentialOffsetPresses.concat(potentialAltStates);
  let result = Number.MAX_VALUE;
  for (let presses of potentialOffsetPresses) {
    let [futureState, futureJoltage] = this.pressButtons(presses);
    let difference = this.subtractMatrixes(targetJoules, futureJoltage, Number.NEGATIVE_INFINITY);
    if (difference.filter(num => num  % 2 !== 0).length > 0) continue;
    if (difference.some(num => num % 2 !== 0)) continue;
    let minPresses = this.reduceToZero(difference.map(num => num / 2), knownStates, knownReductions);
    if (minPresses < 0) continue;
    // console.log('Equation:', `${presses.length} + 2 * ${difference.map(num => num / 2)} (${minPresses})`)
    let currentResult = 2 * minPresses + presses.length;
    result = result === 0 ? currentResult : Math.min(result, currentResult);
  }
  
  if (solutionAllEven) {
    result = Math.min(result, 2 * this.reduceToZero(targetJoules.map(num => num / 2), knownStates, knownReductions));
  }
  knownReductions[key] = result;
  return result;
}

  getStartingPressPaths() {
    const visitedJoltages: Record<string, number> = {};
    const extraOddPresses = this.attributes.joules.map(num => num % 2 === 0 ? 0 : 1);
    const queue: Buttons[] = [...this.attributes.buttons.map((button) => [button])];
    const results = [];
    let iterations = 0;
    while (queue.length) {
      iterations++;
      const path = queue.shift() as Buttons;
      const [futureState, futureJoltage] = this.pressButtons(path);
      const stateKey = futureState.join(",");
      const joltageKey = futureJoltage.join(',');
      const remainder = this.subtractMatrixes(this.attributes.joules, futureJoltage, 0);
      const allEvenRemaining = remainder.filter((num) => num % 2 !== 0).length === 0;
      if (visitedJoltages[joltageKey] && visitedJoltages[joltageKey] <= path.length) continue;
      visitedJoltages[joltageKey] = path.length;

      // Global cache
      if (!this.joltageCacheMap[joltageKey] || this.joltageCacheMap[joltageKey].length > path.length) {
        this.joltageCacheMap[joltageKey] = path;
      }
      if (allEvenRemaining && this.isJoltageMet(futureJoltage, extraOddPresses)) {
        results.push(path);
        continue;
      }
      for (let button of this.attributes.buttons) {
        let buttonExistsInPath = path.some(item => JSON.stringify(item) === JSON.stringify(button));
        if (buttonExistsInPath) {
          continue;
        }
        queue.push(path.concat([button]));
      }
    }


    return results;
  }

  configureWithJoltage(targetJoules = this.attributes.joules) {
    if (targetJoules.filter((num) => num > 0).length === 0) {
      return 0;
    }

    // Create a map of known joltages
    const result = this.reduceToZero(targetJoules);
    return result;
  }

  /**
   * Given a string, break it into parts
   */
  parseLine(userInput: string): PuzzleStructure {
    let parts = userInput.split(" ");
    const response: PuzzleStructure = {
      indicator: "",
      buttons: [],
      joules: [],
    };
    for (let part of parts) {
      const char = part.substring(0, 1);
      if (char === "[") {
        response.indicator = part;
      } else {
        let numbers: number[] = part
          .substring(1, part.length - 1)
          .split(",")
          .map((num) => parseInt(num));
        if (char === "(") {
          response.buttons.push(numbers);
        } else if (char === "{") {
          response.joules = numbers;
        }
      }
    }
    return response;
  }
}

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput);
  const messages: string[] = [];
  const benchmark = performance.now();
  let result = 0;
  contents.forEach((line) => {
    let machine = new Machine(line);
    const leastPresses = machine.configureWithFewestPresses();
    messages.push(
      `${machine} was configured by pressing ${leastPresses.length} buttons: ${leastPresses.join(" and then ")}.`
    );
    result += leastPresses.length;
  });
  return { result, messages, benchmark: performance.now() - benchmark };
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByCharacter(userInput);
  let result = 0;
  const messages: string[] = [];
  const benchmark = performance.now();
  contents.forEach((line) => {
    let machine = new Machine(line);
    const leastPresses = machine.configureWithJoltage();
    messages.push(
      `${machine} was configured by pressing ${leastPresses} buttons`
    );
    result += leastPresses;
  });
  return { result, messages, benchmark: performance.now() - benchmark };
};
