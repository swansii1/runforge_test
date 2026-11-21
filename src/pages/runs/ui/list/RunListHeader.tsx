import styles from "./RunList.module.css";

const columnLabels = ["Run", "Status", "Created", "Duration"];

export function RunListHeader() {
  return (
    <div className={styles.columns} aria-hidden="true">
      {columnLabels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  );
}
