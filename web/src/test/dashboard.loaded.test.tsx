import { render, screen, within } from "@testing-library/react";
import App from "../App";
import { MONTHS } from "../domain/months";
import { stubCompanyFetch } from "./mock-fetch";

describe("loaded dashboard", () => {
  beforeEach(() => {
    stubCompanyFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders Clients, twelve months, and Company plus three branches", async () => {
    render(<App />);

    expect(await screen.findByRole("heading", { name: "Clients" })).toBeInTheDocument();
    expect(screen.getAllByAltText("Nevis")).toHaveLength(2);
    expect(screen.queryByText("Take-home task")).not.toBeInTheDocument();
    expect(screen.queryByText("Web Engineer")).not.toBeInTheDocument();

    const table = screen.getByRole("table", { name: "Book of business" });
    expect(within(table).getByText("Company")).toBeInTheDocument();
    expect(within(table).getByText("Branch 1")).toBeInTheDocument();
    expect(within(table).getByText("Branch 2")).toBeInTheDocument();
    expect(within(table).getByText("Branch 3")).toBeInTheDocument();
    expect(within(table).queryByText("Anna Blackwood")).not.toBeInTheDocument();

    for (const month of MONTHS) {
      expect(within(table).getByText(month.visual)).toBeInTheDocument();
    }

    expect(within(table).getAllByRole("row")).toHaveLength(5);
    expect(screen.getAllByText("Placeholder").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Existing clients").length).toBeGreaterThan(0);
  });
});
