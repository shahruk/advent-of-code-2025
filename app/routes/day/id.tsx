import { useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SolutionArea } from "~/components/solution-area";
import { puzzles } from "~/puzzles";
import { useEffect, useState } from "react";
import type { PuzzleMetadata } from "~/lib/types";

export default function PuzzleDayPage() {
  const { id } = useParams<{ id: string }>();
  const [userValues, setUserValues] = useState<string[]>([]);
  const [puzzleData, setPuzzleData] = useState<PuzzleMetadata[]>([]);
  useEffect(() => {
    let puzzleData = puzzles[parseInt(id as string)];
    let values: string[] = [];
    puzzleData.forEach((puzzle) => {
      values.push(puzzle.sampleInput);
    });
    setPuzzleData(puzzleData);
    setUserValues(values);
  }, [id]);

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="block min-h-screen w-full max-w-6xl flex-col items-center justify-between py-8 px-16 dark:bg-black sm:items-start">
        {puzzleData && (
          <h1 className="max-w-xs text-3xl mb-8 font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Advent of Code Day {id}{" "}
          </h1>
        )}
        {puzzleData && (
          <Tabs defaultValue="1">
            <TabsList>
              {puzzleData.map((_puzzle, index) => (
                <TabsTrigger key={index + 1} value={(index + 1).toString()}>
                  Part {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {puzzleData.map((puzzle, index) => (
              <TabsContent key={`${id}:${index + 1}`} value={(index + 1).toString()}>
                <div className="mb-4">
                  <Button size="sm" variant="outline" asChild>
                    <a target="_blank" href={`https://github.com/shahruk/advent-of-code-2025/tree/release/app/puzzles/day-${id?.padStart(2, '0')}`}>
                      Browse Github Puzzle Source Code
                    </a>
                  </Button>
                </div>
                <div className="mb-4">
                  <Button size="sm" asChild>
                    <a target="_blank" href={puzzle.srcUrl} rel="noopener noreferrer">
                      Day {id} Puzzle Link
                    </a>
                  </Button>
                </div>
                <div className="flex flex-col w-full justify-between align-top ">
                  <pre className="text-sm px-4 py-2 pb-4 border-2 border-slate-300 max-h-[50vh] block w-full overflow-scroll whitespace-break-spaces">
                    <h2 className="scroll-m-20 border-b pb-2 mb-4 text-xl font-semibold tracking-tight first:mt-0">
                      Part {index + 1}
                    </h2>
                    {puzzle.prompt.trim()}
                  </pre>

                  <SolutionArea
                    defaultValue={userValues[index]}
                    solutionHandler={puzzle.solution}
                    onUserInputChanged={(value: string) => {
                      if (value !== undefined) {
                        let newUserValues = [...userValues];
                        newUserValues[index] = value;
                        setUserValues(newUserValues);
                      }
                    }}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
}
