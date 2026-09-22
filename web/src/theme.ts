export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "nevis-theme";

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark";

const themeStorage = (): Storage => window.localStorage;

export const readTheme = (): Theme => {
  const stored = themeStorage().getItem(THEME_STORAGE_KEY);
  if (isTheme(stored)) return stored;
  return "light";
};

export const applyTheme = (theme: Theme): void => {
  themeStorage().setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.dataset.theme = theme;
};
