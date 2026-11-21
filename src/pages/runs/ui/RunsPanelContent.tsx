import { useSearchParams } from "react-router";
import { filterRuns } from "../model/filterRuns";
import { useRunFilters } from "../model/useRunFilters";
import { useRuns } from "../model/useRuns";
import { RunFilters } from "./RunFilters";
import { RunList } from "./RunList";
import styles from "./RunsPanelContent.module.css";

export function RunsPanelContent() {
  const { searchQuery, setSearchQuery, status, setStatus, resetFilters } = useRunFilters();
  const [searchParams] = useSearchParams();
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
