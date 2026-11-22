import type { Run } from "../../../../entities/run";
import type { RunsRequest } from "../../model/useRuns";
import { RunList } from "./RunList";
import { LoadError } from "./LoadError";
import { LoadingRows } from "./LoadingRows";
import styles from "./RunResults.module.css";

type RunResultsProps = {
  requestStatus: RunsRequest["status"];
  visibleRuns: Run[];
  onOpen: (id: string) => void;
  onRetry: () => void;
  onResetFilters: () => void;
};

export function RunResults({
  requestStatus,
  visibleRuns,
  onOpen,
  onRetry,
  onResetFilters,
}: RunResultsProps) {
  if (requestStatus === "loading") return <LoadingRows />;
  if (requestStatus === "error") return <LoadError onRetry={onRetry} />;
  if (visibleRuns.length > 0) return <RunList runs={visibleRuns} onOpen={onOpen} />;

  return (
    <div className={styles.empty}>
      <p role="status">No matching runs</p>
      <button type="button" onClick={onResetFilters}>
        Reset filters
      </button>
    </div>
  );
}
