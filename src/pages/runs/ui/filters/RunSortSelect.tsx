import { parseRunSort, runSortOptions, type RunSort } from "../../model/sorting/runSort";
import styles from "./RunSortSelect.module.css";

type RunSortSelectProps = {
  value: RunSort;
  onChange: (value: RunSort) => void;
};

export function RunSortSelect({ value, onChange }: RunSortSelectProps) {
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
    </div>
  );
}
