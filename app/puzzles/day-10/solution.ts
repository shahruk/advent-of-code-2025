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

  pressButtons(pressButtons: Buttons): [number[], number[]] {
    let result: number[] = [...this.state];
    let joltage: number[] = Array(this.state.length).fill(0);
    let pressed: { [key: string]: number[] } = {};
    if (pressButtons?.length) {
      for (let buttons of pressButtons) {
        for (let button of buttons) {
          if (!pressed[button.toString()]) pressed[button.toString()] = [button];
          else pressed[button.toString()].push(button);
        }
      }
    }
    for (let i = 0; i < result.length; i++) {
      let buttonPresses = pressed[i.toString()];
      if (buttonPresses) {
        result[i] = ((buttonPresses.length % 2) + result[i]) % 2;
        joltage[i] += buttonPresses.length;
      }
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

  subtractMatrixes(matrix1: number[], matrix2: number[], minValue = Number.MAX_VALUE): number[] {
    let results: number[] = [];
    for (let i = 0; i < matrix1.length; i++) {
      results[i] = Math.min(minValue, matrix1[i] - matrix2[i]);
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
        if (iterations++ > 10000) {
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

  configureWithJoltage(targetJoules = this.attributes.joules, knownStates: Record<string, Buttons> = {}) {
    if (targetJoules.filter((num) => num > 0).length === 0) {
      return 0;
    }

    // Create a map of known joltages
    const queue: Buttons[] = [...this.attributes.buttons.map((button) => [button])];
    const potentialOffsetPresses = [];
    let result = 0;
    while (queue.length) {
      const path = queue.pop() as Buttons;
      const [futureState, futureJoltage] = this.pressButtons(path);
      const key = futureState.join("");
      const remainder = this.subtractMatrixes(this.attributes.joules, futureJoltage, 0);
      const allEvenRemaining = remainder.filter((num) => num > 0 && num % 2 !== 0).length === 0;
      if (allEvenRemaining) {
        potentialOffsetPresses.push(path);
      }
      if (knownStates[key] && knownStates[key].length <= path.length) continue;
      knownStates[key] = path;
      for (let button of this.attributes.buttons) {
        queue.push(path.concat([button]));
      }
    }

    const reduceToZero = (joules: number[], depth = 1): number => {
      if (knownStates[joules.join("")]) return knownStates[joules.join("")].length;
      if (joules.filter((num) => num < 0).length > 0) {
        return -1;
      }
      if (joules.filter((num) => num > 0).length === 0) {
        return 0;
      }
      if (joules.filter((num) => num > 1).length === 0) {
        return 0;
      }
      if (depth > joules.filter((num) => num > 1).length - 2) {
        return this.findJoltageWithLeastPresses(joules).length;
      }
      let newEvenRemainder = joules.map((num) => (num % 2 == 0 ? num : num - 1));
      let oddRemainderMap = this.subtractMatrixes(joules, newEvenRemainder);
      let minStepsForHalfOfEven = reduceToZero(newEvenRemainder.map((num) => num % 2 === 0 ? num / 2 : num), depth + 1);
      let minStepsForOdd = knownStates[oddRemainderMap.join('')] ? knownStates[oddRemainderMap.join('')].length : -1;
      if (this.isJoltageMet(newEvenRemainder, joules)) {
        minStepsForOdd = 0;
      }
      let answer = minStepsForHalfOfEven >= 0 && minStepsForOdd >= 0 ? 2 * minStepsForHalfOfEven + minStepsForOdd : -1;
      return answer;
    };
    
    let visitedJoltages: Record<string, number> = {};
    for(let presses of potentialOffsetPresses) {
      let [futureState, futureJoltage] = this.pressButtons(presses);
      let remainder = this.subtractMatrixes(this.attributes.joules, futureJoltage);
      const key = futureJoltage.join('');
      if (visitedJoltages[key] && visitedJoltages[key] <= presses.length) {
        continue;
      }
      visitedJoltages[key] = presses.length;
      let difference = this.subtractMatrixes(this.attributes.joules, futureJoltage);
      let minPresses = reduceToZero(difference);
      if (minPresses <= 0) continue;
      let currentResult = minPresses + presses.length;
      result = result === 0 ? currentResult : Math.min(result, currentResult);
    }

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
    // messages.push(
    //   `${machine} was configured by pressing ${leastPresses.length} buttons: ${leastPresses.join(" and then ")}`
    // );
    result += leastPresses;
  });
  console.log(messages);
  return { result, messages, benchmark: performance.now() - benchmark };
};
