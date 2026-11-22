import { useCallback, useLayoutEffect, useState } from "react";
import { useLocation, useNavigationType, type Location } from "react-router";
import type { Run } from "../../../entities/run";

type RunSelection = {
  runId: string;
  openedAt: Location;
};

export function useRunDetails(runs: Run[] | undefined) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [selection, setSelection] = useState<RunSelection | null>(null);

  const historyChanged = navigationType === "POP" && selection?.openedAt !== location;
  const selectedRun =
    selection && !historyChanged ? runs?.find((run) => run.id === selection.runId) : undefined;

  const openRunDetails = useCallback(
    (runId: string) => {
      setSelection({ runId, openedAt: location });
    },
    [location],
  );

  function closeRunDetails() {
    setSelection(null);
  }

  useLayoutEffect(() => {
    if (selection && !selectedRun) setSelection(null);
  }, [selection, selectedRun]);

  return { selectedRun, openRunDetails, closeRunDetails };
}
