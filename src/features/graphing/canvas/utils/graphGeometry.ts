import type { GraphPoint, GraphViewport } from "../../types";

export function niceStep(range: number) {
  const rough = range / 10;
  const power = 10 ** Math.floor(Math.log10(rough));
  const scaled = rough / power;

  if (scaled >= 5) {
    return 5 * power;
  }

  if (scaled >= 2) {
    return 2 * power;
  }

  return power;
}

export function formatTick(value: number) {
  if (Math.abs(value) < 1e-8) {
    return "0";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function makeTicks(min: number, max: number, step: number) {
  const ticks: number[] = [];
  const start = Math.ceil(min / step) * step;

  for (let value = start; value <= max; value += step) {
    ticks.push(Number(value.toFixed(8)));
  }

  return ticks;
}

export function pointsToPath(
  points: GraphPoint[],
  toScreenX: (x: number) => number,
  toScreenY: (y: number) => number,
  viewport: GraphViewport,
) {
  const yRange = viewport.yMax - viewport.yMin;
  let path = "";
  let previous: GraphPoint | undefined;

  points.forEach((point) => {
    const screenX = toScreenX(point.x);
    const screenY = toScreenY(point.y);
    const isLargeJump = previous ? Math.abs(point.y - previous.y) > yRange * 0.45 : true;
    const command = !previous || isLargeJump ? "M" : "L";

    path += `${command}${screenX.toFixed(2)},${screenY.toFixed(2)}`;
    previous = point;
  });

  return path;
}
