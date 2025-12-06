"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import {
  PuzzleMetadata,
  PuzzleSolutionHandler,
  PuzzleSolutionMetadata,
} from "../../../lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import Link from "next/link";

const puzzles: { [key: number]: PuzzleMetadata[] } = {
  1: await require("@/puzzles/day-01").default,
};

const SolutionArea = ({
  defaultValue,
  solutionHandler,
}: {
  defaultValue: string;
  solutionHandler: PuzzleSolutionHandler;
}) => {
  const [userAnswer, setUserAnswer] = useState(defaultValue);
  const [answer, setAnswer] = useState<PuzzleSolutionMetadata>();
  const [error, setError] = useState("");
  const onUserSubmit = () => {
    try {
      setError("");
      setAnswer(solutionHandler(userAnswer));
    } catch (e) {
      if (e instanceof Error) {
        setError(e.toString());
      } else {
        setError("An unknown error occured that could not be transcribed.");
        console.error(e);
      }
    }
  };
  return (
    <div className="mt-8 grid w-full gap-3">
      <Label className="text-md">Your puzzle</Label>
      <Textarea
        className="max-h-[50vh]"
        onChange={(e) => setUserAnswer(e.target.value)}
        defaultValue={defaultValue}
      />
      <Button onClick={() => onUserSubmit()}>Run</Button>
      {answer && (
        <div>
          <div>
            Your solution is{" "}
            <span className="text-lg font-bold">{answer.result}</span>
          </div>
          {answer.benchmark !== undefined && answer.benchmark >= 0 && (
            <div>
              {" "}
              <span className="text-lg font-bold">
                The solution took {answer.benchmark}ms
              </span>
            </div>
          )}
          <pre className="max-h-[50vh] overflow-scroll border-2 border-slate-900 text-xs text-white bg-black">
            {answer.messages?.join("\n")}
          </pre>
        </div>
      )}
      {error && <div className="text-lg font-bold text-red-900">{error}</div>}
    </div>
  );
};

export default function DayPage() {
  const params = useParams();
  const puzzleData = puzzles[parseInt(params.id as string)];

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="block min-h-screen w-full max-w-6xl flex-col items-center justify-between py-8 px-16 dark:bg-black sm:items-start">
        {puzzleData && (
          <h1 className="max-w-xs text-3xl mb-8 font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Advent of Code Day {params.id}{" "}
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
                    <Link target="_blank" href={puzzle.srcUrl}>
                      Puzzle Link
                    </Link>
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
