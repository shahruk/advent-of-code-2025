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
}

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
      results[i] = (matrix1[i] - matrix2[i]) % base;
    }
    return results;
  }

  isJoltageMet(currentJoltage: number[], targetJoltage: number[]): boolean {
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
      if (value > 0) return acc += value;
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
    let buttonValuesOfInterest = this.calculateJoltageNotMetByIndex(currentJoules);
    if (!buttonValuesOfInterest.includes(buttonIndex)) return [];
    let results = this.attributes.buttons.filter((button) => button.includes(buttonIndex));
    return results;
  }

  calculateNextButtonPresses(buttons: Buttons, indexToMatch: number) {
    let results = [];
    let [position, currentJoules] = this.pressButtons(buttons);
    let buttonsOfInterest = this.buttonsOfInterest(currentJoules, indexToMatch);
    let missingJoltages = this.calculateRemainingJoltages(currentJoules);
    for (let button of buttonsOfInterest) {
      let buttonsPressed = [...buttons];
      for (let i = currentJoules[indexToMatch]; i <= missingJoltages[indexToMatch]; i++) {
        buttonsPressed.push(button);
      }
      results.push(buttonsPressed)
    }
    return results;
  }

  generateIndexMap(buttons: Buttons) {
    for(let button of buttons) {
      for(let index of button) {
        console.log(index);
      }
    }
  }

  configureWithJoltage() {
    const jouleMap = this.attributes.joules.map((item: number, index: number) => {
      return { index, joules: item };
    });
    let mostEfficientAtPress = new Map();
    let result: Buttons = [];
    let iterations = 0;
    let queue: QueueOperation[] = [];
    for(let button of this.attributes.buttons) {
      queue.push({ indexToMatch: 0, buttonsToPress: [button] });
    }
    while (queue.length) {
      let { indexToMatch, buttonsToPress } = queue.shift() as QueueOperation;
      let currentPresses = buttonsToPress.length;
      let [position, currentJoules] = this.pressButtons(buttonsToPress);
      let minPresses = this.calculateMinimumPresses(currentJoules);
      let totalPressesRequiredInThisThread = minPresses + currentPresses;
      let isTooManyPresses =
        (mostEfficientAtPress.has(currentPresses) &&
          mostEfficientAtPress.get(currentPresses).length < currentPresses) ||
        (result.length > 0 && totalPressesRequiredInThisThread > result.length);

        console.log(buttonsToPress)

      if (minPresses === 0) {
        let winCondition = result.length === 0 || totalPressesRequiredInThisThread < result.length;
        console.log("WIN!!!!", buttonsToPress, winCondition);
        if (winCondition) {
          minPresses = totalPressesRequiredInThisThread;
          result = buttonsToPress;
        }
        continue;
      }
      if (isTooManyPresses) {
        console.log('abandoning', buttonsToPress);
        console.log("isTooManyPresses", isTooManyPresses);
        continue;
      }
      let newButtonPresses = [];
      while (newButtonPresses.length === 0 && indexToMatch <= this.attributes.joules.length) {
        newButtonPresses = this.calculateNextButtonPresses(buttonsToPress, indexToMatch);
        for(let newPresses of newButtonPresses) {
          queue.push({indexToMatch: indexToMatch + 1, buttonsToPress: newPresses});
        }
        indexToMatch++;
      }
    }

    // for (let i = 0; i < sortedJoulesToFill.length; i++) {
    //   let missingJoules = sortedJoulesToFill[i].joules;
    //   while (missingJoules > 0) {
    //     let [position, currentJoules] = this.pressButtons(result);
    //     missingJoules = sortedJoulesToFill[i].joules - currentJoules[sortedJoulesToFill[i].index];
    //     if (missingJoules <= 0) continue;
    //     let indexesWithMissingJoules = [];
    //     let amountMissing = [sortedJoulesToFill[i].joules];

    //     for (let j = i + 1; j < sortedJoulesToFill.length; j++) {
    //       let missingJoules = sortedJoulesToFill[j].joules - currentJoules[j];
    //       if (missingJoules > 0) {
    //         indexesWithMissingJoules.push(sortedJoulesToFill[j].index);
    //       }
    //       amountMissing.push(missingJoules);
    //     }
    //     let buttonsOfInterest = this.attributes.buttons
    //       .filter((button) => button.includes(sortedJoulesToFill[i].index))
    //       .sort((a, b) => {
    //         let aCounter = 0;
    //         let aTotal = 0;
    //         let bCounter = 0;
    //         let bTotal = 0;
    //         for (let button of a) {
    //           if (indexesWithMissingJoules.includes(button)) {
    //             aCounter++;
    //             let index = indexesWithMissingJoules.indexOf(button);
    //             aTotal += amountMissing[index];
    //           }
    //         }
    //         for (let button of b) {
    //           if (indexesWithMissingJoules.includes(button)) {
    //             bCounter++;
    //             let index = indexesWithMissingJoules.indexOf(button);
    //             bTotal += amountMissing[index];
    //           }
    //         }
    //         if (bCounter == aCounter) {
    //           return bTotal - aTotal;
    //         }
    //         return bCounter - aCounter;
    //       });
    //     queue.push(...buttonsOfInterest);
    //     result.push(buttonsOfInterest[0]);
    //   }
    // }
    console.log(result);
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
  return { result, messages, benchmark: performance.now() - benchmark };
};
