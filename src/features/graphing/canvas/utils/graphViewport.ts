import type { GraphViewport } from "../../types";

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

export function panViewport(
  viewport: GraphViewport,
  dx: number,
  dy: number,
  width: number,
  height: number,
): GraphViewport {
  const xUnitsPerPixel = (viewport.xMax - viewport.xMin) / width;
  const yUnitsPerPixel = (viewport.yMax - viewport.yMin) / height;
  const xOffset = dx * xUnitsPerPixel;
  const yOffset = dy * yUnitsPerPixel;

  return {
    xMin: viewport.xMin - xOffset,
    xMax: viewport.xMax - xOffset,
    yMin: viewport.yMin + yOffset,
    yMax: viewport.yMax + yOffset,
  };
}

export function zoomViewportAtScreenPoint(
  viewport: GraphViewport,
  factor: number,
  screenX: number,
  screenY: number,
  width: number,
  height: number,
): GraphViewport {
  const xAnchor = viewport.xMin + (screenX / width) * (viewport.xMax - viewport.xMin);
  const yAnchor = viewport.yMax - (screenY / height) * (viewport.yMax - viewport.yMin);

  return {
    xMin: xAnchor + (viewport.xMin - xAnchor) * factor,
    xMax: xAnchor + (viewport.xMax - xAnchor) * factor,
    yMin: yAnchor + (viewport.yMin - yAnchor) * factor,
    yMax: yAnchor + (viewport.yMax - yAnchor) * factor,
  };
}
