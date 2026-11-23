import { useRunDetails } from "../model/useRunDetails";
import { useRuns } from "../model/useRuns";
import { useRunsView } from "../model/useRunsView";
import { DetailsDialog } from "./DetailsDialog";
import { RunResults } from "./list/RunResults";
import { RunsPanelHeader } from "./RunsPanelHeader";
import styles from "./RunsPanel.module.css";

export function RunsPanel() {
  const { request, retry } = useRuns();
  const runs = request.status === "success" ? request.runs : undefined;
  const { visibleRuns, searchField, statusFilter, sorting, resetFilters } = useRunsView(runs);
  const { selectedRun, openRunDetails, closeRunDetails } = useRunDetails(runs);

  return (
    <>
      <div className={styles.heading}>
        <h1>Runs</h1>
        <span className={styles.count} aria-live="polite" aria-atomic="true">
          {runs && `${visibleRuns.length} of ${runs.length}`}
        </span>
      </div>
      <div className={styles.panel}>
        <RunsPanelHeader
          requestStatus={request.status}
          searchField={searchField}
          statusFilter={statusFilter}
          sorting={sorting}
        />
        <RunResults
          requestStatus={request.status}
          visibleRuns={visibleRuns}
          onOpen={openRunDetails}
          onRetry={retry}
          onResetFilters={resetFilters}
        />
      </div>
      {selectedRun && <DetailsDialog run={selectedRun} onClose={closeRunDetails} />}
    </>
  );
}
