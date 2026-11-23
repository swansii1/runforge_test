import { useMemo, useRef } from "react";
import { filterRuns } from "../model/filters/filterRuns";
import { sortRuns } from "../model/sorting/sortRuns";
import { useRunDetails } from "../model/useRunDetails";
import { useRunFilters } from "../model/filters/useRunFilters";
import { useRuns } from "../model/useRuns";
import { FilterBar } from "./filters/FilterBar";
import { DetailsDialog } from "./DetailsDialog";
import { RunResults } from "./list/RunResults";
import { ColumnHeaders } from "./list/ColumnHeaders";
import styles from "./RunsPanel.module.css";

export function RunsPanel() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { request, retry } = useRuns();
  const filters = useRunFilters();
  const { appliedSearchQuery, status, sort } = filters;
  const runs = request.status === "success" ? request.runs : undefined;
  const isLoading = request.status === "loading";
  const { selectedRun, openRunDetails, closeRunDetails } = useRunDetails(runs);

  const visibleRuns = useMemo(() => {
    if (!runs) return [];

    const filteredRuns = filterRuns(runs, appliedSearchQuery, status);
    return sortRuns(filteredRuns, sort);
  }, [runs, appliedSearchQuery, status, sort]);

  function handleResetFilters() {
    filters.resetFilters();
    searchInputRef.current?.focus();
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
          <div inert={isLoading} aria-hidden={isLoading}>
            <FilterBar
              searchQuery={filters.draftSearchQuery}
              status={status}
              sort={sort}
              searchInputRef={searchInputRef}
              onSearchChange={filters.updateSearchQuery}
              onStatusChange={filters.setStatus}
              onSortChange={filters.setSort}
            />
            <ColumnHeaders sorting={{ value: sort, onChange: filters.setSort }} />
          </div>
        )}
        <RunResults
          requestStatus={request.status}
          visibleRuns={visibleRuns}
          onOpen={openRunDetails}
          onRetry={retry}
          onResetFilters={handleResetFilters}
        />
      </div>
      {selectedRun && <DetailsDialog run={selectedRun} onClose={closeRunDetails} />}
    </>
  );
}
