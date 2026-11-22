import listStyles from "./RunList.module.css";
import styles from "./LoadingRows.module.css";

const SKELETON_ROW_COUNT = 6;

export function LoadingRows() {
  return (
    <>
      <p role="status" className={styles.loadingMessage}>
        Loading runs…
      </p>
      <ul className={listStyles.list} aria-hidden="true" inert>
        {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
          <LoadingRow key={index} />
        ))}
      </ul>
    </>
  );
}

function LoadingRow() {
  return (
    <li className={listStyles.row}>
      <span className={styles.name} />
      <span className={styles.repository} />
      <span className={styles.status} />
      <div className={listStyles.metadata}>
        <div className={listStyles.created}>
          <span className={listStyles.label}>Created</span>
          <span className={styles.date} />
        </div>
        <div className={listStyles.duration}>
          <span className={listStyles.label}>Duration</span>
          <span className={styles.duration} />
        </div>
      </div>
    </li>
  );
}
