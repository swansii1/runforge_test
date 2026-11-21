import { useRuns } from "../model/useRuns";
import { RunList } from "./RunList";
import styles from "./RunsPanelContent.module.css";

export function RunsPanelContent() {
  const searchParams = new URLSearchParams(window.location.search);
  const failFirstRequest = searchParams.get("mockError") === "once";
  const { request, retry } = useRuns({ failFirstRequest });

  if (request.status === "loading") {
    return (
      <p className={styles.message} role="status">
        Loading runs…
      </p>
    );
  }

  if (request.status === "error") {
    return (
      <div className={styles.message} role="alert">
        <p>Couldn’t load runs.</p>
        <button type="button" onClick={retry}>
          Retry
        </button>
      </div>
    );
  }

  return <RunList runs={request.runs} />;
}
