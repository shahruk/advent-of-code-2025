import type { PuzzleSolutionMetadata } from "~/lib/types";
import { splitUserInputByCharacter } from "~/lib/utils";

type Buttons = number[][];
type PuzzleStructure = {
  indicator: string;
  buttons: Buttons;
  joules: number[];
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
    for (let buttons of pressButtons) {
      for (let button of buttons) {
        if (!pressed[button.toString()]) pressed[button.toString()] = [button];
        else pressed[button.toString()].push(button);
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
      results[i] = Math.abs(matrix1[i] - matrix2[i]) % base;
      // if (matrix1[i] === matrix2[i]) results[i] = 0;
      // else results[i] = 1;
    }
    return results;
  }

  isJoltageMet(currentJoltage: number[], targetJoltage: number[]): boolean {
    let result = true;
    for (let i = 0; i < currentJoltage.length; i++) {
      if (currentJoltage[i] < targetJoltage[i]) {
        return false;
      }
    }
    return true;
  }

  configureWithJoltage() {
    let queue: Buttons[] = [...this.attributes.buttons].map((button) => [button]);
    let result: Buttons = [];
    let exploredJoltages = new Map();
    let iterations = 0;
    let currentMax = 0;
    while (queue.length) {
      console.log(result);
      let buttonsToPress = queue.shift() as Buttons;
      const isLessPresses = result.length > buttonsToPress.length;
      let [_futureState, futureJoltage] = this.pressButtons(buttonsToPress);
      if (iterations ++ > 5000) {
        console.log('BREAKIN', buttonsToPress)
        return result;
      }
      const futureJoltageKey = futureJoltage.join('');
      if (!exploredJoltages.has(futureJoltageKey)) {
        exploredJoltages.set(futureJoltageKey, buttonsToPress);
      }
      if (parseInt(futureJoltageKey) >= currentMax || isLessPresses) {
        currentMax = parseInt(futureJoltageKey);
      } else {
        continue;
      }
      const isJoltageMet = this.isJoltageMet(futureJoltage, this.attributes.joules);
      console.log(isJoltageMet, futureJoltage, this.attributes.joules)
      if (isJoltageMet) {
        if (result.length === 0 || isLessPresses) {
          result = buttonsToPress;
        }
      } else {
        if (exploredJoltages.has(futureJoltageKey) && buttonsToPress.length > 0 && exploredJoltages.get(futureJoltageKey).length > buttonsToPress.length) continue;

        exploredJoltages.set(futureJoltageKey, buttonsToPress);
      }
      for (let button of this.attributes.buttons) {
        const newQueueItem = buttonsToPress.concat([button]);
        if (result.length > 0 && result.length < newQueueItem.length) continue;
        queue.push(newQueueItem);
      }
    }
    console.log('Ending:', queue);

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
    messages.push(`${machine} was configured by pressing ${leastPresses.length} buttons: ${leastPresses.join(" and then ")}`);
    result += leastPresses.length;
  });
  return { result, messages, benchmark: performance.now() - benchmark };
};
