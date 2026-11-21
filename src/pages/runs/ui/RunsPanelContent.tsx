import { useState } from "react";
import { filterRuns, type StatusFilter } from "../model/filterRuns";
import { useRuns } from "../model/useRuns";
import { RunFilters } from "./RunFilters";
import { RunList } from "./RunList";
import styles from "./RunsPanelContent.module.css";

export function RunsPanelContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const searchParams = new URLSearchParams(window.location.search);
  const failFirstRequest = searchParams.get("mockError") === "once";

  const { request, retry } = useRuns({ failFirstRequest });

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

  const visibleRuns = filterRuns(request.runs, searchQuery, status);

  function resetFilters() {
    setSearchQuery("");
    setStatus("all");
  }

  return (
    <>
      <RunFilters
        searchQuery={searchQuery}
        status={status}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatus}
      />
      {visibleRuns.length > 0 ? (
        <RunList runs={visibleRuns} />
      ) : (
        <div className={styles.message}>
          <p role="status">No matching runs</p>
          <button type="button" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
