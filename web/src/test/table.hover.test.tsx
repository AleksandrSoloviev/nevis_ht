import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { stubCompanyFetch } from "./mock-fetch";

describe("table row hover", () => {
  beforeEach(() => {
    stubCompanyFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("marks a row as hovered on pointer enter and clears it on leave", async () => {
    const user = userEvent.setup();
    render(<App />);
    const branchName = await screen.findByText("Branch 1");
    const row = branchName.closest("tr");
    expect(row).not.toBeNull();
    expect(row).not.toHaveAttribute("data-hovered");

    await user.hover(row as HTMLElement);
    expect(row).toHaveAttribute("data-hovered", "true");

    await user.unhover(row as HTMLElement);
    expect(row).not.toHaveAttribute("data-hovered");
  });
});
