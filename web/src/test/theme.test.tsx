import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { stubCompanyFetch } from "./mock-fetch";

const STORAGE_KEY = "nevis-theme";

const clearTheme = () => {
  window.localStorage.removeItem(STORAGE_KEY);
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themeTransition;
};

const themeSwitch = () => screen.getByRole("switch", { name: "Dark theme" });

describe("theme switch", () => {
  beforeEach(() => {
    clearTheme();
    stubCompanyFetch();
  });

  afterEach(() => {
    clearTheme();
    vi.unstubAllGlobals();
  });

  it("starts light when nothing is stored", async () => {
    render(<App />);
    expect(await screen.findByRole("table", { name: "Book of business" })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(themeSwitch()).toHaveAttribute("aria-checked", "false");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("switches to dark and back to light", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(themeSwitch());
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");
    expect(themeSwitch()).toHaveAttribute("aria-checked", "true");

    await user.click(themeSwitch());
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("light");
    expect(themeSwitch()).toHaveAttribute("aria-checked", "false");
  });

  it("restores a saved dark theme", async () => {
    window.localStorage.setItem(STORAGE_KEY, "dark");
    render(<App />);
    expect(await screen.findByRole("table", { name: "Book of business" })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(themeSwitch()).toHaveAttribute("aria-checked", "true");
  });

  it("keeps an unknown stored value until the user switches", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(STORAGE_KEY, "sepia");
    render(<App />);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(themeSwitch()).toHaveAttribute("aria-checked", "false");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("sepia");

    await user.click(themeSwitch());
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });
});
