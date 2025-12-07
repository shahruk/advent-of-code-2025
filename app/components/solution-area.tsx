import { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import type {
  PuzzleSolutionHandler,
  PuzzleSolutionMetadata,
} from "~/lib/types";

export const SolutionArea = ({
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
