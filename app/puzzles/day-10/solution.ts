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
  configureWithFewestPresses(useJoltage = false): Buttons {
    const targetIndicators = this.getIndicatorTarget().join("");
    const sortedButtons = [...this.attributes.buttons].sort((a, b) => a.length - b.length);
    const indexOfInterest = this.findStateDifference(this.getIndicatorTarget());
    let queue: Buttons[] = sortedButtons
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
      let skipQueueFlag = false;
      let buttonsToPress = queue.shift() as Buttons;
      let [futureState, futureJoltage] = this.pressButtons(buttonsToPress);
      let joltageMet = false;
      if (useJoltage) {
        joltageMet = true;
        for (let i = 0; i < this.attributes.joules.length; i++) {
          if (futureJoltage[i] < this.attributes.joules[i]) {
            i = this.attributes.joules.length;
            // console.log(buttonsToPress, 'futureJoltage', futureJoltage, this.attributes.joules);
            joltageMet = false;
          }
        }
      }

      if (!useJoltage || joltageMet) {
        if (futureState.filter((char) => char === 0).length === futureState.length) continue;
        if (futureState.join("") === targetIndicators) {
          if (!useJoltage) return buttonsToPress;
          if (results.length == 0 || (buttonsToPress.length < results.length)) {
            console.log(results);
            results = buttonsToPress;
          }
          skipQueueFlag = true;
        }
      }
      if (exploredStates.has(futureState.join("")) && exploredStates.get(futureState.join("")).length < futureState.length) continue;
      exploredStates.set(futureState.join(""), futureState);
      if (iterations++ > 50000) {
        console.error("Fail at", futureState.join(""), "===", targetIndicators);
        queue = [];
        return [];
      }
      if (useJoltage && !joltageMet) {
        // See if all values are set, and then find the smallest divisor
        let allSet = true;
        for (let i = 0; i < this.attributes.joules.length; i++) {
          if (futureJoltage[i] === 0) {
            allSet = false;
            i = this.attributes.joules.length;
          }
        }
        // See if this doubles up
        // if (allSet) {
        //   let targetJoltage = parseInt(this.attributes.joules.join(""));
        //   let newJoltage = parseInt(futureJoltage.join(""));
        //   let multiples = Math.floor(targetJoltage / newJoltage);
        //   let buttonsToAdd: Buttons = [];
        //   for (let i = 0; i < multiples; i++) {
        //     buttonsToAdd = buttonsToAdd.concat(buttonsToPress);
        //   }
        //   buttonsToPress = buttonsToAdd;
        //   if (multiples) {
        //     // console.log(buttonsToPress, targetJoltage / newJoltage, 'multiples:', multiples, buttonsToPress);
        //   }
        // }
      }
      // if (!skipQueueFlag) {
        for (let button of sortedButtons) {
          const newQueueItem = buttonsToPress.concat([button]);
          queue.push(newQueueItem);
          // if (useJoltage) console.log('inserting:', newQueueItem, queue)
        // }
      }
    }

    return results;
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
  contents.forEach((line) => {});
  return { result, messages, benchmark: performance.now() - benchmark };
};
