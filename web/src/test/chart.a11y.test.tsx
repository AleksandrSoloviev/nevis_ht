import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("hides the drawn chart from assistive tech and reads months from the keyboard", async () => {
    const user = userEvent.setup();
    render(<ClientsChart company={companyFixture} />);

    const surface = document.querySelector(".recharts-surface");
    expect(surface?.closest("[aria-hidden='true']")).not.toBeNull();

    await user.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Feb 2024");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tooltip")).toHaveTextContent("Mar 2024");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
