import { useState } from "react";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const nextTheme = theme === "light" ? "dark" : "light";
  const label = `Switch to ${nextTheme} theme`;

  function toggleTheme() {
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
    try {
      localStorage.setItem("runforge-theme", nextTheme);
    } catch {
      // Keep the selected theme for this visit if it can't be saved.
    }
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </>
        ) : (
          <path strokeLinejoin="round" d="M20.7 14.2A9 9 0 0 1 9.8 3.3a9 9 0 1 0 10.9 10.9Z" />
        )}
      </svg>
    </button>
  );
}
