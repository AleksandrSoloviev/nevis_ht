import { collectChannels } from "./children";
import { MONTHS } from "./months";
import type { Company } from "./types";

export const SERIES_KEYS = [
  "placeholder",
  "existingClients",
  "newOrganic",
  "newPaid",
] as const;

export type SeriesKey = (typeof SERIES_KEYS)[number];

export const SERIES_LABELS: Record<SeriesKey, string> = {
  placeholder: "Placeholder",
  existingClients: "Existing clients",
  newOrganic: "New organic",
  newPaid: "New paid",
};

export type ChartSeries = Record<SeriesKey, number[]>;

export type ChartPoint = {
  month: string;
  monthAccessible: string;
} & Record<SeriesKey, number>;

const CHANNEL_TO_SERIES: Record<string, SeriesKey> = {
  "Existing clients": "existingClients",
  "New organic": "newOrganic",
  "New paid": "newPaid",
};

export const buildChartSeries = (company: Company): ChartSeries => {
  const existingClients = Array.from({ length: 12 }, () => 0);
  const newOrganic = Array.from({ length: 12 }, () => 0);
  const newPaid = Array.from({ length: 12 }, () => 0);

  for (const channel of collectChannels(company)) {
    const key = CHANNEL_TO_SERIES[channel.name];
    if (!key) continue;
    const target =
      key === "existingClients"
        ? existingClients
        : key === "newOrganic"
          ? newOrganic
          : newPaid;
    for (let i = 0; i < 12; i += 1) {
      target[i] += channel.values[i] ?? 0;
    }
  }

  const placeholder = company.values.map((total, i) =>
    Math.max(0, total - existingClients[i] - newOrganic[i] - newPaid[i]),
  );

  return { placeholder, existingClients, newOrganic, newPaid };
};

export const chartPoints = (series: ChartSeries): ChartPoint[] =>
  MONTHS.map((month) => ({
    month: month.visual,
    monthAccessible: month.accessible,
    placeholder: series.placeholder[month.index],
    existingClients: series.existingClients[month.index],
    newOrganic: series.newOrganic[month.index],
    newPaid: series.newPaid[month.index],
  }));
