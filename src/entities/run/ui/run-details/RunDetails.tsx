import { formatDateTime } from "../../../../shared/lib/formatDateTime";
import { formatDuration } from "../../../../shared/lib/formatDuration";
import type { Run } from "../../model/run";
import styles from "./RunDetails.module.css";

type RunDetailsProps = {
  run: Run;
};

function splitLogEntry(entry: string): string[] {
  const normalized = entry.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  return normalized.split("\n");
}

export function RunDetails({ run }: RunDetailsProps) {
  const logLines = run.logs.flatMap(splitLogEntry);

  return (
    <>
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
    </>
  );
}
