import { useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  SERIES_LABELS,
  buildChartSeries,
  chartPoints,
  type ChartPoint,
  type SeriesKey,
} from "../../domain/chart-series";
import type { Company } from "../../domain/types";
import { CHART_FILLS } from "../../styles/chart-fills";
import { ChartA11yTable } from "./ChartA11yTable";
import { ChartTooltip } from "./ChartTooltip";
import styles from "./ClientsChart.module.css";

const LEGEND_ORDER = [
  "existingClients",
  "newOrganic",
  "newPaid",
  "placeholder",
] as const satisfies readonly SeriesKey[];

type ClientsChartProps = {
  company: Company;
};

const Y_TICKS = [0, 50, 100, 150, 200, 250, 300, 350, 400];

const bodyPaint = (point: ChartPoint): number =>
  point.placeholderPaint + point.existingClientsPaint;

export const ClientsChart = ({ company }: ClientsChartProps) => {
  const series = buildChartSeries(company);
  const data = chartPoints(series);
  const [keyboardIndex, setKeyboardIndex] = useState<number | null>(null);
  const pointerFocus = useRef(false);
  const lastMonth = data.length - 1;

  const handlePointerDown = () => {
    pointerFocus.current = true;
  };

  const handleFocus = () => {
    if (pointerFocus.current) {
      pointerFocus.current = false;
      return;
    }
    setKeyboardIndex((current) => current ?? 0);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setKeyboardIndex(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      if (keyboardIndex === null) return;
      event.preventDefault();
      setKeyboardIndex(null);
      return;
    }
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    setKeyboardIndex((current) => {
      if (event.key === "Home") return 0;
      if (event.key === "End") return lastMonth;
      if (current === null) return 0;
      if (event.key === "ArrowRight") return Math.min(lastMonth, current + 1);
      return Math.max(0, current - 1);
    });
  };

  const keyboardPoint = keyboardIndex === null ? null : data[keyboardIndex];

  return (
    <div className={styles.wrap}>
      <div
        className={styles.chartControl}
        tabIndex={0}
        role="group"
        aria-label="Clients by source"
        aria-keyshortcuts="ArrowLeft ArrowRight Escape"
        onPointerDown={handlePointerDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        <span className="sr-only">
          Use Left and Right arrow keys to read each month. Escape closes the values.
        </span>
        <div className={styles.chartScroll}>
          <div className={styles.chart}>
            <div className={styles.chartGraphic} aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  accessibilityLayer={false}
                  margin={{ top: 12, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid vertical={false} stroke="var(--color-chart-grid)" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tickMargin={8}
                  />
                  <YAxis
                    domain={[0, 400]}
                    ticks={Y_TICKS}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    tickMargin={8}
                  />
                  <Tooltip cursor={false} content={<ChartTooltip />} />
                  <Bar
                    dataKey={bodyPaint}
                    name={SERIES_LABELS.placeholder}
                    stackId="clients"
                    fill={CHART_FILLS.placeholder}
                    maxBarSize={28}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="newOrganicPaint"
                    name={SERIES_LABELS.newOrganic}
                    stackId="clients"
                    fill={CHART_FILLS.newOrganic}
                    maxBarSize={28}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="newPaidPaint"
                    name={SERIES_LABELS.newPaid}
                    stackId="clients"
                    fill={CHART_FILLS.newPaid}
                    maxBarSize={28}
                    radius={[2, 2, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {keyboardPoint ? (
        <div className={styles.keyboardTooltip} aria-live="polite">
          <ChartTooltip active payload={[{ payload: keyboardPoint }]} />
        </div>
      ) : null}
      <ul className={styles.legend}>
        {LEGEND_ORDER.map((key) => (
          <li key={key} className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles[key]}`} />
            {SERIES_LABELS[key]}
          </li>
        ))}
      </ul>
      <div className="sr-only">
        <ChartA11yTable series={series} />
      </div>
    </div>
  );
};
