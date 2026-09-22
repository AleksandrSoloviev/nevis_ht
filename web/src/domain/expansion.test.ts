import { toggleExpand, visibleRows } from "./expansion";
import { companyFixture } from "../test/mock-fetch";

const companyId = companyFixture.id;
const branch1 = companyFixture.branches?.[0];
const branch2 = companyFixture.branches?.[1];
const anna = branch1?.employees?.[0];

describe("visibleRows and toggleExpand", () => {
  it("starts with Company and three branches when Company is expanded", () => {
    const rows = visibleRows(companyFixture, new Set([companyId]));
    expect(rows.map((row) => row.node.name)).toEqual([
      "Company",
      "Branch 1",
      "Branch 2",
      "Branch 3",
    ]);
    expect(rows[0].level).toBe(1);
    expect(rows[1].level).toBe(2);
  });

  it("reveals five advisors under Branch 1", () => {
    if (!branch1) throw new Error("missing Branch 1");
    const expanded = toggleExpand(new Set([companyId]), branch1, "branch");
    const names = visibleRows(companyFixture, expanded).map((row) => row.node.name);
    expect(names).toEqual([
      "Company",
      "Branch 1",
      "Anna Blackwood",
      "James Walker",
      "Maria Gutierrez",
      "Robert Chen",
      "Sarah Smith",
      "Branch 2",
      "Branch 3",
    ]);
  });

  it("reveals three channels under Anna", () => {
    if (!branch1 || !anna) throw new Error("missing Anna");
    const withBranch = toggleExpand(new Set([companyId]), branch1, "branch");
    const withAnna = toggleExpand(withBranch, anna, "employee");
    const names = visibleRows(companyFixture, withAnna).map((row) => row.node.name);
    expect(names).toContain("Existing clients");
    expect(names).toContain("New organic");
    expect(names).toContain("New paid");
    expect(names.filter((name) => name === "Existing clients")).toHaveLength(1);
  });

  it("clears descendants when Company collapses (A-4)", () => {
    if (!branch1 || !anna) throw new Error("missing tree");
    const withBranch = toggleExpand(new Set([companyId]), branch1, "branch");
    const withAnna = toggleExpand(withBranch, anna, "employee");
    const collapsed = toggleExpand(withAnna, companyFixture, "company");
    expect([...collapsed]).toEqual([]);
    expect(visibleRows(companyFixture, collapsed).map((row) => row.node.name)).toEqual([
      "Company",
    ]);

    const reopened = toggleExpand(collapsed, companyFixture, "company");
    expect(visibleRows(companyFixture, reopened).map((row) => row.node.name)).toEqual([
      "Company",
      "Branch 1",
      "Branch 2",
      "Branch 3",
    ]);
  });

  it("does not expand Branch 2 because it has no employees", () => {
    if (!branch2) throw new Error("missing Branch 2");
    const expanded = toggleExpand(new Set([companyId]), branch2, "branch");
    expect(expanded.has(branch2.id)).toBe(false);
  });
});
