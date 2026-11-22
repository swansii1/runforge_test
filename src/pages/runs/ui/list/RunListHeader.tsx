import { runSortColumns, type RunSort } from "../../model/sorting/runSort";
import styles from "./RunList.module.css";

type RunListHeaderProps = {
  sort: RunSort;
  onSortChange: (sort: RunSort) => void;
};

export function RunListHeader({ sort, onSortChange }: RunListHeaderProps) {
  return (
    <div className={styles.columns} role="group" aria-label="Sort runs">
      <span aria-hidden="true">Run</span>
      <span aria-hidden="true">Status</span>
      {runSortColumns.map(({ label, initial, reverse }) => {
        const active = sort === initial.value || sort === reverse.value;
        const nextSort = sort === initial.value ? reverse.value : initial.value;
        const ascending = sort.endsWith("-asc");
        const action = nextSort.endsWith("-asc") ? "Sort ascending" : "Sort descending";
        const state = active ? `, sorted ${ascending ? "ascending" : "descending"}` : "";

        return (
          <button
            key={initial.value}
            type="button"
            className={styles.sortButton}
            data-active={active}
            aria-label={`${label}${state}. ${action}`}
            title={action}
            onClick={() => onSortChange(nextSort)}
          >
            {label}
            <span aria-hidden="true">{active ? (ascending ? "↑" : "↓") : "↕"}</span>
          </button>
        );
      })}
    </div>
  );
}
