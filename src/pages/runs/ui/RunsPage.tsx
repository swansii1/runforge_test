import { ThemeToggle } from "../../../shared/ui/theme-toggle/ThemeToggle";
import { RunsPanelContent } from "./RunsPanelContent";
import styles from "./RunsPage.module.css";

export function RunsPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.brand}>runforge</span>
          <ThemeToggle />
        </div>
      </header>
      <main className={styles.page}>
        <RunsPanelContent />
      </main>
    </>
  );
}
