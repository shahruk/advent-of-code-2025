# Advent of Code 2025

Here is a collection of solutions for 2025 Advent of Code. All the code is open source and available to browse. T

This is my second year attempting AoC and my first time completing it. I was greatly inspired by [Fredrik Fornwall's](https://aoc.fornwall.net/) online solution that allows you to plug in your input to get the answer.

This code is hosted publicly on [my personal website](https://adventofcode2025.shahruk.com/).

## Code Architecture
The website is built using [React Router and shadcn](https://ui.shadcn.com/docs/installation/react-router). The puzzle solutions can be found in their respective `app/puzzles/day-${number}` folder. Each puzzle folder contains the following files:

- `solution.ts` contains the solution code
- `solution.test.ts` contains all the tests for the solution code
- `index.ts` contains the puzzle metadata and default inputs shown on the website

Each day's puzzle `solution.ts` will contain a `partOne` and `partTwo` function that accepts the user input and return an object containing a `result`, `messages`, and `benchmark` key.

`result` contains the solution that can be entered on the Advent of Code website

`messages` sometimes contains logs that breakdown the solution step by step so the user can walk through the logic

`benchmark` returns the solution runtime which is dependent on the user's browser and system performance

## Artificial Intelligence (AI)
As the author of this package I attest that none of the code was written by AI. This was an intentional decision to build an Advent of Code solution browser for my own curiosity and learnings.

## Commands

`npm run dev`

Start the webserver

`npm run test app/puzzles/day-01/solution.test.ts`

Run the tests for a specific day

`npm run format`

Run prettier and format the files

`npm run lint:fix`

Run eslint and fix the linting issues

`npm run build`

Generate a static HTML folder.

## Deployment
I host this website on a shared hosting platform as a static HTML site. The website is automatically updated by Github actions when a new commit is pushed to the `release` branch. The Github runner executes `npm run build` and uploads the build files using SFTP to the hosting folder. This is configured in `.github/workflows/deploy-release.yml`

There is an `.htaccess` file in the `public/` folder that allows the single `index.html` to successfully render for all the puzzle URLs that will otherwise break on refresh because these routes only exist as React Router paths.

## How to Run

For the most part, if you want to test a user input given by the Advent of Code website or modify the website you can run `npm run dev` and start editing. If you are looking to refactor the code and are using inputs such as those available publicly on the Advent of Code website you can write a test for that day's solution and run `npm run test ${path-to-test-file}`.

## License
Copyright (c) 2026 Shahruk Khan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.