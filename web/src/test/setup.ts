import { cloneElement, isValidElement, type ReactElement } from "react";
import "@testing-library/jest-dom/vitest";

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverStub;

vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: unknown }) => {
      if (!isValidElement(children)) return children;
      return cloneElement(
        children as ReactElement<{ width: number; height: number }>,
        { width: 800, height: 280 },
      );
    },
  };
});
