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
    const targetIndicators = this.getIndicatorTarget().join("");
    let queue: Buttons[] = [...this.attributes.buttons].map((button) => [button]);
    let result: Buttons = [];
    let exploredStates = new Map();
    let iterations = 0;
    while (queue.length) {
      let buttonsToPress = queue.shift() as Buttons;
      let [futureState, futureJoltage] = this.pressButtons(buttonsToPress);
      const isJoltageMet = this.isJoltageMet(futureJoltage, this.attributes.joules);
      const difference = this.subtractMatrixes(this.getIndicatorTarget(), futureState);
      const differenceKey = difference.join("");
      const isIndicatorMet = true; //parseInt(difference.join("")) === 0;
      const key = futureState.join("");

      // Scenario 1: Difference exists
      if (exploredStates.has(differenceKey)) {
        // Calculate the combined joltage
        // Find what matrix we need to get the result we want, and then validate the joules
        // 10101
        // 11111
        // =====
        // 01010
        const futureButtonPresses = [...buttonsToPress, ...exploredStates.get(differenceKey)];
        let [futureState, futureJoltage] = this.pressButtons(futureButtonPresses);
        const isJoltageMet = this.isJoltageMet(futureJoltage, this.attributes.joules);
        const difference = this.subtractMatrixes(this.getIndicatorTarget(), futureState);
        const isIndicatorMet = parseInt(difference.join("")) === 0;
        // if (isJoltageMet && isIndicatorMet) {
        //   result = futureButtonPresses;
        //   // console.log(
        //   //   "=== VALID ===",
        //   //   futureState,
        //   //   "futureJoltage:",
        //   //   futureJoltage,
        //   //   "futureButtonPResses:",
        //   //   futureButtonPresses,
        //   //   this.attributes
        //   // );
        //   return result;
        // }
      }
        if (iterations++ > 5000) {
          console.error('Ending at 5000 iterations.', isJoltageMet, isIndicatorMet, difference, futureJoltage, this.attributes.joules, 'result:', result);
          return result;
        }
      if (isJoltageMet) {
        if (buttonsToPress.length < exploredStates.get(key).length) {
          exploredStates.set(key, buttonsToPress);
        }
        if (isIndicatorMet) {
          console.log('met:', buttonsToPress, isJoltageMet);
          if (result.length === 0 || buttonsToPress.length < result.length) {
            console.log(result, 'setting:', buttonsToPress)
            result = buttonsToPress;
          }
        }
      } else {
        if (!exploredStates.has(key)) {
          exploredStates.set(key, buttonsToPress);
        } else {
          
          if (buttonsToPress.length < exploredStates.get(key).length) {
            exploredStates.set(key, buttonsToPress);
          } else {
            let [pastState, pastJoltage] = this.pressButtons(exploredStates.get(key));
            let pastJoltageDifference = this.subtractMatrixes(this.attributes.joules, pastJoltage, 10);
            let futureJoltageDifference = this.subtractMatrixes(this.attributes.joules, futureJoltage, 10);
            if (buttonsToPress.length < exploredStates.get(key).length || parseInt(futureJoltageDifference.join('')) < parseInt(pastJoltageDifference.join(''))) {
              exploredStates.set(key, buttonsToPress);
            } else {
              continue;
            }
            
            // console.log('skipping..', this.attributes.joules, futureJoltage, 'future diff:', futureJoltageDifference, 'past:', pastJoltage, pastJoltageDifference);
            // continue;
          }
        }

      }
      // console.log("differenceL", differenceKey, exploredStates);
      // console.log('ITERATING:', buttonsToPress, futureJoltage, this.attributes.joules);
      // if (iterations++ > 10000) return false;
      // if (!isJoltageMet || exploredStates.has(differenceKey)) {
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
