import { render, screen } from "@testing-library/react";
import App from "../App";
import { stubCompanyFetch } from "./mock-fetch";

describe("company fetch on mount", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests GET /api/company when the page mounts", async () => {
    const fetchMock = stubCompanyFetch();
    render(<App />);
    expect(fetchMock).toHaveBeenCalled();
    const calledWith = fetchMock.mock.calls[0]?.[0];
    expect(String(calledWith)).toContain("/api/company");
    expect(await screen.findByText("Branch 1")).toBeInTheDocument();
  });
});
