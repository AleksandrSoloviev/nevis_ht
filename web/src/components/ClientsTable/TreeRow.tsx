import type { MouseEvent } from "react";
import { childrenOf, hasChildren } from "../../domain/children";
import { MONTHS } from "../../domain/months";
import type { NodeKind, TreeNode } from "../../domain/types";
import { InitialsAvatar } from "./InitialsAvatar";
import styles from "./TreeRow.module.css";

type TreeRowProps = {
  node: TreeNode;
  kind: NodeKind;
  level: number;
  expanded: boolean;
  hovered: boolean;
  tableId: string;
  onToggle: (node: TreeNode, kind: NodeKind) => void;
  onHover: (id: string | null) => void;
};

const formatValue = (value: number): string => value.toLocaleString();

export const TreeRow = ({
  node,
  kind,
  level,
  expanded,
  hovered,
  tableId,
  onToggle,
  onHover,
}: TreeRowProps) => {
  const expandable = hasChildren(node, kind);
  const rowId = `${tableId}-${node.id}`;
  const childIds = expandable
    ? childrenOf(node, kind)
        .map((child) => `${tableId}-${child.id}`)
        .join(" ")
    : "";

  const handleToggle = () => {
    if (!expandable) return;
    onToggle(node, kind);
  };

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleToggle();
  };

  return (
    <tr
      id={rowId}
      className={styles.row}
      data-expandable={expandable ? "true" : "false"}
      data-hovered={hovered ? "true" : undefined}
      data-kind={kind}
      data-node-id={node.id}
      onClick={handleToggle}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      <th className={styles.name} scope="row">
        <div className={styles.nameInner} data-level={level}>
          {expandable ? (
            <button
              type="button"
              className={styles.nameButton}
              aria-expanded={expanded}
              aria-controls={expanded && childIds ? childIds : undefined}
              aria-label={`${expanded ? "Collapse" : "Expand"} ${node.name}`}
              onClick={handleButtonClick}
            >
              <span className={styles.toggle} aria-hidden="true">
                <svg
                  className={styles.chevron}
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M6 3.5 11 8l-5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {kind === "employee" ? <InitialsAvatar name={node.name} /> : null}
              <span className={styles.label}>{node.name}</span>
            </button>
          ) : (
            <>
              <span className={styles.spacer} aria-hidden="true" />
              {kind === "employee" ? <InitialsAvatar name={node.name} /> : null}
              <span className={styles.label}>{node.name}</span>
            </>
          )}
          <span className="sr-only">{`Level ${level}`}</span>
        </div>
      </th>
      {node.values.map((value, index) => (
        <td key={MONTHS[index].index} className={styles.month}>
          {formatValue(value)}
        </td>
      ))}
    </tr>
  );
};
