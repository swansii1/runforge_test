import { RunsPanelContent } from "./RunsPanelContent";
import styles from "./RunsPage.module.css";

export function RunsPage() {
  return (
    <>
      <header className={styles.header}>
        <span>runforge</span>
      </header>
      <main className={styles.page}>
        <h1>Runs</h1>
        <div className={styles.panel}>
          <RunsPanelContent />
        </div>
      </main>
    </>
  );
}
