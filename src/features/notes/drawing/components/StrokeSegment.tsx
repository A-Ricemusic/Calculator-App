import { View } from "react-native";

import type { AppStyles } from "../../../../app/appTypes";
import type { CalculatorTheme } from "../../../theme";
import type { Stroke } from "../../types";

type StrokeSegmentProps = {
  stroke: Stroke;
  styles: AppStyles;
  theme: CalculatorTheme;
};

export function StrokeSegment({ stroke, styles, theme }: StrokeSegmentProps) {
  return (
    <>
      {stroke.points.slice(1).map((point, index) => {
        const previousPoint = stroke.points[index];
        const length = Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y);
        const angle = Math.atan2(point.y - previousPoint.y, point.x - previousPoint.x);

        return (
          <View
            key={`${stroke.id}-${previousPoint.x}-${previousPoint.y}-${point.x}-${point.y}`}
            pointerEvents="none"
            style={[
              styles.strokeSegment,
              {
                backgroundColor: stroke.tool === "eraser" ? theme.colors.screen : stroke.color,
                height: stroke.width,
                left: previousPoint.x,
                opacity: stroke.tool === "highlighter" ? 0.45 : 1,
                top: previousPoint.y - stroke.width / 2,
                transform: [{ rotateZ: `${angle}rad` }, { translateX: length / 2 }],
                width: length,
              },
            ]}
          />
        );
      })}
    </>
  );
}
