import { useLayoutEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import { filterRuns } from "../model/filterRuns";
import { useRunDetails } from "../model/useRunDetails";
import { useRunFilters } from "../model/useRunFilters";
import { useRuns } from "../model/useRuns";
import { RunFilters } from "./RunFilters";
import { RunDetailsDialog } from "./RunDetailsDialog";
import { RunList } from "./RunList";
import { RunListSkeleton } from "./RunListSkeleton";
import styles from "./RunsPanelContent.module.css";

export function RunsPanelContent() {
  const { searchQuery, debouncedSearchQuery, updateSearchQuery, status, setStatus, resetFilters } =
    useRunFilters();
  const [searchParams] = useSearchParams();
  const failFirstRequest = searchParams.get("mockError") === "once";

  const { request, retry } = useRuns({ failFirstRequest });
  const runs = request.status === "success" ? request.runs : undefined;
  const { selectedRun, openRunDetails, closeRunDetails, activeStatusRef, runButtonRef } =
    useRunDetails(runs);
  const visibleRuns = useMemo(
    () => (runs ? filterRuns(runs, debouncedSearchQuery, status) : []),
    [runs, debouncedSearchQuery, status],
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const focusSearchAfterRetry = useRef(false);

  useLayoutEffect(() => {
    if (!focusSearchAfterRetry.current || request.status === "loading") return;
    focusSearchAfterRetry.current = false;
    if (request.status === "success" && document.activeElement === document.body) {
      searchInputRef.current?.focus();
    }
  }, [request.status]);

  function handleRetry() {
    focusSearchAfterRetry.current = true;
    retry();
  }

  function handleResetFilters() {
    resetFilters();
    searchInputRef.current?.focus();
  }

  if (request.status === "error") {
    return (
      <div className={styles.message} role="alert">
        <p>Couldn’t load runs.</p>
        <button type="button" onClick={handleRetry}>
          Retry
        </button>
      </div>
    );
  }

  const filters = (
    <RunFilters
      searchQuery={searchQuery}
      status={status}
      searchInputRef={searchInputRef}
      activeStatusRef={activeStatusRef}
      onSearchChange={updateSearchQuery}
      onStatusChange={setStatus}
    />
  );

  if (request.status === "loading") {
    return (
      <>
        <div className={styles.loadingFilters} inert aria-hidden="true">
          {filters}
        </div>
        <RunListSkeleton />
      </>
    );
  }

  return (
    <>
      {filters}
      {visibleRuns.length > 0 ? (
        <RunList runs={visibleRuns} onOpen={openRunDetails} runButtonRef={runButtonRef} />
      ) : (
        <div className={styles.message}>
          <p role="status">No matching runs</p>
          <button type="button" onClick={handleResetFilters}>
            Reset filters
          </button>
        </div>
      )}
      {selectedRun && <RunDetailsDialog run={selectedRun} onClose={closeRunDetails} />}
    </>
  );
}
