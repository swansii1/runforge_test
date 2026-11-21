import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import styles from "./ModalDialog.module.css";

type ModalDialogProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

function isBackdropEvent(event: MouseEvent<HTMLDialogElement>) {
  if (event.target !== event.currentTarget) return false;
  const { left, right, top, bottom } =
    event.currentTarget.getBoundingClientRect();
  return (
    event.clientX < left ||
    event.clientX >= right ||
    event.clientY < top ||
    event.clientY >= bottom
  );
}

export function ModalDialog({ title, onClose, children }: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onPointerDown={(event) => {
        pressedBackdrop.current = isBackdropEvent(event);
      }}
      onClick={(event) => {
        if (pressedBackdrop.current && isBackdropEvent(event))
          event.currentTarget.close();
        pressedBackdrop.current = false;
      }}
    >
      <header className={styles.header}>
        <h2 id={titleId}>{title}</h2>
        <form method="dialog">
          <button type="submit">Close</button>
        </form>
      </header>
      {children}
    </dialog>
  );
}
