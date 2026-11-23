import { memo } from "react";
import { RunRow, type Run } from "../../../../entities/run";
import styles from "./RunList.module.css";

type RunListProps = {
  runs: Run[];
  onOpen: (id: string) => void;
};

export const RunList = memo(function RunList({ runs, onOpen }: RunListProps) {
  return (
    <ul className={styles.list} aria-label="Runs">
      {runs.map((run) => (
        <RunRow key={run.id} run={run} onOpen={onOpen} />
      ))}
    </ul>
  );
});
