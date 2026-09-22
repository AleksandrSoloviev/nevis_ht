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

  it("toggles with Enter and Space and exposes aria-expanded and aria-level", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("table", { name: "Book of business" });

    const companyButton = screen.getByRole("button", { name: "Collapse Company" });
    expect(companyButton).toHaveAttribute("aria-expanded", "true");
    expect(companyButton.closest("tr")).toHaveAttribute("aria-level", "1");

    const branchButton = screen.getByRole("button", { name: "Expand Branch 1" });
    expect(branchButton).toHaveAttribute("aria-expanded", "false");
    expect(branchButton.closest("tr")).toHaveAttribute("aria-level", "2");

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
    expect(channelRow).toHaveAttribute("aria-level", "4");
    expect(within(channelRow as HTMLElement).queryByRole("button")).not.toBeInTheDocument();

    const employeeRow = screen.getByText("James Walker").closest("tr");
    expect(employeeRow).toHaveAttribute("aria-level", "3");
  });
});
