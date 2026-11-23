import styles from "./SegmentedControl.module.css";

type SegmentedControlProps<Value extends string> = {
  options: readonly { value: Value; label: string }[];
  value: Value;
  onChange: (value: Value) => void;
  label: string;
};

export function SegmentedControl<Value extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<Value>) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
