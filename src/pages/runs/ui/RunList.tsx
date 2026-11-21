import { useState } from "react";
import type { Run } from "../../../entities/run";
import { RunDetailsDialog } from "./RunDetailsDialog";
import { RunListItem } from "./RunListItem";
import styles from "./RunList.module.css";

const columnLabels = ["Run", "Status", "Created", "Duration"];

export function RunList({ runs }: { runs: Run[] }) {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const selectedRun = runs.find((run) => run.id === selectedRunId);

  if (selectedRunId !== null && !selectedRun) {
    setSelectedRunId(null);
  }

  return (
    <>
      <div className={styles.columns} aria-hidden="true">
        {columnLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <ul className={styles.list} aria-label="Runs">
        {runs.map((run) => (
          <RunListItem key={run.id} run={run} onOpen={setSelectedRunId} />
        ))}
      </ul>
      {selectedRun && (
        <RunDetailsDialog
          run={selectedRun}
          onClose={() => setSelectedRunId(null)}
        />
      )}
    </>
  );
}
