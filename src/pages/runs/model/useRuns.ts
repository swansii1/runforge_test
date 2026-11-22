import { useEffect, useEffectEvent, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getRuns, type Run } from "../../../entities/run";

export type RunsRequest =
  { status: "loading" } | { status: "error" } | { status: "success"; runs: Run[] };

export function useRuns() {
  const location = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RunsRequest>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const searchParams = new URLSearchParams(location.search);
  const simulateError = attempt === 0 && searchParams.get("mockError") === "once";

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

  const clearMockError = useEffectEvent(() => {
    if (searchParams.get("mockError") !== "once") return;

    searchParams.delete("mockError");
    void navigate(
      { pathname: location.pathname, search: searchParams.toString(), hash: location.hash },
      { replace: true, state: location.state },
    );
  });

  const retrySucceeded = attempt > 0 && request.status === "success";
  useLayoutEffect(() => {
    if (retrySucceeded) clearMockError();
  }, [retrySucceeded]);

  function retry() {
    setRequest({ status: "loading" });
    setAttempt((previous) => previous + 1);
  }

  return { request, retry };
}
