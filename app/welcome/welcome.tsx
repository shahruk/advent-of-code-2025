import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export function Welcome() {
  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="block min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xl text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to Advent of Code 2025
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            This application lets you try this year's challenges in your web browser. All the code is Open Source and available <Button asChild size="sm"><a href="https://github.com/shahruk/advent-of-code-2025" target="_blank">on Github</a></Button>. Use the left menu to navigate to the puzzle day.
          </p>

          <h3 className="max-w-xl text-xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">About the Author</h3>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Shahruk is a senior frontend engineer who previously worked at AWS Connect and led frontend content marketing architecture and design systems for a large beauty conglomerate.
            <br />
            <br />For more information you can visit their <Button asChild size="sm"><a href="https://shahruk.com/" target="_blank">personal website</a></Button>
          </p>

          <Separator />
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Greatly inspired by <Button asChild variant="outline" size="sm"><a href="https://aoc.fornwall.net/" target="_blank" rel="noopener noreferrer">Fredrik Fornwall</a></Button>.
          </p>
        </div>
      </main>
    </div>
  );
}
