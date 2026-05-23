import type { GraphPoint, GraphViewport, ParsedGraphExpression } from "../../types";

export function sampleExpression(
  expression: ParsedGraphExpression,
  viewport: GraphViewport,
  width: number,
) {
  const points: GraphPoint[] = [];
  const samples = Math.max(80, Math.min(500, Math.floor(width)));
  const xStep = (viewport.xMax - viewport.xMin) / samples;

  for (let index = 0; index <= samples; index += 1) {
    const x = viewport.xMin + xStep * index;
    const y = expression.evaluate(x);

    if (Number.isFinite(y)) {
      points.push({ x, y });
    }
  }

  return points;
}
