import { parseRunSort, runSortOptions, type RunSort } from "../../model/sorting/runSort";
import styles from "./SortSelect.module.css";

type SortSelectProps = {
  value: RunSort;
  onChange: (value: RunSort) => void;
};

export function SortSelect({ value, onChange }: SortSelectProps) {
  const selectedOption = runSortOptions.find((option) => option.value === value);

  return (
    <div className={styles.picker}>
      <select
        aria-label="Sort by"
        value={value}
        onChange={(event) => onChange(parseRunSort(event.target.value))}
      >
        {runSortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.caption} aria-hidden="true">
        Sort by: {selectedOption?.label}
      </span>
    </div>
  );
}
