import type { Branch, Channel, Company, Employee, NodeKind, TreeNode } from "./types";

export const childrenOf = (node: TreeNode, kind: NodeKind): TreeNode[] => {
  if (kind === "company") {
    return (node as Company).branches ?? [];
  }
  if (kind === "branch") {
    return (node as Branch).employees ?? [];
  }
  if (kind === "employee") {
    return (node as Employee).channels ?? [];
  }
  return [];
};

export const hasChildren = (node: TreeNode, kind: NodeKind): boolean =>
  childrenOf(node, kind).length > 0;

export const childKind = (kind: NodeKind): NodeKind | null => {
  if (kind === "company") return "branch";
  if (kind === "branch") return "employee";
  if (kind === "employee") return "channel";
  return null;
};

export const collectChannels = (company: Company): Channel[] => {
  const channels: Channel[] = [];
  for (const branch of company.branches ?? []) {
    for (const employee of branch.employees ?? []) {
      channels.push(...(employee.channels ?? []));
    }
  }
  return channels;
};
