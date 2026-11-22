import { useLayoutEffect, useRef, useState } from "react";
import listStyles from "./RunList.module.css";
import styles from "./LoadingRows.module.css";

export function LoadingRows() {
  const firstRowRef = useRef<HTMLLIElement>(null);
  const [rowCount, setRowCount] = useState(1);

  useLayoutEffect(() => {
    const row = firstRowRef.current;
    if (!row) return;
    const viewport = window.visualViewport;

    const updateRowCount = () => {
      const { top, height } = row.getBoundingClientRect();
      if (height === 0) return;
      const viewportBottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
      const list = row.parentElement;
      const gap = list ? parseFloat(getComputedStyle(list).rowGap) || 0 : 0;
      setRowCount(Math.max(1, Math.ceil((viewportBottom - top + gap) / (height + gap))));
    };

    updateRowCount();
    window.addEventListener("resize", updateRowCount);
    viewport?.addEventListener("resize", updateRowCount);
    return () => {
      window.removeEventListener("resize", updateRowCount);
      viewport?.removeEventListener("resize", updateRowCount);
    };
  }, []);

  return (
    <>
      <p role="status" className={styles.loadingMessage}>
        Loading runs…
      </p>
      <ul className={listStyles.list} aria-hidden="true" inert>
        {Array.from({ length: rowCount }, (_, index) => (
          <li key={index} ref={index === 0 ? firstRowRef : undefined} className={listStyles.row}>
            <span className={styles.name} />
            <span className={styles.repository} />
            <span className={styles.status} />
            <div className={listStyles.metadata}>
              <div className={listStyles.created}>
                <span className={listStyles.label}>Created</span>
                <span className={styles.date} />
              </div>
              <div className={listStyles.duration}>
                <span className={listStyles.label}>Duration</span>
                <span className={styles.duration} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
