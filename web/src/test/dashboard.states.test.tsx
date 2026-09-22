import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { companyFixture, okCompanyResponse } from "./mock-fetch";

describe("loading and error states", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps chrome visible while loading and does not show table numbers", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => {})),
    );
    render(<App />);
    expect(screen.getByRole("heading", { name: "Clients" })).toBeInTheDocument();
    expect(screen.getAllByAltText("Nevis")).toHaveLength(2);
    expect(screen.queryByText("Take-home task")).not.toBeInTheDocument();
    expect(screen.queryByText("Web Engineer")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Loading book of business");
    expect(screen.queryByText("Branch 1")).not.toBeInTheDocument();
    expect(screen.queryByText("250")).not.toBeInTheDocument();
  });

  it("shows Retry on error and returns to loading then data", async () => {
    const user = userEvent.setup();
    let attempt = 0;
    let release: ((value: Response) => void) | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        attempt += 1;
        if (attempt === 1) {
          return Promise.resolve(new Response(null, { status: 500 }));
        }
        return new Promise<Response>((resolve) => {
          release = resolve;
        });
      }),
    );

    render(<App />);
    const retry = await screen.findByRole("button", { name: "Retry" });
    expect(screen.getByRole("heading", { name: "Clients" })).toBeInTheDocument();
    expect(screen.getAllByAltText("Nevis")).toHaveLength(2);
    expect(screen.queryByText("Take-home task")).not.toBeInTheDocument();
    expect(screen.queryByRole("table", { name: "Book of business" })).not.toBeInTheDocument();

    await user.click(retry);
    expect(screen.getByRole("status")).toHaveTextContent("Loading book of business");
    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();

    release?.(okCompanyResponse());
    expect(await screen.findByText("Branch 1")).toBeInTheDocument();
    expect(screen.getByText(companyFixture.name)).toBeInTheDocument();
  });
});
