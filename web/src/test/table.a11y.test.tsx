import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { stubCompanyFetch } from "./mock-fetch";

describe("table keyboard and aria", () => {
  beforeEach(() => {
    stubCompanyFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("toggles with Enter and Space and exposes aria-expanded and level text", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("table", { name: "Book of business" });

    const companyButton = screen.getByRole("button", { name: "Collapse Company" });
    expect(companyButton).toHaveAttribute("aria-expanded", "true");
    const companyRow = companyButton.closest("tr");
    expect(companyRow).not.toHaveAttribute("aria-level");
    expect(within(companyRow as HTMLElement).getByText("Level 1")).toBeInTheDocument();

    const branchButton = screen.getByRole("button", { name: "Expand Branch 1" });
    expect(branchButton).toHaveAttribute("aria-expanded", "false");
    const branchRow = branchButton.closest("tr");
    expect(branchRow).not.toHaveAttribute("aria-level");
    expect(within(branchRow as HTMLElement).getByText("Level 2")).toBeInTheDocument();

    branchButton.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Collapse Branch 1" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    const annaButton = screen.getByRole("button", { name: "Expand Anna Blackwood" });
    annaButton.focus();
    await user.keyboard(" ");
    expect(screen.getByRole("button", { name: "Collapse Anna Blackwood" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    const table = screen.getByRole("table", { name: "Book of business" });
    const channelRow = within(table).getByText("Existing clients").closest("tr");
    expect(channelRow).not.toHaveAttribute("aria-level");
    expect(within(channelRow as HTMLElement).getByText("Level 4")).toBeInTheDocument();
    expect(within(channelRow as HTMLElement).queryByRole("button")).not.toBeInTheDocument();

    const employeeRow = screen.getByText("James Walker").closest("tr");
    expect(employeeRow).not.toHaveAttribute("aria-level");
    expect(within(employeeRow as HTMLElement).getByText("Level 3")).toBeInTheDocument();
  });
});
