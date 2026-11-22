import { ThemeToggle } from "../../../shared/ui/theme-toggle/ThemeToggle";
import { RunsPanelContent } from "./RunsPanelContent";
import styles from "./RunsPage.module.css";

export function RunsPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.7 18a4.7 4.7 0 0 1-.6-9.36 6.1 6.1 0 0 1 11.53-1.02A5.23 5.23 0 0 1 17.77 18Z" />
              </svg>
            </span>
            runforge
          </span>
          <ThemeToggle />
        </div>
      </header>
      <main className={styles.page}>
        <RunsPanelContent />
      </main>
    </>
  );
}
