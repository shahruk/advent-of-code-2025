import { useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SolutionArea } from "~/components/solution-area";
import day01Puzzles from "~/puzzles/day-01";
import type { PuzzleMetadata } from "~/lib/types";

const puzzles: { [key: number]: PuzzleMetadata[] } = {
  1: day01Puzzles,
};

export default function PuzzleDayPage() {
  const { id } = useParams<{ id: string }>();
  const puzzleData = puzzles[parseInt(id as string)];

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
                  Day {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {puzzleData.map((puzzle, index) => (
              <TabsContent key={index + 1} value={(index + 1).toString()}>
                <div className="mb-6 px-4">
                  <h2 className="scroll-m-20 border-b pb-2 mb-4 text-xl font-semibold tracking-tight first:mt-0">
                    Part {index + 1}
                  </h2>
                  <Button className="mb-8" asChild>
                    <a
                      target="_blank"
                      href={puzzle.srcUrl}
                      rel="noopener noreferrer"
                    >
                      Puzzle Link
                    </a>
                  </Button>
                  <pre className="text-sm px-4 py-2 pb-4 border-2 border-slate-300 max-h-[50vh] block w-full overflow-scroll whitespace-break-spaces">
                    {puzzle.prompt.trim()}
                  </pre>

                  <SolutionArea
                    defaultValue={puzzle.sampleInput}
                    solutionHandler={puzzle.solution}
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
