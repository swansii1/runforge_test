import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigationType, type Location } from "react-router";
import type { Run } from "../../../entities/run";

type RunSelection = {
  runId: string;
  openedAt: Location;
  trigger: HTMLButtonElement;
};

export function useRunDetails(runs: Run[] | undefined) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const activeStatusRef = useRef<HTMLButtonElement>(null);
  const restoredTrigger = useRef<HTMLButtonElement | null>(null);
  const focusFilterAfterRemoval = useRef(false);
  const [selection, setSelection] = useState<RunSelection | null>(null);

  const historyChanged = navigationType === "POP" && selection?.openedAt !== location;
  const selectedRun =
    selection && !historyChanged ? runs?.find((run) => run.id === selection.runId) : undefined;

  const openRunDetails = useCallback(
    (runId: string, trigger: HTMLButtonElement) => {
      setSelection({ runId, trigger, openedAt: location });
    },
    [location],
  );

  const closeRunDetails = useCallback(() => {
    if (!selection) return;

    restoredTrigger.current = selection.trigger.isConnected ? selection.trigger : null;
    const focusTarget = restoredTrigger.current ?? activeStatusRef.current;
    setSelection(null);
    focusTarget?.focus();
  }, [selection]);

  const runButtonRef = useCallback((button: HTMLButtonElement | null) => {
    if (!button) return;

    // React detaches the ref before the removed button loses focus to the document body.
    return () => {
      if (restoredTrigger.current !== button) return;
      restoredTrigger.current = null;
      focusFilterAfterRemoval.current = document.activeElement === button;
    };
  }, []);

  useLayoutEffect(() => {
    // A history change can replace the active filter ref in the same commit as the row.
    if (!focusFilterAfterRemoval.current) return;
    focusFilterAfterRemoval.current = false;
    if (document.activeElement === document.body) activeStatusRef.current?.focus();
  });

  useLayoutEffect(() => {
    if (selection && !selectedRun) closeRunDetails();
  }, [selection, selectedRun, closeRunDetails]);

  return { selectedRun, openRunDetails, closeRunDetails, activeStatusRef, runButtonRef };
}
