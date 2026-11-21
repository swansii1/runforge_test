import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  useLocation,
  useNavigationType,
  useSearchParams,
  type Location,
} from "react-router";
import { filterRuns } from "../model/filterRuns";
import { useRunFilters } from "../model/useRunFilters";
import { useRuns } from "../model/useRuns";
import { RunFilters } from "./RunFilters";
import { RunDetailsDialog } from "./RunDetailsDialog";
import { RunList } from "./RunList";
import styles from "./RunsPanelContent.module.css";

type RunSelection = {
  runId: string;
  openedAt: Location;
  trigger: HTMLButtonElement;
};

export function RunsPanelContent() {
  const {
    searchQuery,
    debouncedSearchQuery,
    updateSearchQuery,
    status,
    setStatus,
    resetFilters,
  } = useRunFilters();
  const location = useLocation();
  const navigationType = useNavigationType();
  const [searchParams] = useSearchParams();
  const failFirstRequest = searchParams.get("mockError") === "once";

  const { request, retry } = useRuns({ failFirstRequest });
  const [selection, setSelection] = useState<RunSelection | null>(null);
  const activeStatusRef = useRef<HTMLButtonElement>(null);
  const visibleRuns = useMemo(
    () =>
      request.status === "success"
        ? filterRuns(request.runs, debouncedSearchQuery, status)
        : [],
    [request, debouncedSearchQuery, status],
  );
  const selectedRun = selection
    ? visibleRuns.find((run) => run.id === selection.runId)
    : undefined;
  const historyChanged =
    navigationType === "POP" && selection?.openedAt !== location;
  const showDetails = selectedRun && !historyChanged;

  const openRunDetails = useCallback(
    (runId: string, trigger: HTMLButtonElement) => {
      setSelection({ runId, trigger, openedAt: location });
    },
    [location],
  );

  useLayoutEffect(() => {
    if (!selection || showDetails) return;

    const focusTarget = selection.trigger.isConnected
      ? selection.trigger
      : activeStatusRef.current;
    focusTarget?.focus();
    setSelection(null);
  }, [selection, showDetails]);

  if (request.status === "loading") {
    return (
      <p className={styles.message} role="status">
        Loading runs…
      </p>
    );
  }

  if (request.status === "error") {
    return (
      <div className={styles.message} role="alert">
        <p>Couldn’t load runs.</p>
        <button type="button" onClick={retry}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <RunFilters
        searchQuery={searchQuery}
        status={status}
        activeStatusRef={activeStatusRef}
        onSearchChange={updateSearchQuery}
        onStatusChange={setStatus}
      />
      {visibleRuns.length > 0 ? (
        <RunList runs={visibleRuns} onOpen={openRunDetails} />
      ) : (
        <div className={styles.message}>
          <p role="status">No matching runs</p>
          <button type="button" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      )}
      {showDetails && (
        <RunDetailsDialog
          run={selectedRun}
          onClose={() => setSelection(null)}
        />
      )}
    </>
  );
}
