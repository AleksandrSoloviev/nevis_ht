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

export const MIN_VISIBLE_SEGMENT = 12;

export type ChartPoint = {
  month: string;
  monthAccessible: string;
} & Record<SeriesKey, number> &
  Record<`${SeriesKey}Paint`, number>;

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

export const visibleSegmentValues = (
  values: Record<SeriesKey, number>,
  floor = MIN_VISIBLE_SEGMENT,
): Record<SeriesKey, number> => {
  const paint: Record<SeriesKey, number> = { ...values };
  let debt = 0;

  for (const key of SERIES_KEYS) {
    const value = paint[key];
    if (value > 0 && value < floor) {
      debt += floor - value;
      paint[key] = floor;
    }
  }

  const donors = SERIES_KEYS.filter((key) => values[key] >= floor).sort(
    (left, right) => paint[right] - paint[left],
  );

  for (const key of donors) {
    if (debt <= 0) break;
    const spare = Math.max(0, paint[key] - floor);
    const take = Math.min(debt, spare);
    paint[key] -= take;
    debt -= take;
  }

  if (debt > 0) {
    const lifted = SERIES_KEYS.filter(
      (key) => values[key] > 0 && values[key] < floor,
    ).sort((left, right) => paint[right] - paint[left]);

    for (const key of lifted) {
      if (debt <= 0) break;
      const giveBack = Math.min(debt, paint[key] - values[key]);
      paint[key] -= giveBack;
      debt -= giveBack;
    }
  }

  return paint;
};

export const chartPoints = (series: ChartSeries): ChartPoint[] =>
  MONTHS.map((month) => {
    const values: Record<SeriesKey, number> = {
      placeholder: series.placeholder[month.index],
      existingClients: series.existingClients[month.index],
      newOrganic: series.newOrganic[month.index],
      newPaid: series.newPaid[month.index],
    };
    const paint = visibleSegmentValues(values);

    return {
      month: month.visual,
      monthAccessible: month.accessible,
      ...values,
      placeholderPaint: paint.placeholder,
      existingClientsPaint: paint.existingClients,
      newOrganicPaint: paint.newOrganic,
      newPaidPaint: paint.newPaid,
    };
  });
