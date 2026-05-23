import type { Dispatch, SetStateAction } from "react";
import { useMemo, useRef } from "react";
import { PanResponder, View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";

import type { AppStyles } from "../../../../app/appTypes";
import type { CalculatorTheme } from "../../../theme";
import type { GraphViewport, PlottedEquation } from "../../types";
import { formatTick, makeTicks, niceStep, pointsToPath } from "../utils/graphGeometry";
import { panViewport, zoomViewportAtScreenPoint } from "../utils/graphViewport";

type GraphCanvasProps = {
  equations: PlottedEquation[];
  height: number;
  styles: AppStyles;
  theme: CalculatorTheme;
  viewport: GraphViewport;
  width: number;
  onViewportChange: Dispatch<SetStateAction<GraphViewport>>;
};

type TouchPoint = {
  locationX: number;
  locationY: number;
};

type PinchState = {
  distance: number;
  viewport: GraphViewport;
};

function getTouchDistance(touchA: TouchPoint, touchB: TouchPoint) {
  return Math.hypot(touchA.locationX - touchB.locationX, touchA.locationY - touchB.locationY);
}

function getTouchMidpoint(touchA: TouchPoint, touchB: TouchPoint) {
  return {
    x: (touchA.locationX + touchB.locationX) / 2,
    y: (touchA.locationY + touchB.locationY) / 2,
  };
}

export function GraphCanvas({
  equations,
  height,
  styles,
  theme,
  viewport,
  width,
  onViewportChange,
}: GraphCanvasProps) {
  const { graphBackground, graphGridLine, graphAxisLine, graphLabelText } = theme.colors;
  const panStartViewport = useRef<GraphViewport>(viewport);
  const pinchStart = useRef<PinchState | null>(null);

  const geometry = useMemo(() => {
    const xScale = width / (viewport.xMax - viewport.xMin);
    const yScale = height / (viewport.yMax - viewport.yMin);
    const toScreenX = (x: number) => (x - viewport.xMin) * xScale;
    const toScreenY = (y: number) => height - (y - viewport.yMin) * yScale;
    const xStep = niceStep(viewport.xMax - viewport.xMin);
    const yStep = niceStep(viewport.yMax - viewport.yMin);

    return {
      toScreenX,
      toScreenY,
      xTicks: makeTicks(viewport.xMin, viewport.xMax, xStep),
      yTicks: makeTicks(viewport.yMin, viewport.yMax, yStep),
    };
  }, [height, viewport, width]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2,
        onPanResponderGrant: () => {
          panStartViewport.current = viewport;
          pinchStart.current = null;
        },
        onPanResponderMove: (event, gestureState) => {
          const touches = event.nativeEvent.touches;

          if (touches.length >= 2) {
            const [touchA, touchB] = touches;
            const distance = getTouchDistance(touchA, touchB);

            if (!pinchStart.current) {
              pinchStart.current = { distance, viewport };
            }

            if (distance <= 0 || pinchStart.current.distance <= 0) {
              return;
            }

            const midpoint = getTouchMidpoint(touchA, touchB);
            onViewportChange(
              zoomViewportAtScreenPoint(
                pinchStart.current.viewport,
                pinchStart.current.distance / distance,
                midpoint.x,
                midpoint.y,
                width,
                height,
              ),
            );
            return;
          }

          if (touches.length === 1) {
            if (pinchStart.current) {
              panStartViewport.current = viewport;
              pinchStart.current = null;
              return;
            }

            onViewportChange(
              panViewport(
                panStartViewport.current,
                gestureState.dx,
                gestureState.dy,
                width,
                height,
              ),
            );
          }
        },
        onPanResponderRelease: () => {
          pinchStart.current = null;
        },
        onPanResponderTerminate: () => {
          pinchStart.current = null;
        },
        onStartShouldSetPanResponder: (event) => event.nativeEvent.touches.length >= 2,
      }),
    [height, onViewportChange, viewport, width],
  );

  return (
    <View style={styles.graphArea} {...panResponder.panHandlers}>
      <Svg height={height} width={width}>
        <Rect fill={graphBackground} height={height} width={width} x={0} y={0} />

        <G>
          {geometry.xTicks.map((tick) => {
            const x = geometry.toScreenX(tick);
            const isAxis = Math.abs(tick) < 1e-8;

            return (
              <G key={`x-${tick}`}>
                <Line
                  stroke={isAxis ? graphAxisLine : graphGridLine}
                  strokeWidth={isAxis ? 1.4 : 0.8}
                  x1={x}
                  x2={x}
                  y1={0}
                  y2={height}
                />
                {!isAxis && (
                  <SvgText
                    fill={graphLabelText}
                    fontSize={11}
                    textAnchor="middle"
                    x={x}
                    y={geometry.toScreenY(0) + 16}
                  >
                    {formatTick(tick)}
                  </SvgText>
                )}
              </G>
            );
          })}

          {geometry.yTicks.map((tick) => {
            const y = geometry.toScreenY(tick);
            const isAxis = Math.abs(tick) < 1e-8;

            return (
              <G key={`y-${tick}`}>
                <Line
                  stroke={isAxis ? graphAxisLine : graphGridLine}
                  strokeWidth={isAxis ? 1.4 : 0.8}
                  x1={0}
                  x2={width}
                  y1={y}
                  y2={y}
                />
                {!isAxis && (
                  <SvgText
                    fill={graphLabelText}
                    fontSize={11}
                    textAnchor="end"
                    x={geometry.toScreenX(0) - 5}
                    y={y - 4}
                  >
                    {formatTick(tick)}
                  </SvgText>
                )}
              </G>
            );
          })}
        </G>

        {equations.map((equation) => {
          if (!equation.visible || equation.points.length === 0) {
            return null;
          }

          return (
            <Path
              d={pointsToPath(equation.points, geometry.toScreenX, geometry.toScreenY, viewport)}
              fill="none"
              key={equation.id}
              stroke={equation.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
            />
          );
        })}

        <Circle
          cx={geometry.toScreenX(0)}
          cy={geometry.toScreenY(0)}
          fill={graphAxisLine}
          r={2.5}
        />
      </Svg>
    </View>
  );
}
