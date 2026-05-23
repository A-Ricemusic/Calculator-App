import { describe, expect, it } from "vitest";

import { formatTick, makeTicks, niceStep, pointsToPath } from "./graphGeometry";

describe("graphGeometry", () => {
  it("chooses readable grid steps", () => {
    expect(niceStep(20)).toBe(2);
    expect(niceStep(30)).toBe(3);
    expect(niceStep(70)).toBe(10);
    expect(niceStep(0.8)).toBe(0.1);
  });

  it("formats tick labels without negative zero noise", () => {
    expect(formatTick(0)).toBe("0");
    expect(formatTick(-0)).toBe("0");
    expect(formatTick(2)).toBe("2");
    expect(formatTick(2.25)).toBe("2.3");
  });

  it("formats wide-span tick labels with compact scientific notation", () => {
    expect(formatTick(1000, 1000)).toBe("1×10³");
    expect(formatTick(-1500, 1000)).toBe("-1.5×10³");
    expect(formatTick(500, 1000)).toBe("5×10²");
  });

  it("formats extreme small tick labels with compact scientific notation", () => {
    expect(formatTick(1e48)).toBe("1×10⁴⁸");
    expect(formatTick(-1.5e48)).toBe("-1.5×10⁴⁸");
    expect(formatTick(5e47)).toBe("5×10⁴⁷");
    expect(formatTick(0.000001)).toBe("1×10⁻⁶");
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
