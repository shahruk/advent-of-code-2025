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
        let newPath = path.concat([button]);
        let [, newJoltage] = this.pressButtons(newPath);
        if (visitedJoltages[newJoltage.join('')] && visitedJoltages[newJoltage.join('')] <= newPath.length) continue;
        visitedJoltages[newJoltage.join('')] = newPath.length;
        let existingPathJson = JSON.stringify(path);
        let buttonJson = JSON.stringify(button);
        if (existingPathJson.indexOf(buttonJson) >= 0) {
          continue;
        }
        queue.push(newPath);
      }
    }

    return results;
  }

  reduceToZero(joules: number[], knownStates: Record<string, Buttons[]> = this.getAllKnownStates(), depth = 1): number {
    // if (knownStates[joules.join("")]) return knownStates[joules.join("")].length;
    if (joules.filter((num) => num > 0).length === 0) {
      return 0;
    }
    let newEvenRemainder = joules.map((num) => (num % 2 == 0 ? num : num - 1));
    let greaterThanBaseTwo = joules.filter(joule => joule <= 1);
    let oddRemainderMap = this.subtractMatrixes(joules, newEvenRemainder, 0);
    let minStepsForHalfOfEven = greaterThanBaseTwo.length > 0 ? this.findJoltageWithLeastPresses(joules).length : this.reduceToZero(
      newEvenRemainder.map((num) => (num % 2 === 0 ? num / 2 : num)),
      knownStates,
      depth + 1
    );
    let minStepsForOdd = greaterThanBaseTwo.length > 0 ? [] : this.findJoltageWithLeastPresses(oddRemainderMap);
    let answer = minStepsForHalfOfEven >= 0 && minStepsForOdd.length >= 0 ? (greaterThanBaseTwo.length > 0 ? 1 : 2) * minStepsForHalfOfEven + minStepsForOdd.length : -1;
    // console.log(`${newEvenRemainder.map((num) => (num % 2 === 0 ? num / 2 : num))}: ${minStepsForHalfOfEven}, ${oddRemainderMap}: ${minStepsForOdd.length}`);
    console.log('oddSteps:', oddRemainderMap, minStepsForOdd.length, 'evenStepsHalf:', minStepsForHalfOfEven)
    console.log('reduceToZero joules and answer:', joules, answer);
    return answer;
  }

  getStartingPressPaths(knownStates: Record<string, Buttons[]> = {}, knownJoltageMin: Record<string, number> = {}) {
    const visitedJoltages: Record<string, number> = {};
    const extraOddPresses = this.attributes.joules.map(num => num % 2 === 0 ? 0 : 1);
    console.log('starting parity:', extraOddPresses)
    const queue: Buttons[] = [...this.attributes.buttons.map((button) => [button])];
    const results = [];
    let iterations = 0;
    while (queue.length) {
      iterations++;
      const path = queue.shift() as Buttons;
      const [futureState, futureJoltage] = this.pressButtons(path);
      const key = futureState.join("");
      const remainder = this.subtractMatrixes(this.attributes.joules, futureJoltage, 0);
      const allEvenRemaining = remainder.filter((num) => num % 2 !== 0).length === 0;
      if (visitedJoltages[futureJoltage.join("")] && visitedJoltages[futureJoltage.join("")] <= path.length) continue;
      visitedJoltages[futureJoltage.join("")] = path.length;
      if (allEvenRemaining && this.isJoltageMet(futureJoltage, extraOddPresses)) {
        // console.log(path, futureJoltage, 'extra press:', extraOddPresses);
        // console.log(futureState, futureJoltage)
        // console.log(remainder, allEvenRemaining);
        results.push(path);
        continue;
      }
      // if (knownStates[key] && knownStates[key].length <= path.length) continue;
      if (!knownStates[key]) knownStates[key] = [];
      knownStates[key].push(path);
      for (let button of this.attributes.buttons) {
        let existingPathJson = JSON.stringify(path);
        let buttonJson = JSON.stringify(button);
        if (existingPathJson.indexOf(buttonJson) >= 0) {
          // console.log(path, 'exists:', button);
          continue;
        }
        queue.push(path.concat([button]));
      }
    }

    console.log('it took', iterations, knownStates[extraOddPresses.join('')])

    return results;
  }

  configureWithJoltage(targetJoules = this.attributes.joules, knownStates: Record<string, Buttons[]> = {}) {
    if (targetJoules.filter((num) => num > 0).length === 0) {
      return 0;
    }

    // Create a map of known joltages
    const potentialOffsetPresses = this.getStartingPressPaths(knownStates);
    let result = 0;
    console.log(potentialOffsetPresses);
    for (let presses of potentialOffsetPresses) {
      let [futureState, futureJoltage] = this.pressButtons(presses);
      let difference = this.subtractMatrixes(targetJoules, futureJoltage, 0);
      let minPresses = this.reduceToZero(difference, knownStates);
      if (minPresses < 0) continue;
      let currentResult = minPresses + presses.length;
      result = result === 0 ? currentResult : Math.min(result, currentResult);
      console.log('with', presses,' answer is ', result);
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
