"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import day1 from "@/puzzles/day1";
import { useParams } from "next/navigation";
import { PuzzleMetadata } from "./types";

const puzzles: { [key: number]: PuzzleMetadata[] } = {
  1: day1,
};

interface PageProps {
  params: { id: string };
}
export default function DayPage() {
  // params.id contains the value from the URL
  const params = useParams();
  const puzzleData = puzzles[parseInt(params.id as string)];
  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="block min-h-screen w-full max-w-6xl flex-col items-center justify-between py-8 px-16 dark:bg-black sm:items-start">
        { puzzleData && <h1 className="max-w-xs text-3xl mb-8 font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Advent of Code Day {params.id} </h1>}
        {puzzleData &&
          puzzleData.map((puzzle, index) => (
            <div key={index} className="flex bg-white p-4 flex-col items-center gap-6 text-center sm:items-start sm:text-left mb-8">
              <div className="mb-6 px-4">
                <h2 className="scroll-m-20 border-b pb-2 mb-4 text-3xl font-semibold tracking-tight first:mt-0">
                  Part {index + 1}
                </h2>
                <pre className="block w-full overflow-scroll whitespace-break-spaces">
                  {puzzle.prompt}
                </pre>
                
                <div className="mt-8 grid w-full gap-3">
                  <Label htmlFor="answer">Your puzzle input</Label>
                  <Textarea defaultValue={puzzle.sampleInput} id="answer" />
                </div>
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}
