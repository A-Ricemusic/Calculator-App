import { Path } from "react-native-svg";

import type { CalculatorTheme } from "../../../theme";
import type { Stroke } from "../../types";
import { pointsToSvgPath } from "../utils/drawingGeometry";

type StrokeSegmentProps = {
  stroke: Stroke;
  theme: CalculatorTheme;
};

export function StrokeSegment({ stroke, theme }: StrokeSegmentProps) {
  const path = pointsToSvgPath(stroke.points);

  if (!path) {
    return null;
  }

  return (
    <Path
      d={path}
      fill="none"
      opacity={stroke.tool === "highlighter" ? 0.45 : 1}
      pointerEvents="none"
      stroke={stroke.tool === "eraser" ? theme.colors.screen : stroke.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={stroke.width}
    />
  );
}
