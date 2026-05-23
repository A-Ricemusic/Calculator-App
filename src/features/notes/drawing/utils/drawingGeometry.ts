import type { Point } from '../../types';

export function distanceBetweenPoints(firstPoint: Point, secondPoint: Point) {
  return Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);
}
