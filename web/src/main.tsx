import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { readTheme } from "./theme";
import "./styles/tokens.css";
import "./styles/global.css";

document.documentElement.dataset.theme = readTheme();

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element missing");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
