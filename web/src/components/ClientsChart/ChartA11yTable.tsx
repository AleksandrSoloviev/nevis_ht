import { MONTHS } from "../../domain/months";
import {
  SERIES_KEYS,
  SERIES_LABELS,
  type ChartSeries,
} from "../../domain/chart-series";

type ChartA11yTableProps = {
  series: ChartSeries;
};

export const ChartA11yTable = ({ series }: ChartA11yTableProps) => {
  return (
    <table>
      <caption>Clients by source</caption>
      <thead>
        <tr>
          <th scope="col">Month</th>
          {SERIES_KEYS.map((key) => (
            <th key={key} scope="col">
              {SERIES_LABELS[key]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {MONTHS.map((month) => (
          <tr key={month.index}>
            <th scope="row">{month.accessible}</th>
            {SERIES_KEYS.map((key) => (
              <td key={key}>{series[key][month.index]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
