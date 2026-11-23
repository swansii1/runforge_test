import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router";
import type { Run } from "../../../entities/run";

export function useRunDetails(runs: Run[] | undefined) {
  const { pathname, search, hash } = useLocation();
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const selectedRun =
    selectedRunId === null ? undefined : runs?.find((run) => run.id === selectedRunId);

  function closeRunDetails() {
    setSelectedRunId(null);
  }

  useLayoutEffect(() => {
    setSelectedRunId(null);
  }, [pathname, search, hash]);

  useLayoutEffect(() => {
    if (selectedRunId !== null && !selectedRun) setSelectedRunId(null);
  }, [selectedRunId, selectedRun]);

  return { selectedRun, openRunDetails: setSelectedRunId, closeRunDetails };
}
