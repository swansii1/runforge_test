import { memo, type RefCallback } from "react";
import type { Run } from "../../../../entities/run";
import { RunListItem } from "./RunListItem";
import styles from "./RunList.module.css";

type RunListProps = {
  runs: Run[];
  runButtonRef: RefCallback<HTMLButtonElement>;
  onOpen: (id: string, trigger: HTMLButtonElement) => void;
};

export const RunList = memo(function RunList({ runs, onOpen, runButtonRef }: RunListProps) {
  return (
    <ul className={styles.list} aria-label="Runs">
      {runs.map((run) => (
        <RunListItem key={run.id} run={run} onOpen={onOpen} runButtonRef={runButtonRef} />
      ))}
    </ul>
  );
});
