import { useId, useState } from "react";
import { visibleRows } from "../../domain/expansion";
import { MONTHS } from "../../domain/months";
import type { Company, NodeKind, TreeNode } from "../../domain/types";
import styles from "./ClientsTable.module.css";
import { TreeRow } from "./TreeRow";

type ClientsTableProps = {
  company: Company;
  expandedIds: ReadonlySet<string>;
  onToggle: (node: TreeNode, kind: NodeKind) => void;
};

export const ClientsTable = ({
  company,
  expandedIds,
  onToggle,
}: ClientsTableProps) => {
  const tableId = useId();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const rows = visibleRows(company, expandedIds);

  return (
    <div className={styles.scroller}>
      <div className={styles.scrollerInner}>
      <table className={styles.table}>
        <caption className="sr-only">Book of business</caption>
        <thead>
          <tr>
            <th className={styles.headName} scope="col">
              Name
            </th>
            {MONTHS.map((month) => (
              <th key={month.index} className={styles.headMonth} scope="col">
                <span aria-hidden="true">{month.visual}</span>
                <span className="sr-only">{month.accessible}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TreeRow
              key={row.node.id}
              node={row.node}
              kind={row.kind}
              level={row.level}
              expanded={expandedIds.has(row.node.id)}
              hovered={hoveredId === row.node.id}
              tableId={tableId}
              onToggle={onToggle}
              onHover={setHoveredId}
            />
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};
