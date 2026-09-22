import { useEffect, useState } from "react";
import { fetchCompany } from "./api/fetchCompany";
import logo from "./assets/nevis-logo.svg";
import { ClientsChart } from "./components/ClientsChart/ClientsChart";
import { ClientsTable } from "./components/ClientsTable/ClientsTable";
import { DataStatus } from "./components/DataStatus";
import { Footer } from "./components/Footer";
import { toggleExpand } from "./domain/expansion";
import type { Company, NodeKind, TreeNode } from "./domain/types";
import styles from "./styles/App.module.css";

type BodyState =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "loaded";
      company: Company;
      expandedIds: Set<string>;
    };

const App = () => {
  const [requestId, setRequestId] = useState(0);
  const [state, setState] = useState<BodyState>({ status: "loading" });

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

  const handleRetry = () => {
    setRequestId((current) => current + 1);
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
