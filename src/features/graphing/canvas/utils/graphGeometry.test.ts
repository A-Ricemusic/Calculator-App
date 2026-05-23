import { describe, expect, it } from "vitest";

import { formatTick, makeTicks, niceStep, pointsToPath } from "./graphGeometry";

describe("graphGeometry", () => {
  it("chooses readable grid steps", () => {
    expect(niceStep(20)).toBe(2);
    expect(niceStep(70)).toBe(5);
    expect(niceStep(0.8)).toBe(0.05);
  });

  it("formats tick labels without negative zero noise", () => {
    expect(formatTick(0)).toBe("0");
    expect(formatTick(-0)).toBe("0");
    expect(formatTick(2)).toBe("2");
    expect(formatTick(2.25)).toBe("2.3");
  });

  it("builds stable ticks inside the viewport", () => {
    expect(makeTicks(-5, 5, 2)).toEqual([-4, -2, 0, 2, 4]);
  });

  it("splits path segments across large jumps", () => {
    const path = pointsToPath(
      [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 20 },
      ],
      (x) => x * 10,
      (y) => 100 - y,
      { xMin: 0, xMax: 2, yMin: 0, yMax: 10 },
    );

    expect(path).toBe("M0.00,100.00L10.00,99.00M20.00,80.00");
  });
});
