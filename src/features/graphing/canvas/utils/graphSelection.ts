import type { PlottedEquation } from "../../types";

type ScreenPoint = {
  x: number;
  y: number;
};

export type SelectedGraphPoint = {
  color: string;
  screenX: number;
  screenY: number;
  x: number;
  y: number;
};

type FindNearestGraphPointOptions = {
  equations: PlottedEquation[];
  maxDistance: number;
  screenPoint: ScreenPoint;
  toScreenX: (x: number) => number;
  toScreenY: (y: number) => number;
};

export function formatSelectedCoordinate(value: number) {
  if (Math.abs(value) < 1e-8) {
    return "0";
  }

  const magnitude = Math.abs(value);

  if (magnitude >= 1000 || magnitude < 0.001) {
    return value.toExponential(3).replace(/\.?0+e/, "e");
  }

  return value.toFixed(3).replace(/\.?0+$/, "");
}

export function findNearestGraphPoint({
  equations,
  maxDistance,
  screenPoint,
  toScreenX,
  toScreenY,
}: FindNearestGraphPointOptions): SelectedGraphPoint | null {
  let nearest: SelectedGraphPoint | null = null;
  let nearestDistance = maxDistance;

  equations.forEach((equation) => {
    if (!equation.visible) {
      return;
    }

    equation.points.forEach((point) => {
      const screenX = toScreenX(point.x);
      const screenY = toScreenY(point.y);
      const distance = Math.hypot(screenPoint.x - screenX, screenPoint.y - screenY);

      if (distance <= nearestDistance) {
        nearestDistance = distance;
        nearest = {
          color: equation.color,
          screenX,
          screenY,
          x: point.x,
          y: point.y,
        };
      }
    });
  });

  return nearest;
}
