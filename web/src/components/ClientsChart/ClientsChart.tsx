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

export const ClientsChart = ({ company }: ClientsChartProps) => {
  const series = buildChartSeries(company);
  const data = chartPoints(series);

  return (
    <div className={styles.wrap}>
      <div className={styles.chartScroll}>
        <div className={styles.chart}>
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
                dataKey="placeholder"
                name={SERIES_LABELS.placeholder}
                stackId="clients"
                fill={CHART_FILLS.placeholder}
                maxBarSize={28}
                isAnimationActive={false}
              />
              <Bar
                dataKey="existingClients"
                name={SERIES_LABELS.existingClients}
                stackId="clients"
                fill={CHART_FILLS.existingClients}
                maxBarSize={28}
                isAnimationActive={false}
              />
              <Bar
                dataKey="newOrganic"
                name={SERIES_LABELS.newOrganic}
                stackId="clients"
                fill={CHART_FILLS.newOrganic}
                maxBarSize={28}
                isAnimationActive={false}
              />
              <Bar
                dataKey="newPaid"
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
