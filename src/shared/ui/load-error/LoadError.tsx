import { LoadErrorIllustration, RetryIcon } from "./LoadErrorIcons";
import styles from "./LoadError.module.css";

type LoadErrorProps = {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
};

export function LoadError({ title, description, retryLabel, onRetry }: LoadErrorProps) {
  return (
    <div className={styles.error} role="alert">
      <LoadErrorIllustration />
      <h2>{title}</h2>
      <p>{description}</p>
      <button type="button" onClick={onRetry}>
        <RetryIcon />
        {retryLabel}
      </button>
    </div>
  );
}
