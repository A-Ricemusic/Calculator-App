import type { Point } from "../../types";

export function distanceBetweenPoints(firstPoint: Point, secondPoint: Point) {
  return Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);
}

export function shouldAppendPoint(previousPoint: Point, nextPoint: Point, minimumDistance: number) {
  return distanceBetweenPoints(previousPoint, nextPoint) >= minimumDistance;
}

export function pointsToSvgPath(points: Point[]) {
  if (points.length === 0) {
    return "";
  }

  const [firstPoint, ...remainingPoints] = points;
  return remainingPoints.reduce(
    (path, point) => `${path} L ${point.x} ${point.y}`,
    `M ${firstPoint.x} ${firstPoint.y}`,
  );
}
