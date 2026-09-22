import { render, screen, within } from "@testing-library/react";
import { ClientsChart } from "../components/ClientsChart/ClientsChart";
import { companyFixture } from "./mock-fetch";

describe("chart accessible table", () => {
  it("exposes a visually hidden 12 by 4 data table", () => {
    render(<ClientsChart company={companyFixture} />);
    const table = screen.getByRole("table", { name: "Clients by source" });
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(13);
    const headerCells = within(rows[0]).getAllByRole("columnheader");
    expect(headerCells).toHaveLength(5);
    expect(headerCells.map((cell) => cell.textContent)).toEqual([
      "Month",
      "Placeholder",
      "Existing clients",
      "New organic",
      "New paid",
    ]);
    const february = within(rows[1]).getAllByRole("cell");
    expect(february).toHaveLength(4);
    expect(february.map((cell) => cell.textContent)).toEqual(["225", "25", "0", "0"]);
  });
});
