import type { RunStatus } from "../model/run";
import { runStatusLabels } from "../model/runStatusLabels";
import styles from "./RunStatusBadge.module.css";

export function RunStatusBadge({ status }: { status: RunStatus }) {
  return (
    <span className={styles.badge} data-status={status}>
      {runStatusLabels[status]}
    </span>
  );
}
