import { fireEvent, render, screen } from "@testing-library/react";
import { ChartTooltip } from "../components/ClientsChart/ChartTooltip";
import { ClientsChart } from "../components/ClientsChart/ClientsChart";
import type { ChartPoint } from "../domain/chart-series";
import { companyFixture } from "./mock-fetch";

const februaryPoint: ChartPoint = {
  month: "Feb 24",
  monthAccessible: "Feb 2024",
  placeholder: 225,
  existingClients: 25,
  newOrganic: 0,
  newPaid: 0,
};

describe("chart tooltip", () => {
  it("lists the month and all four series including zeros", () => {
    render(
      <ChartTooltip
        active
        label="Feb 24"
        payload={[
          {
            dataKey: "placeholder",
            value: 225,
            payload: februaryPoint,
          },
        ]}
      />,
    );

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Feb 2024");
    expect(tooltip).toHaveTextContent("Placeholder");
    expect(tooltip).toHaveTextContent("225");
    expect(tooltip).toHaveTextContent("Existing clients");
    expect(tooltip).toHaveTextContent("25");
    expect(tooltip).toHaveTextContent("New organic");
    expect(tooltip).toHaveTextContent("New paid");
    expect(tooltip).toHaveTextContent("0");
  });

  it("hides when inactive", () => {
    const { rerender } = render(
      <ChartTooltip active payload={[{ payload: februaryPoint }]} />,
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    rerender(<ChartTooltip active={false} payload={[{ payload: februaryPoint }]} />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows and hides the tooltip when hovering a stacked bar", async () => {
    render(<ClientsChart company={companyFixture} />);

    const bars = document.querySelectorAll(".recharts-rectangle");
    expect(bars.length).toBeGreaterThan(0);
    fireEvent.mouseOver(bars[0], { clientX: 80, clientY: 120 });
    fireEvent.mouseMove(bars[0], { clientX: 80, clientY: 120 });
    expect(await screen.findByRole("tooltip", { hidden: true })).toHaveTextContent(
      "Placeholder",
    );
    fireEvent.mouseLeave(bars[0]);
    expect(screen.queryByRole("tooltip", { hidden: true })).not.toBeInTheDocument();
  });
});
