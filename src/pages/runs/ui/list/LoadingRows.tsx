import { RunRowSkeleton } from "../../../../entities/run";
import styles from "./RunList.module.css";

const SKELETON_ROW_COUNT = 6;

export function LoadingRows() {
  return (
    <>
      <p role="status" className={styles.loadingMessage}>
        Loading runs…
      </p>
      <ul className={styles.list} aria-hidden="true" inert>
        {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
          <RunRowSkeleton key={index} />
        ))}
      </ul>
    </>
  );
}
