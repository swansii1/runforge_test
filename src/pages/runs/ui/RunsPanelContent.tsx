import { useMemo, useRef } from "react";
import { filterRuns } from "../model/filters/filterRuns";
import { sortRuns } from "../model/sorting/sortRuns";
import { useRunDetails } from "../model/useRunDetails";
import { useRunFilters } from "../model/filters/useRunFilters";
import { useRuns } from "../model/useRuns";
import { RunFilters } from "./filters/RunFilters";
import { RunDetailsDialog } from "./details/RunDetailsDialog";
import { RunList } from "./list/RunList";
import { RunListError } from "./list/RunListError";
import { RunListHeader } from "./list/RunListHeader";
import { RunListSkeleton } from "./list/RunListSkeleton";
import styles from "./RunsPanelContent.module.css";

export function RunsPanelContent() {
  const {
    draftSearchQuery: searchQuery,
    appliedSearchQuery,
    updateSearchQuery,
    status,
    setStatus,
    sort,
    setSort,
    resetFilters,
  } = useRunFilters();
  const { request, retry } = useRuns();
  const runs = request.status === "success" ? request.runs : undefined;
  const { selectedRun, openRunDetails, closeRunDetails } = useRunDetails(runs);
  const visibleRuns = useMemo(
    () => (runs ? sortRuns(filterRuns(runs, appliedSearchQuery, status), sort) : []),
    [runs, appliedSearchQuery, status, sort],
  );

  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleResetFilters() {
    resetFilters();
    searchInputRef.current?.focus();
  }

  let listContent;
  if (request.status === "loading") {
    listContent = <RunListSkeleton />;
  } else if (request.status === "error") {
    listContent = <RunListError onRetry={retry} />;
  } else if (visibleRuns.length === 0) {
    listContent = (
      <div className={styles.message}>
        <p role="status">No matching runs</p>
        <button type="button" onClick={handleResetFilters}>
          Reset filters
        </button>
      </div>
    );
  } else {
    listContent = <RunList runs={visibleRuns} onOpen={openRunDetails} />;
  }

  return (
    <>
      <div className={styles.heading}>
        <h1>Runs</h1>
        <span className={styles.count} aria-live="polite" aria-atomic="true">
          {runs && `${visibleRuns.length} of ${runs.length}`}
        </span>
      </div>
      <div className={styles.panel}>
        {request.status !== "error" && (
          <div inert={request.status === "loading"} aria-hidden={request.status === "loading"}>
            <RunFilters
              searchQuery={searchQuery}
              status={status}
              sort={sort}
              searchInputRef={searchInputRef}
              onSearchChange={updateSearchQuery}
              onStatusChange={setStatus}
              onSortChange={setSort}
            />
            <RunListHeader sorting={{ value: sort, onChange: setSort }} />
          </div>
        )}
        {listContent}
      </div>
      {selectedRun && <RunDetailsDialog run={selectedRun} onClose={closeRunDetails} />}
    </>
  );
}
