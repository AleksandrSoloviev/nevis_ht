import type { Company } from "../domain/types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isValues = (value: unknown): value is number[] =>
  Array.isArray(value) &&
  value.length === 12 &&
  value.every((item) => typeof item === "number" && Number.isFinite(item));

const isNode = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string" || value.id.length === 0) return false;
  if (typeof value.name !== "string" || value.name.length === 0) return false;
  if (!isValues(value.values)) return false;
  const nested = [value.branches, value.employees, value.channels];
  for (const list of nested) {
    if (list === undefined) continue;
    if (!Array.isArray(list) || !list.every(isNode)) return false;
  }
  return true;
};

export const parseCompany = (value: unknown): Company | null => {
  if (!isNode(value)) return null;
  return value as Company;
};

export const fetchCompany = async (): Promise<Company> => {
  const response = await fetch("/api/company");
  if (!response.ok) {
    throw new Error("Company request failed");
  }
  const data: unknown = await response.json();
  const company = parseCompany(data);
  if (!company) {
    throw new Error("Company payload invalid");
  }
  return company;
};
