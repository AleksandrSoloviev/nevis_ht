import { useEffect, useState } from "react";
import { fetchCompany } from "./api/fetchCompany";
import logo from "./assets/nevis-logo.svg";
import { ClientsChart } from "./components/ClientsChart/ClientsChart";
import { ClientsTable } from "./components/ClientsTable/ClientsTable";
import { DataStatus } from "./components/DataStatus";
import { Footer } from "./components/Footer";
import { toggleExpand } from "./domain/expansion";
import type { Company, NodeKind, TreeNode } from "./domain/types";
import { applyTheme, readTheme, type Theme } from "./theme";
import styles from "./styles/App.module.css";

type BodyState =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "loaded";
      company: Company;
      expandedIds: Set<string>;
    };

const ThemeSun = () => (
  <svg className={styles.themeSun} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ThemeMoon = () => (
  <svg className={styles.themeMoon} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
  </svg>
);

const App = () => {
  const [requestId, setRequestId] = useState(0);
  const [state, setState] = useState<BodyState>({ status: "loading" });
  const [theme, setTheme] = useState<Theme>(readTheme);
  const darkThemeOn = theme === "dark";

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetchCompany()
      .then((company) => {
        if (cancelled) return;
        setState({
          status: "loaded",
          company,
          expandedIds: new Set([company.id]),
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.documentElement.dataset.themeTransition = "on";
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleRetry = () => {
    setRequestId((current) => current + 1);
  };

  const handleThemeClick = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
  };

  const handleToggle = (node: TreeNode, kind: NodeKind) => {
    setState((current) => {
      if (current.status !== "loaded") return current;
      return {
        ...current,
        expandedIds: toggleExpand(current.expandedIds, node, kind),
      };
    });
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <img className={styles.wordmark} src={logo} alt="Nevis" />
        </div>
        <button
          type="button"
          className={styles.themeSwitch}
          role="switch"
          aria-checked={darkThemeOn}
          aria-label="Dark theme"
          onClick={handleThemeClick}
        >
          <span className={styles.themeTrack} aria-hidden="true">
            <span className={styles.themeThumb}>
              <ThemeSun />
              <ThemeMoon />
            </span>
          </span>
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Clients</h1>
        <div className={styles.frame}>
          <DataStatus status={state.status} onRetry={handleRetry}>
            {state.status === "loaded" ? (
              <div className={styles.stack}>
                <ClientsChart company={state.company} />
                <ClientsTable
                  company={state.company}
                  expandedIds={state.expandedIds}
                  onToggle={handleToggle}
                />
              </div>
            ) : null}
          </DataStatus>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
