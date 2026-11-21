import type { Run } from "../../../entities/run";
import { RunListItem } from "./RunListItem";
import styles from "./RunList.module.css";

const columnLabels = ["Run", "Status", "Created", "Duration"];

export function RunList({ runs }: { runs: Run[] }) {
  return (
    <>
      <div className={styles.columns} aria-hidden="true">
        {columnLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <ul className={styles.list} aria-label="Runs">
        {runs.map((run) => (
          <RunListItem key={run.id} run={run} />
        ))}
      </ul>
    </>
  );
}
