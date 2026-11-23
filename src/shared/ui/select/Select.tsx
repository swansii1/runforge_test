import styles from "./Select.module.css";

type SelectProps<Value extends string> = {
  label: string;
  options: readonly { value: Value; label: string }[];
  value: Value;
  onChange: (value: Value) => void;
};

export function Select<Value extends string>({
  label,
  options,
  value,
  onChange,
}: SelectProps<Value>) {
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className={styles.picker}>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => {
          const option = options[event.currentTarget.selectedIndex];
          if (option) onChange(option.value);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.caption} aria-hidden="true">
        {selectedOption ? `${label}: ${selectedOption.label}` : label}
      </span>
    </div>
  );
}
