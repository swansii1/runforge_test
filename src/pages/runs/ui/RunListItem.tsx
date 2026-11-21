import { RunStatusBadge, type Run } from "../../../entities/run";
import { formatDuration } from "../../../shared/lib/formatDuration";
import styles from "./RunList.module.css";

const createdAtFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function RunListItem({ run }: { run: Run }) {
  return (
    <li className={styles.row}>
      <div>
        <strong>{run.name}</strong>
        <div className={styles.repository}>
          {run.repository} / {run.branch}
        </div>
      </div>
      <div>
        <RunStatusBadge status={run.status} />
      </div>
      <div>
        <span className={styles.label}>Created </span>
        <time dateTime={run.createdAt}>
          {createdAtFormatter.format(new Date(run.createdAt))}
        </time>
      </div>
      <div>
        <span className={styles.label}>Duration </span>
        {formatDuration(run.durationSeconds)}
      </div>
    </li>
  );
}
