import { ThemeToggle } from "../../../shared/ui/theme-toggle/ThemeToggle";
import { RunsPanel } from "./RunsPanel";
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
        <RunsPanel />
      </main>
    </>
  );
}
