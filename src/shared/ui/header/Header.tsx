import type { ReactNode } from "react";
import styles from "./Header.module.css";

export function Header({ children }: { children: ReactNode }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>{children}</div>
    </header>
  );
}
