import type { RefCallback } from "react";
import { RunStatusBadge, type Run } from "../../../../entities/run";
import { formatDateTime } from "../../../../shared/lib/formatDateTime";
import { formatDuration } from "../../../../shared/lib/formatDuration";
import styles from "./RunList.module.css";

type RunListItemProps = {
  run: Run;
  runButtonRef: RefCallback<HTMLButtonElement>;
  onOpen: (id: string, trigger: HTMLButtonElement) => void;
};

export function RunListItem({ run, onOpen, runButtonRef }: RunListItemProps) {
  return (
    <li className={styles.row}>
      <div>
        <button
          ref={runButtonRef}
          className={styles.openRun}
          type="button"
          aria-haspopup="dialog"
          onClick={(event) => {
            event.currentTarget.focus();
            onOpen(run.id, event.currentTarget);
          }}
        >
          {run.name}
        </button>
        <div className={styles.repository}>
          {run.repository} / {run.branch}
        </div>
      </div>
      <div>
        <RunStatusBadge status={run.status} />
      </div>
      <div>
        <span className={styles.label}>Created </span>
        <time dateTime={run.createdAt}>{formatDateTime(run.createdAt)}</time>
      </div>
      <div>
        <span className={styles.label}>Duration </span>
        {formatDuration(run.durationSeconds)}
      </div>
    </li>
  );
}
