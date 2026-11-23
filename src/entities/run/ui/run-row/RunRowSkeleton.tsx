import rowStyles from "./RunRow.module.css";
import styles from "./RunRowSkeleton.module.css";

export function RunRowSkeleton() {
  return (
    <li className={rowStyles.row}>
      <span className={styles.name} />
      <span className={styles.repository} />
      <span className={styles.status} />
      <div className={rowStyles.metadata}>
        <div className={rowStyles.created}>
          <span className={rowStyles.label}>Created</span>
          <span className={styles.date} />
        </div>
        <div className={rowStyles.duration}>
          <span className={rowStyles.label}>Duration</span>
          <span className={styles.duration} />
        </div>
      </div>
    </li>
  );
}
