import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { filterRuns } from "../model/filterRuns";
import { useRunDetails } from "../model/useRunDetails";
import { useRunFilters } from "../model/useRunFilters";
import { useRuns } from "../model/useRuns";
import { RunFilters } from "./RunFilters";
import { RunDetailsDialog } from "./RunDetailsDialog";
import { RunList } from "./RunList";
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
        <RunList runs={visibleRuns} onOpen={openRunDetails} runButtonRef={runButtonRef} />
      ) : (
        <div className={styles.message}>
          <p role="status">No matching runs</p>
          <button type="button" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      )}
      {selectedRun && <RunDetailsDialog run={selectedRun} onClose={closeRunDetails} />}
    </>
  );
}
