import { useLayoutEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { filterRuns } from "../model/filters/filterRuns";
import { sortRuns } from "../model/sorting/sortRuns";
import { useRunDetails } from "../model/useRunDetails";
import { useRunFilters } from "../model/filters/useRunFilters";
import { useRuns } from "../model/useRuns";
import { RunFilters } from "./filters/RunFilters";
import { RunDetailsDialog } from "./details/RunDetailsDialog";
import { RunList } from "./list/RunList";
import { RunListHeader } from "./list/RunListHeader";
import { RunListSkeleton } from "./list/RunListSkeleton";
import styles from "./RunsPanelContent.module.css";

export function RunsPanelContent() {
  const {
    searchQuery,
    appliedSearchQuery,
    updateSearchQuery,
    status,
    setStatus,
    sort,
    setSort,
    resetFilters,
  } = useRunFilters();
  const location = useLocation();
  const navigate = useNavigate();
  const failFirstRequest = new URLSearchParams(location.search).get("mockError") === "once";

  const { request, retry } = useRuns({ failFirstRequest });
  const runs = request.status === "success" ? request.runs : undefined;
  const { selectedRun, openRunDetails, closeRunDetails } = useRunDetails(runs);
  const visibleRuns = useMemo(
    () => (runs ? sortRuns(filterRuns(runs, appliedSearchQuery, status), sort) : []),
    [runs, appliedSearchQuery, status, sort],
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const retryPending = useRef(false);

  useLayoutEffect(() => {
    if (!retryPending.current || request.status === "loading") return;
    retryPending.current = false;
    if (request.status !== "success") return;

    if (document.activeElement === document.body) searchInputRef.current?.focus();
    if (failFirstRequest) {
      const params = new URLSearchParams(location.search);
      params.delete("mockError");
      void navigate(
        { pathname: location.pathname, search: params.toString(), hash: location.hash },
        { replace: true, state: location.state },
      );
    }
  }, [request.status, failFirstRequest, location, navigate]);

  function handleRetry() {
    retryPending.current = true;
    retry();
  }

  function handleResetFilters() {
    resetFilters();
    searchInputRef.current?.focus();
  }

  let listContent;
  if (request.status === "loading") {
    listContent = <RunListSkeleton />;
  } else if (request.status === "error") {
    listContent = (
      <div className={styles.message} role="alert">
        <p>Couldn’t load runs.</p>
        <button type="button" onClick={handleRetry}>
          Retry
        </button>
      </div>
    );
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
            <RunListHeader sort={sort} onSortChange={setSort} />
          </div>
        )}
        {listContent}
      </div>
      {selectedRun && <RunDetailsDialog run={selectedRun} onClose={closeRunDetails} />}
    </>
  );
}
