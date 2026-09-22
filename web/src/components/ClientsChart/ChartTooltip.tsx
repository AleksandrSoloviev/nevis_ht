import {
  SERIES_LABELS,
  type ChartPoint,
  type SeriesKey,
} from "../../domain/chart-series";
import styles from "./ClientsChart.module.css";

const TOOLTIP_ORDER = [
  "existingClients",
  "newOrganic",
  "newPaid",
  "placeholder",
] as const satisfies readonly SeriesKey[];

type TooltipEntry = {
  dataKey?: string | number;
  value?: number | string;
  payload?: ChartPoint;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
};

const valueOf = (point: ChartPoint, key: SeriesKey): number => point[key];

export const ChartTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className={styles.tooltip} role="tooltip">
      <p className={styles.tooltipTitle}>{point.monthAccessible}</p>
      {TOOLTIP_ORDER.map((key) => (
        <div key={key} className={styles.row}>
          <span className={`${styles.swatch} ${styles[key]}`} />
          <span className={styles.label}>{SERIES_LABELS[key]}</span>
          <span className={styles.value}>{valueOf(point, key)}</span>
        </div>
      ))}
    </div>
  );
};
