import type { Ref } from "react";
import { runStatusLabels } from "../../../../entities/run";
import { parseRunSort, runSortOptions, type RunSort } from "../../model/sorting/runSort";
import { statusOptions, type StatusFilter } from "../../model/filters/statusFilter";
import styles from "./RunFilters.module.css";

type RunFiltersProps = {
  searchQuery: string;
  status: StatusFilter;
  sort: RunSort;
  searchInputRef: Ref<HTMLInputElement>;
  activeStatusRef: Ref<HTMLButtonElement>;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onSortChange: (sort: RunSort) => void;
};

export function RunFilters({
  searchQuery,
  status,
  sort,
  searchInputRef,
  activeStatusRef,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: RunFiltersProps) {
  return (
    <div className={styles.toolbar}>
      <input
        ref={searchInputRef}
        className={styles.search}
        type="search"
        aria-label="Search runs"
        placeholder="Search by name or repository"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <div className={styles.statusOptions} role="group" aria-label="Filter by status">
        {statusOptions.map((option) => (
          <button
            key={option}
            ref={status === option ? activeStatusRef : undefined}
            type="button"
            aria-pressed={status === option}
            onClick={() => onStatusChange(option)}
          >
            {option === "all" ? "All" : runStatusLabels[option]}
          </button>
        ))}
      </div>
      <div className={styles.sortPicker}>
        <select
          aria-label="Sort by"
          value={sort}
          onChange={(event) => onSortChange(parseRunSort(event.target.value))}
        >
          {runSortOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
