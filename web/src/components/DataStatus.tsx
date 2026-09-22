import type { ReactNode } from "react";
import styles from "./DataStatus.module.css";

type DataStatusProps = {
  status: "loading" | "error" | "loaded";
  onRetry: () => void;
  children: ReactNode;
};

export const DataStatus = ({ status, onRetry, children }: DataStatusProps) => {
  if (status === "loading") {
    return (
      <p className={styles.status} role="status">
        Loading book of business
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.error} role="alert">
        <p className={styles.errorText}>Could not load book of business</p>
        <button type="button" className={styles.retry} onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  return children;
};
