import { describe, expect, it } from "vitest";

import type { PlottedEquation } from "../../types";
import { findNearestGraphPoint, formatSelectedCoordinate } from "./graphSelection";

const equations: PlottedEquation[] = [
  {
    id: "line",
    color: "#ff0000",
    expression: "x",
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
    visible: true,
  },
  {
    id: "hidden",
    color: "#00ff00",
    expression: "x + 10",
    points: [{ x: 1, y: 10 }],
    visible: false,
  },
];

describe("graphSelection", () => {
  it("finds the nearest visible plotted point within the hit radius", () => {
    const point = findNearestGraphPoint({
      equations,
      maxDistance: 8,
      screenPoint: { x: 12, y: 8 },
      toScreenX: (x) => x * 10,
      toScreenY: (y) => y * 10,
    });

    expect(point).toMatchObject({
      color: "#ff0000",
      screenX: 10,
      screenY: 10,
      x: 1,
      y: 1,
    });
  });

  it("returns null when no visible point is close enough", () => {
    const point = findNearestGraphPoint({
      equations,
      maxDistance: 4,
      screenPoint: { x: 50, y: 50 },
      toScreenX: (x) => x * 10,
      toScreenY: (y) => y * 10,
    });

    expect(point).toBeNull();
  });

  it("formats selected coordinates compactly", () => {
    expect(formatSelectedCoordinate(0)).toBe("0");
    expect(formatSelectedCoordinate(1.2)).toBe("1.2");
    expect(formatSelectedCoordinate(-1.23456)).toBe("-1.235");
    expect(formatSelectedCoordinate(1200)).toBe("1.2e+3");
  });
});
