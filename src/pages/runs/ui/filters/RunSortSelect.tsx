import { parseRunSort, runSortOptions, type RunSort } from "../../model/sorting/runSort";
import styles from "./RunSortSelect.module.css";

type RunSortSelectProps = {
  value: RunSort;
  onChange: (value: RunSort) => void;
};

export function RunSortSelect({ value, onChange }: RunSortSelectProps) {
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
