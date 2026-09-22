import { cloneElement, isValidElement, type ReactElement } from "react";
import "@testing-library/jest-dom/vitest";

const memoryStorage = (): Storage => {
  const memory = new Map<string, string>();
  return {
    get length() {
      return memory.size;
    },
    clear() {
      memory.clear();
    },
    getItem(key) {
      const value = memory.get(key);
      if (value === undefined) return null;
      return value;
    },
    key(index) {
      const found = [...memory.keys()][index];
      if (found === undefined) return null;
      return found;
    },
    removeItem(key) {
      memory.delete(key);
    },
    setItem(key, value) {
      memory.set(key, value);
    },
  };
};

const storageReady = (): boolean => {
  try {
    return typeof globalThis.localStorage?.getItem === "function";
  } catch {
    return false;
  }
};

if (!storageReady()) {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    writable: true,
    value: memoryStorage(),
  });
}

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
