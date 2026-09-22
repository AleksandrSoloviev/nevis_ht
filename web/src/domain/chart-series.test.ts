import {
  buildChartSeries,
  chartPoints,
  visibleSegmentValues,
} from "./chart-series";
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

const sumSeries = (values: Record<string, number>): number =>
  Object.values(values).reduce((total, value) => total + value, 0);

describe("visibleSegmentValues", () => {
  it("keeps February zeros and large series unchanged", () => {
    const values = {
      placeholder: 225,
      existingClients: 25,
      newOrganic: 0,
      newPaid: 0,
    };

    expect(visibleSegmentValues(values)).toEqual(values);
  });

  it("lifts a single client to 12 and takes the difference from placeholder", () => {
    const values = {
      placeholder: 241,
      existingClients: 25,
      newOrganic: 1,
      newPaid: 0,
    };

    expect(visibleSegmentValues(values)).toEqual({
      placeholder: 230,
      existingClients: 25,
      newOrganic: 12,
      newPaid: 0,
    });
  });

  it("lifts organic and paid together", () => {
    const values = {
      placeholder: 256,
      existingClients: 26,
      newOrganic: 1,
      newPaid: 1,
    };

    expect(visibleSegmentValues(values)).toEqual({
      placeholder: 234,
      existingClients: 26,
      newOrganic: 12,
      newPaid: 12,
    });
    expect(sumSeries(visibleSegmentValues(values))).toBe(sumSeries(values));
  });

  it("leaves a segment already at the floor unchanged", () => {
    const values = {
      placeholder: 200,
      existingClients: 25,
      newOrganic: 12,
      newPaid: 13,
    };

    expect(visibleSegmentValues(values)).toEqual(values);
  });

  it("returns the shortfall to lifted series and keeps zeros at zero", () => {
    const values = {
      placeholder: 5,
      existingClients: 0,
      newOrganic: 1,
      newPaid: 1,
    };
    const paint = visibleSegmentValues(values);

    expect(paint.newOrganic).toBe(1);
    expect(paint.newPaid).toBe(1);
    expect(paint.existingClients).toBe(0);
    expect(sumSeries(paint)).toBe(sumSeries(values));
  });

  it("paints March and April caps on the company fixture", () => {
    const points = chartPoints(buildChartSeries(companyFixture));
    const february = points[0];
    const march = points[1];
    const april = points[2];

    expect(february.placeholderPaint).toBe(february.placeholder);
    expect(february.existingClientsPaint).toBe(february.existingClients);
    expect(february.newOrganicPaint).toBe(0);
    expect(february.newPaidPaint).toBe(0);

    expect(march.newOrganic).toBe(1);
    expect(march.newOrganicPaint).toBe(12);
    expect(march.newPaidPaint).toBe(0);
    expect(march.placeholderPaint).toBe(march.placeholder - 11);

    expect(april.newOrganicPaint).toBe(12);
    expect(april.newPaidPaint).toBe(12);
    expect(april.placeholderPaint).toBe(april.placeholder - 22);
    expect(
      april.placeholderPaint +
        april.existingClientsPaint +
        april.newOrganicPaint +
        april.newPaidPaint,
    ).toBe(
      april.placeholder +
        april.existingClients +
        april.newOrganic +
        april.newPaid,
    );
  });
});
