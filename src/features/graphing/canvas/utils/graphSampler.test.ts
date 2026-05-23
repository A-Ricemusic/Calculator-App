import { describe, expect, it } from "vitest";

import type { ParsedGraphExpression } from "../../types";
import { sampleExpression } from "./graphSampler";

describe("sampleExpression", () => {
  it("samples finite points across the viewport", () => {
    const expression: ParsedGraphExpression = {
      kind: "explicit",
      source: "x",
      evaluate: (x) => x,
    };

    const points = sampleExpression(expression, { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }, 120);

    expect(points).toHaveLength(121);
    expect(points[0]).toEqual({ x: -10, y: -10 });
    expect(points.at(-1)).toEqual({ x: 10, y: 10 });
  });

  it("skips non-finite values", () => {
    const expression: ParsedGraphExpression = {
      kind: "explicit",
      source: "bad-at-zero",
      evaluate: (x) => (Math.abs(x) < 1e-8 ? Number.NaN : x),
    };

    const points = sampleExpression(expression, { xMin: -1, xMax: 1, yMin: -1, yMax: 1 }, 80);

    expect(points.some((point) => Math.abs(point.x) < 1e-8)).toBe(false);
  });
});
