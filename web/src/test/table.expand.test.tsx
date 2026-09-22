import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { stubCompanyFetch } from "./mock-fetch";

describe("table expansion", () => {
  beforeEach(() => {
    stubCompanyFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("expands Branch 1 and Anna, leaves Branch 2 without a control, and collapses Company", async () => {
    const user = userEvent.setup();
    render(<App />);
    const table = await screen.findByRole("table", { name: "Book of business" });

    await user.click(screen.getByRole("button", { name: "Expand Branch 1" }));
    expect(within(table).getByText("Anna Blackwood")).toBeInTheDocument();
    expect(within(table).getByText("James Walker")).toBeInTheDocument();
    expect(within(table).getByText("Maria Gutierrez")).toBeInTheDocument();
    expect(within(table).getByText("Robert Chen")).toBeInTheDocument();
    expect(within(table).getByText("Sarah Smith")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Expand Anna Blackwood" }));
    expect(within(table).getByText("Existing clients")).toBeInTheDocument();
    expect(within(table).getByText("New organic")).toBeInTheDocument();
    expect(within(table).getByText("New paid")).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: /Branch 2/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Branch 3/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /James Walker/ })).not.toBeInTheDocument();

    const placeholderBefore = screen.getByRole("table", { name: "Clients by source" });
    const febPlaceholder = within(placeholderBefore).getAllByRole("row")[1];
    const chartSnapshot = febPlaceholder.textContent;

    await user.click(screen.getByRole("button", { name: "Collapse Company" }));
    expect(within(table).queryByText("Branch 1")).not.toBeInTheDocument();
    expect(within(table).getByText("Company")).toBeInTheDocument();
    expect(within(table).getAllByRole("row")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Expand Company" }));
    expect(within(table).getByText("Branch 1")).toBeInTheDocument();
    expect(within(table).queryByText("Anna Blackwood")).not.toBeInTheDocument();
    expect(
      within(screen.getByRole("table", { name: "Clients by source" })).getAllByRole(
        "row",
      )[1].textContent,
    ).toBe(chartSnapshot);
  });
});
