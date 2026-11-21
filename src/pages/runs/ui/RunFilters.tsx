import type { Ref } from "react";
import { runStatusLabels } from "../../../entities/run";
import { statusOptions, type StatusFilter } from "../model/statusFilter";
import styles from "./RunFilters.module.css";

type RunFiltersProps = {
  searchQuery: string;
  status: StatusFilter;
  activeStatusRef: Ref<HTMLButtonElement>;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: StatusFilter) => void;
};

export function RunFilters({ searchQuery, status, activeStatusRef, onSearchChange, onStatusChange }: RunFiltersProps) {
  return (
    <div className={styles.toolbar}>
      <input
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
    </div>
  );
}
