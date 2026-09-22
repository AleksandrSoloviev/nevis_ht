import { buildChartSeries } from "./chart-series";
import { companyFixture } from "../test/mock-fetch";

describe("buildChartSeries", () => {
  it("adds four series to company totals and keeps placeholder non-negative", () => {
    const series = buildChartSeries(companyFixture);

    expect(series.placeholder).toHaveLength(12);
    expect(series.existingClients).toHaveLength(12);
    expect(series.newOrganic).toHaveLength(12);
    expect(series.newPaid).toHaveLength(12);

    companyFixture.values.forEach((total, index) => {
      const sum =
        series.placeholder[index] +
        series.existingClients[index] +
        series.newOrganic[index] +
        series.newPaid[index];
      expect(sum).toBe(total);
      expect(series.placeholder[index]).toBeGreaterThanOrEqual(0);
    });
  });

  it("uses February channel values from the PDF payload", () => {
    const series = buildChartSeries(companyFixture);
    expect(series.existingClients[0]).toBe(25);
    expect(series.newOrganic[0]).toBe(0);
    expect(series.newPaid[0]).toBe(0);
    expect(series.placeholder[0]).toBe(225);
  });
});
