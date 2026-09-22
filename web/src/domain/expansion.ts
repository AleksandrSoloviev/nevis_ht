import { childKind, childrenOf, hasChildren } from "./children";
import type { Company, NodeKind, TreeNode } from "./types";

export type VisibleRow = {
  node: TreeNode;
  kind: NodeKind;
  level: number;
};

const descendantIds = (node: TreeNode, kind: NodeKind): string[] => {
  const ids: string[] = [];
  const nextKind = childKind(kind);
  if (!nextKind) return ids;
  for (const child of childrenOf(node, kind)) {
    ids.push(child.id, ...descendantIds(child, nextKind));
  }
  return ids;
};

export const toggleExpand = (
  expandedIds: ReadonlySet<string>,
  node: TreeNode,
  kind: NodeKind,
): Set<string> => {
  const next = new Set(expandedIds);
  if (!hasChildren(node, kind)) return next;
  if (next.has(node.id)) {
    next.delete(node.id);
    for (const id of descendantIds(node, kind)) {
      next.delete(id);
    }
    return next;
  }
  next.add(node.id);
  return next;
};

export const visibleRows = (
  company: Company,
  expandedIds: ReadonlySet<string>,
): VisibleRow[] => {
  const rows: VisibleRow[] = [];

  const walk = (node: TreeNode, kind: NodeKind, level: number) => {
    rows.push({ node, kind, level });
    if (!expandedIds.has(node.id)) return;
    const nextKind = childKind(kind);
    if (!nextKind) return;
    for (const child of childrenOf(node, kind)) {
      walk(child, nextKind, level + 1);
    }
  };

  walk(company, "company", 1);
  return rows;
};
