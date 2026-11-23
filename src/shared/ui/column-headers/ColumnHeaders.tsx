import styles from "./ColumnHeaders.module.css";

type SortDirection = "ascending" | "descending";

export type ColumnHeader = {
  id: string;
  label: string;
  sort?: {
    direction?: SortDirection;
    nextDirection: SortDirection;
    onToggle: () => void;
  };
};

type ColumnHeadersProps = {
  columns: readonly ColumnHeader[];
  label: string;
  className?: string;
};

export function ColumnHeaders({ columns, label, className }: ColumnHeadersProps) {
  return (
    <div
      className={className ? `${styles.headers} ${className}` : styles.headers}
      role="group"
      aria-label={label}
    >
      {columns.map(({ id, label, sort }) => {
        if (!sort) return <span key={id}>{label}</span>;

        const { direction, nextDirection, onToggle } = sort;
        const action = `Sort ${nextDirection}`;
        const state = direction ? `, sorted ${direction}` : "";

        return (
          <button
            key={id}
            type="button"
            className={styles.sortButton}
            data-active={Boolean(direction)}
            aria-label={`${label}${state}. ${action}`}
            title={action}
            onClick={onToggle}
          >
            {label}
            <span aria-hidden="true">
              {direction === "ascending" ? "↑" : direction === "descending" ? "↓" : "↕"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
