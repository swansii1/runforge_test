import { useEffect, useState } from "react";
import { getRuns, type Run } from "../../../entities/run";

type RunsRequest = { status: "loading" } | { status: "error" } | { status: "success"; runs: Run[] };

export function useRuns({ failFirstRequest }: { failFirstRequest: boolean }) {
  const [request, setRequest] = useState<RunsRequest>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const simulateError = failFirstRequest && attempt === 0;

  useEffect(() => {
    let ignore = false;

    async function loadRuns() {
      try {
        const runs = await getRuns({ simulateError });
        if (!ignore) setRequest({ status: "success", runs });
      } catch {
        if (!ignore) setRequest({ status: "error" });
      }
    }

    void loadRuns();
    return () => {
      ignore = true;
    };
  }, [attempt, simulateError]);

  function retry() {
    setRequest({ status: "loading" });
    setAttempt((previous) => previous + 1);
  }

  return { request, retry };
}
