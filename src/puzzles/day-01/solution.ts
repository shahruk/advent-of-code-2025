import { PuzzleSolutionMetadata } from "@/lib/types";
import { splitUserInputByLine } from "@/lib/utils";

export const calculateNumericalRotation = (movementString: string): number => {
  const negativeOrPositiveMultiplier =
    movementString.substring(0, 1) === "L" ? -1 : 1;
  return negativeOrPositiveMultiplier * parseInt(movementString.substring(1));
};

export const calculateNewPositionWithRotation = (
  position: number,
  movement: number
): number => {
  let newPosition = position + (movement % 100);
  if (newPosition < 0) newPosition = 100 + newPosition;
  else if (newPosition >= 100) newPosition = newPosition % 100;
  return newPosition;
};

export const calculateFullRotationCount = (position: number, movement: number): number => {
  let result = Math.floor(Math.abs(movement) / 100);
  const remainder = Math.abs(movement) % 100;
  if (position === 0) return result;

  // Determine if the remainder and direction cross 0
  if (movement >= 0 && remainder >= (100 - position)) {
    result++;
  } else if (movement < 0 && remainder >= position) {
    result++;
  }
  return result;
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByLine(userInput);
  let currentDialPosition = 50;
  let result = 0;
  const messages = [];
  const benchmark = performance.now();
  messages.push(`The dial starts by pointing at ${currentDialPosition}.`)
  contents.forEach(line => {
    const movement = calculateNumericalRotation(line);
    currentDialPosition = calculateNewPositionWithRotation(
      currentDialPosition,
      movement
    );
    messages.push(`The dial is rotated ${movement} to point at ${currentDialPosition}.`)
    if (currentDialPosition === 0) result++;
  });
  return { result, messages, benchmark: performance.now() - benchmark};
};

export const partTwo = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByLine(userInput);
  let currentDialPosition = 50;
  let result = 0;
  const messages = [];
  const benchmark = performance.now();
  messages.push(`The dial starts by pointing at ${currentDialPosition}.`);
  contents.forEach(line => {
    const movement = calculateNumericalRotation(line);
    const rotationCount = calculateFullRotationCount(
      currentDialPosition,
      movement
    );
    currentDialPosition = calculateNewPositionWithRotation(
      currentDialPosition,
      movement
    );
    result += rotationCount;
    let message = `The dial is rotated ${movement} to point at ${currentDialPosition}${rotationCount === 0 ? '.' : '; '}`;
    if (rotationCount > 0) {
      message += `during this rotation, it points at 0 ${rotationCount === 1 ? 'once.' : `${rotationCount} times.`}`
    }
    messages.push(message);
  });
  return { result, messages, benchmark: performance.now() - benchmark };
};