import { describe, expect, it } from "vitest";

import {
  initialGraphViewport,
  panViewport,
  zoomViewport,
  zoomViewportAtScreenPoint,
} from "./graphViewport";

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

  it("pans by screen distance", () => {
    const panned = panViewport(initialGraphViewport, 100, 50, 400, 280);

    expect(panned.xMin).toBe(-15);
    expect(panned.xMax).toBe(5);
    expect(panned.yMin).toBe(-4.5);
    expect(panned.yMax).toBe(9.5);
  });

  it("zooms around a screen point", () => {
    const zoomed = zoomViewportAtScreenPoint(initialGraphViewport, 0.5, 300, 70, 400, 280);

    expect(zoomed.xMin).toBe(-2.5);
    expect(zoomed.xMax).toBe(7.5);
    expect(zoomed.yMin).toBe(-1.75);
    expect(zoomed.yMax).toBe(5.25);
  });
});
