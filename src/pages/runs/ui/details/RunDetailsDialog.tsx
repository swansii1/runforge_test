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
  return (
    <ModalDialog title={run.name} onClose={onClose}>
      <RunStatusBadge status={run.status} />
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
      <h3 className={styles.sectionTitle}>Logs</h3>
      <pre className={styles.logs}>{run.logs.join("\n")}</pre>
      {run.result && (
        <section>
          <h3 className={styles.sectionTitle}>Result</h3>
          <p className={styles.result}>{run.result}</p>
        </section>
      )}
    </ModalDialog>
  );
}
