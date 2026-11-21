import { memo } from "react";
import type { Run } from "../../../entities/run";
import { RunListItem } from "./RunListItem";
import styles from "./RunList.module.css";

const columnLabels = ["Run", "Status", "Created", "Duration"];

type RunListProps = {
  runs: Run[];
  onOpen: (id: string, trigger: HTMLButtonElement) => void;
};

export const RunList = memo(function RunList({ runs, onOpen }: RunListProps) {
  return (
    <>
      <div className={styles.columns} aria-hidden="true">
        {columnLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <ul className={styles.list} aria-label="Runs">
        {runs.map((run) => (
          <RunListItem key={run.id} run={run} onOpen={onOpen} />
        ))}
      </ul>
    </>
  );
});
