import { RunsPanel } from "../pages/runs";
import { ThemeToggle } from "../features/toggle-theme";
import { Header } from "../shared/ui/header/Header";
import styles from "./App.module.css";

export function App() {
  return (
    <>
      <Header>
        <span className={styles.brand}>runforge</span>
        <ThemeToggle />
      </Header>
      <main className={styles.page}>
        <RunsPanel />
      </main>
    </>
  );
}
