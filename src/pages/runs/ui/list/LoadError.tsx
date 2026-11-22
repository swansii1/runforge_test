import { LoadErrorIllustration, RetryIcon } from "./LoadErrorIcons";
import { ColumnHeaders } from "./ColumnHeaders";
import styles from "./LoadError.module.css";

export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <>
      <ColumnHeaders />
      <div className={styles.error} role="alert">
        <LoadErrorIllustration />
        <h2>Run list unavailable</h2>
        <p>Try loading the list again.</p>
        <button type="button" onClick={onRetry}>
          <RetryIcon />
          Retry
        </button>
      </div>
    </>
  );
}
