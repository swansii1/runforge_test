import { RunStatusBadge, type Run } from "../../../../entities/run";
import { formatDateTimeParts } from "../../../../shared/lib/formatDateTime";
import { formatDuration } from "../../../../shared/lib/formatDuration";
import styles from "./RunList.module.css";

type RunRowProps = {
  run: Run;
  onOpen: (id: string) => void;
};

export function RunRow({ run, onOpen }: RunRowProps) {
  const { date, time } = formatDateTimeParts(run.createdAt);

  return (
    <li className={styles.row}>
      <button
        className={styles.openRun}
        type="button"
        aria-haspopup="dialog"
        onClick={() => onOpen(run.id)}
      >
        {run.name}
      </button>
      <div className={styles.repository}>
        {run.repository} / {run.branch}
      </div>
      <div className={styles.status}>
        <RunStatusBadge status={run.status} />
      </div>
      <div className={styles.metadata}>
        <div className={styles.created}>
          <span className={styles.label}>Created </span>
          <time dateTime={run.createdAt}>
            {date} <span className={styles.timeOfDay}>{time}</span>
          </time>
        </div>
        <div className={styles.duration}>
          <span className={styles.label}>Duration </span>
          {formatDuration(run.durationSeconds)}
        </div>
      </div>
    </li>
  );
}
