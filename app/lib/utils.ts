import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitUserInputByLine = (userInput: string) => {
  return userInput
    .trim()
    .split("\n")
    .map((line: string) => line.trim());
};
