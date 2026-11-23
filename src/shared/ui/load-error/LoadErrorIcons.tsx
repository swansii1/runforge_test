import styles from "./LoadError.module.css";

export function LoadErrorIllustration() {
  return (
    <svg className={styles.illustration} viewBox="0 0 64 48" aria-hidden="true">
      <g stroke="var(--border)" strokeWidth="1.5">
        <rect
          x="5"
          y="7"
          width="44"
          height="28"
          rx="5"
          fill="var(--surface-muted)"
          transform="rotate(-9 27 21)"
        />
        <rect
          x="8"
          y="9"
          width="44"
          height="28"
          rx="5"
          fill="var(--surface)"
          transform="rotate(-4 30 23)"
        />
        <rect x="11" y="13" width="44" height="28" rx="5" fill="var(--surface)" />
      </g>
      <path
        d="M18 21h22m-22 6h28m-28 6h15"
        stroke="var(--control-border)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="53"
        cy="38"
        r="9"
        fill="var(--failed-bg)"
        stroke="var(--surface)"
        strokeWidth="2"
      />
      <path d="M53 34v4m0 3v.2" stroke="var(--failed-text)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function RetryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 4v6h-6M20 10a8 8 0 1 0-.5 6" />
    </svg>
  );
}
