import type { Ref } from "react";
import { runStatusLabels } from "../../../../entities/run";
import { statusOptions, type StatusFilter } from "../../model/filters/statusFilter";
import type { RunSort } from "../../model/sorting/runSort";
import styles from "./FilterBar.module.css";
import { SortSelect } from "./SortSelect";

type FilterBarProps = {
  searchQuery: string;
  status: StatusFilter;
  sort: RunSort;
  searchInputRef: Ref<HTMLInputElement>;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onSortChange: (sort: RunSort) => void;
};

export function FilterBar({
  searchQuery,
  status,
  sort,
  searchInputRef,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchField}>
        <input
          ref={searchInputRef}
          type="search"
          aria-label="Search runs"
          placeholder="Search by name or repository"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className={styles.statusOptions} role="group" aria-label="Filter by status">
        {statusOptions.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={status === option}
            onClick={() => onStatusChange(option)}
          >
            {option === "all" ? "All" : runStatusLabels[option]}
          </button>
        ))}
      </div>
      <div className={styles.mobileSort}>
        <SortSelect value={sort} onChange={onSortChange} />
      </div>
    </div>
  );
}
