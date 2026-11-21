import type { RunStatus } from "../model/run";
import styles from "./RunStatusBadge.module.css";

const statusLabels: Record<RunStatus, string> = {
  queued: "Queued",
  running: "Running",
  succeeded: "Succeeded",
  failed: "Failed",
};

export function RunStatusBadge({ status }: { status: RunStatus }) {
  return (
    <span className={styles.badge} data-status={status}>
      {statusLabels[status]}
    </span>
  );
}
