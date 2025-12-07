This is a NextJS project showing the results to Advent of Code 2025. It allows you to run the sample input or your own input and get the correct results.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding Puzzles

To add a puzzle, create a new folder in the puzzles directory. It should contain:

```
index.ts            | Provides the metadata such as puzzle prompt, solution function handler, and sample input data for display.
solution.ts         | Has the puzzle solution
solution.test.ts    | Tests for the solution
```

Then add the puzzle into `src/app/day/[id]/page.tsx`. The solution function should ideally return results, messages, and benchmark as object keys.

```
results       | A simple string representing the answer to put into Advent of Code
messages      | An array of string messages that log the logic flow
benchmarks    | A performance.now() measurement for the entirety of the solution
```
