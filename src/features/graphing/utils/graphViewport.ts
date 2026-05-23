import type { GraphViewport } from '../types';

export const initialGraphViewport: GraphViewport = {
  xMin: -10,
  xMax: 10,
  yMin: -7,
  yMax: 7,
};

export function zoomViewport(viewport: GraphViewport, factor: number): GraphViewport {
  const xCenter = (viewport.xMin + viewport.xMax) / 2;
  const yCenter = (viewport.yMin + viewport.yMax) / 2;
  const xRadius = ((viewport.xMax - viewport.xMin) * factor) / 2;
  const yRadius = ((viewport.yMax - viewport.yMin) * factor) / 2;

  return {
    xMin: xCenter - xRadius,
    xMax: xCenter + xRadius,
    yMin: yCenter - yRadius,
    yMax: yCenter + yRadius,
  };
}
