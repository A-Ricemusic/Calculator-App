import { describe, expect, it } from "vitest";

import { initialGraphViewport, zoomViewport } from "./graphViewport";

describe("graphViewport", () => {
  it("zooms around the current center", () => {
    const zoomed = zoomViewport(initialGraphViewport, 0.5);

    expect((zoomed.xMin + zoomed.xMax) / 2).toBe(0);
    expect((zoomed.yMin + zoomed.yMax) / 2).toBe(0);
    expect(zoomed.xMax - zoomed.xMin).toBe(10);
    expect(zoomed.yMax - zoomed.yMin).toBe(7);
  });

  it("preserves non-zero centers", () => {
    const zoomed = zoomViewport({ xMin: 10, xMax: 30, yMin: -5, yMax: 15 }, 1.25);

    expect((zoomed.xMin + zoomed.xMax) / 2).toBe(20);
    expect((zoomed.yMin + zoomed.yMax) / 2).toBe(5);
    expect(zoomed.xMin).toBeLessThan(zoomed.xMax);
    expect(zoomed.yMin).toBeLessThan(zoomed.yMax);
  });
});
