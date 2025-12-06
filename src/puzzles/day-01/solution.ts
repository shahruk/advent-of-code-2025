import { PuzzleSolutionMetadata } from "@/lib/types";
import { splitUserInputByLine } from "@/lib/utils";

export const calculateValueFromMovement = (movementString: string): number => {
  let negativeOrPositiveMultiplier =
    movementString.substring(0, 1) === "L" ? -1 : 1;
  return (
    negativeOrPositiveMultiplier * (parseInt(movementString.substring(1)) % 100)
  );
};

export const calculateMovementFromPosition = (
  position: number,
  movement: string
): number => {
  let newPosition = position + calculateValueFromMovement(movement);
  if (newPosition < 0) newPosition = 100 + newPosition;
  else if (newPosition >= 100) newPosition = newPosition % 100;
  return newPosition;
};

export const partOne = (userInput: string): PuzzleSolutionMetadata => {
  const contents = splitUserInputByLine(userInput);
  let currentDialPosition = 50;
  let result = 0;
  let messages = [];
  let benchmark = performance.now();
  contents.forEach(movement => {
    currentDialPosition = calculateMovementFromPosition(
      currentDialPosition,
      movement
    );
    if (currentDialPosition === 0) result++;
  });
  messages.push(`The dial points at 0 a total of ${result} times.`);
  return { result, messages, benchmark: `This test took ${performance.now() - benchmark} ms`};
};