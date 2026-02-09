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
        console.error("Fail at", futureState.join(""), "===", targetIndicators);
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

  subtractMatrixes(matrix1: number[], matrix2: number[], base = 2): number[] {
    let results: number[] = [];
    for (let i = 0; i < matrix1.length; i++) {
      results[i] = (matrix1[i] - matrix2[i]) % base;
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
    let joltagesRemaining = this.subtractMatrixes(this.attributes.joules, joltage, 10);
    return joltagesRemaining.reduce((acc: number, value: number, index: number) => {
      if (value > 0) return (acc += value);
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
    // let buttonValuesOfInterest = this.calculateJoltageNotMetByIndex(currentJoules);
    // if (!buttonValuesOfInterest.includes(buttonIndex)) return [];
    let results = this.attributes.buttons.filter((button) => button.includes(buttonIndex));
    return results;
  }

  // Find the different possibilities to reach the joule target
  calculateNextButtonPresses(buttons: Buttons, indexToMatch: number) {
    let results = [];
    let [position, currentJoules] = this.pressButtons(buttons);
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

  getHighestJoltagesNeeded(joules: number[]) {
    let difference = this.subtractMatrixes(this.attributes.joules, joules, 10);
    return [...new Set(difference)].sort((a,b) => b - a);
  }

  getHighlightedButtons(presses: Buttons = []) {
    let [, futureJoules] = this.pressButtons(presses);
    let difference = this.subtractMatrixes(this.attributes.joules, futureJoules, 10);
    let sortedDifference = [...new Set(difference)].sort((a,b) => b - a);
    let highestJoltages = this.getHighestJoltagesNeeded(futureJoules);
    let indexes = [];
    for(let [index, joule] of difference.entries()) {

      if (joule === highestJoltages[0]) {
        indexes.push(index);
      }
    }
    return this.attributes.buttons.filter(button => button.some(index => indexes.includes(index)));
  }

  configureWithJoltage() {
    let result: Buttons = [];
    let currentMinimum = Number.MAX_VALUE;
    let currentPaths: Buttons[][] = [];
    let iterations = 0;
    let buttonsToPress = this.getHighlightedButtons();
    let queue: Buttons[] = [...buttonsToPress.map(button => [button])];
    let existingJoules: {[key: string]: number} = {};
    while (queue.length) {
      let path = queue.pop() as Buttons;
      buttonsToPress = this.getHighlightedButtons(path);
      let [, futureJoltage] = this.pressButtons(path as Buttons);
      
      if (result.length) {
        let minPresses = this.calculateMinimumPresses(futureJoltage);
        // if (minPresses + path.length > result.length) continue;

      }
      if (!this.isJoltageMet(futureJoltage)) {
        if (result.length && path.length > result.length) {
          continue;
        }
        if (iterations++ > 100000) {
          // console.error('Breaking because over ' + queue.length,  path.length, result.length);
          throw new Error('Breaking due to execution iteration overflow.')
        }
        for(let button of buttonsToPress) {
          let newPath = path.concat([button]);
          let [, futureJoltage] = this.pressButtons(newPath);
          // let minPresses = this.calculateMinimumPresses(futureJoltage);
          if (existingJoules[futureJoltage.join('')] && existingJoules[futureJoltage.join('')] <= newPath.length) {
            continue;
          }
          existingJoules[futureJoltage.join('')] = newPath.length;
          if (result.length && (newPath.length > result.length)) {
            // console.log('abandoning', JSON.stringify(path));
            continue;
          }
          // console.log('continuing', JSON.stringify(newPath))
          queue.push(newPath);
        }
      } else {
        // console.log('joltage met', futureJoltage)
        if (!result.length || path.length < result.length) {
          // console.log('storing result:', result);
          result = path;
        }
      }
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
    messages.push(
      `${machine} was configured by pressing ${leastPresses.length} buttons: ${leastPresses.join(" and then ")}`
    );
    result += leastPresses.length;
  });
  console.log(messages);
  return { result, messages, benchmark: performance.now() - benchmark };
};
