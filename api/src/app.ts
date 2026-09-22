import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const dataPath = join(dirname(fileURLToPath(import.meta.url)), "data/company.json");

export const createApp = () => {
  const app = express();

  app.get("/api/company", (_req, res) => {
    try {
      const body = readFileSync(dataPath, "utf8");
      res.type("application/json").send(body);
    } catch {
      res.status(500).json({ error: "Failed to read company payload" });
    }
  });

  return app;
};
