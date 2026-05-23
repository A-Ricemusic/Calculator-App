import { describe, expect, it } from "vitest";

import { sampleExpression } from "../canvas/utils/graphSampler";
import { parseGraphExpression } from "../expression/parseGraphExpression";

const EXPRESSIONS = [
  "3x + 5y = 30",
  "x^2 + 1",
  "y = x^3 - 2x",
  "2x squared + 3x + 1",
  "sin(x)",
  "cos(x)",
  "sqrt(x + 10)",
  "y = x^2 + 2x + 7",
  "2x^3 + 25x^2 + 2y = 19",
  "y = 4x - 8",
  "x / 2 + 9",
  "tan(x)",
  "ln(x + 11)",
  "log(x + 11)",
  "x^3 - x",
  "5y = 10x + 20",
  "y = 0",
  "x squared",
  "x cubed",
  "pi * x",
];

describe("graphing performance", () => {
  it("parses and samples twenty equations within bounded work", () => {
    const startedAt = performance.now();
    const parsed = EXPRESSIONS.map((expression) => parseGraphExpression(expression));
    const points = parsed.flatMap((expression) =>
      expression
        ? sampleExpression(expression, { xMin: -10, xMax: 10, yMin: -7, yMax: 7 }, 1200)
        : [],
    );
    const durationMs = performance.now() - startedAt;

    expect(parsed).toHaveLength(20);
    expect(points.length).toBeLessThanOrEqual(20 * 501);
    expect(durationMs).toBeLessThan(120);
  });

  it("fails invalid expressions quickly", () => {
    const startedAt = performance.now();

    for (let index = 0; index < 100; index += 1) {
      expect(() => parseGraphExpression("$bad(x)")).toThrow("Unsupported token");
    }

    expect(performance.now() - startedAt).toBeLessThan(80);
  });
});
