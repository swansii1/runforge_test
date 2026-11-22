import { runSortColumns, type RunSort } from "../../model/sorting/runSort";
import styles from "./RunList.module.css";

type ColumnHeadersProps = {
  sorting?: { value: RunSort; onChange: (sort: RunSort) => void };
};

export function ColumnHeaders({ sorting }: ColumnHeadersProps) {
  return (
    <div
      className={styles.columns}
      role={sorting ? "group" : undefined}
      aria-label={sorting ? "Sort runs" : undefined}
      aria-hidden={sorting ? undefined : true}
    >
      <span aria-hidden="true">Run</span>
      <span aria-hidden="true">Status</span>
      {runSortColumns.map(({ label, initial, reverse }) => {
        if (!sorting) return <span key={initial.value}>{label}</span>;
        const sort = sorting.value;
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
            onClick={() => sorting.onChange(nextSort)}
          >
            {label}
            <span aria-hidden="true">{active ? (ascending ? "↑" : "↓") : "↕"}</span>
          </button>
        );
      })}
    </div>
  );
}
