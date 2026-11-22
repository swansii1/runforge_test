import { RunStatusBadge, type Run } from "../../../../entities/run";
import { formatDateTime } from "../../../../shared/lib/formatDateTime";
import { formatDuration } from "../../../../shared/lib/formatDuration";
import { ModalDialog } from "../../../../shared/ui/ModalDialog";
import styles from "./RunDetailsDialog.module.css";

type RunDetailsDialogProps = {
  run: Run;
  onClose: () => void;
};

export function RunDetailsDialog({ run, onClose }: RunDetailsDialogProps) {
  const logLines = run.logs.flatMap((entry) => entry.split(/\r\n?|\n/));

  return (
    <ModalDialog title={run.name} badge={<RunStatusBadge status={run.status} />} onClose={onClose}>
      <dl className={styles.metadata}>
        <div>
          <dt>Repository</dt>
          <dd>{run.repository}</dd>
        </div>
        <div>
          <dt>Branch</dt>
          <dd>{run.branch}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>
            <time dateTime={run.createdAt}>{formatDateTime(run.createdAt)}</time>
          </dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{formatDuration(run.durationSeconds)}</dd>
        </div>
      </dl>
      {run.result && (
        <section className={styles.result} data-status={run.status}>
          <h3 className={styles.sectionTitle}>Result</h3>
          <p>{run.result}</p>
        </section>
      )}
      <h3 className={styles.sectionTitle}>Logs</h3>
      <ol className={styles.logs} role="list" aria-label="Logs">
        {logLines.map((line, index) => (
          <li key={index}>
            <span className={styles.lineNumber} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <code>{line}</code>
          </li>
        ))}
      </ol>
    </ModalDialog>
  );
}
