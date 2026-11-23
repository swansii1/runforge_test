import type { Ref } from "react";
import styles from "./RunSearchField.module.css";

type RunSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  inputRef: Ref<HTMLInputElement>;
};

export function RunSearchField({ value, onChange, inputRef }: RunSearchFieldProps) {
  return (
    <div className={styles.searchField}>
      <input
        ref={inputRef}
        type="search"
        aria-label="Search runs"
        placeholder="Search by name or repository"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
