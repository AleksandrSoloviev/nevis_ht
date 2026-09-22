import type { SeriesKey } from "../domain/chart-series";

export const CHART_FILLS: Record<SeriesKey, string> = {
  placeholder: "var(--color-chart-placeholder)",
  existingClients: "var(--color-chart-existing)",
  newOrganic: "var(--color-chart-organic)",
  newPaid: "var(--color-chart-paid)",
};
