import type { Dispatch, SetStateAction } from "react";
import { useMemo, useRef, useState } from "react";
import { PanResponder, View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";

import type { GraphingStyles } from "../../styles/graphingStyleTypes";
import type { CalculatorTheme } from "@features/theme";
import type { GraphViewport, PlottedEquation } from "../../types";
import { formatTick, makeTicks, niceStep, pointsToPath } from "../utils/graphGeometry";
import {
  findNearestGraphPoint,
  formatSelectedCoordinate,
  type SelectedGraphPoint,
} from "../utils/graphSelection";
import { panViewport, zoomViewportAtScreenPoint } from "../utils/graphViewport";

type GraphCanvasProps = {
  equations: PlottedEquation[];
  height: number;
  styles: GraphingStyles;
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

const POINT_HIT_RADIUS = 28;
const SELECTION_LABEL_HEIGHT = 28;
const SELECTION_LABEL_PADDING = 10;

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
  const latestViewport = useRef<GraphViewport>(viewport);
  const panStartViewport = useRef<GraphViewport>(viewport);
  const pinchStart = useRef<PinchState | null>(null);
  const didMove = useRef(false);
  const [selectedPoint, setSelectedPoint] = useState<SelectedGraphPoint | null>(null);

  latestViewport.current = viewport;

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
      xSpan: viewport.xMax - viewport.xMin,
      xTicks: makeTicks(viewport.xMin, viewport.xMax, xStep),
      ySpan: viewport.yMax - viewport.yMin,
      yTicks: makeTicks(viewport.yMin, viewport.yMax, yStep),
    };
  }, [height, viewport, width]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2,
        onPanResponderGrant: () => {
          panStartViewport.current = latestViewport.current;
          pinchStart.current = null;
        },
        onPanResponderMove: (event, gestureState) => {
          const touches = event.nativeEvent.touches;
          didMove.current = true;

          if (touches.length >= 2) {
            const [touchA, touchB] = touches;
            const distance = getTouchDistance(touchA, touchB);

            if (!pinchStart.current) {
              pinchStart.current = { distance, viewport: latestViewport.current };
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
              panStartViewport.current = latestViewport.current;
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
    [height, onViewportChange, width],
  );

  function handleGraphPress(locationX: number, locationY: number) {
    const nextSelectedPoint = findNearestGraphPoint({
      equations,
      maxDistance: POINT_HIT_RADIUS,
      screenPoint: { x: locationX, y: locationY },
      toScreenX: geometry.toScreenX,
      toScreenY: geometry.toScreenY,
    });

    setSelectedPoint(nextSelectedPoint);
  }

  const selectionLabel = selectedPoint
    ? `(${formatSelectedCoordinate(selectedPoint.x)}, ${formatSelectedCoordinate(selectedPoint.y)})`
    : "";
  const selectionLabelWidth = Math.max(
    64,
    selectionLabel.length * 7.5 + SELECTION_LABEL_PADDING * 2,
  );
  const selectedScreenX = selectedPoint ? geometry.toScreenX(selectedPoint.x) : 0;
  const selectedScreenY = selectedPoint ? geometry.toScreenY(selectedPoint.y) : 0;
  const maxSelectionLabelX = Math.max(
    SELECTION_LABEL_PADDING,
    width - selectionLabelWidth - SELECTION_LABEL_PADDING,
  );
  const selectionLabelX = selectedPoint
    ? Math.min(
        Math.max(SELECTION_LABEL_PADDING, selectedScreenX - selectionLabelWidth / 2),
        maxSelectionLabelX,
      )
    : 0;
  const selectionLabelY = selectedPoint
    ? Math.max(SELECTION_LABEL_PADDING, selectedScreenY - 44)
    : 0;

  return (
    <View
      style={styles.graphArea}
      onTouchEnd={(event) => {
        if (didMove.current) {
          didMove.current = false;
          return;
        }

        const touch = event.nativeEvent.changedTouches[0];

        if (touch) {
          handleGraphPress(touch.locationX, touch.locationY);
        }
      }}
      onTouchStart={() => {
        didMove.current = false;
      }}
      {...panResponder.panHandlers}
    >
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
                    {formatTick(tick, geometry.xSpan)}
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
                    {formatTick(tick, geometry.ySpan)}
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

        {selectedPoint && (
          <G>
            <Line
              stroke={selectedPoint.color}
              strokeDasharray="4 4"
              strokeOpacity={0.55}
              strokeWidth={1.2}
              x1={selectedScreenX}
              x2={selectedScreenX}
              y1={selectedScreenY}
              y2={geometry.toScreenY(0)}
            />
            <Line
              stroke={selectedPoint.color}
              strokeDasharray="4 4"
              strokeOpacity={0.55}
              strokeWidth={1.2}
              x1={selectedScreenX}
              x2={geometry.toScreenX(0)}
              y1={selectedScreenY}
              y2={selectedScreenY}
            />
            <Circle cx={selectedScreenX} cy={selectedScreenY} fill={selectedPoint.color} r={4.5} />
            <Rect
              fill={theme.colors.screen}
              height={SELECTION_LABEL_HEIGHT}
              opacity={0.96}
              rx={6}
              ry={6}
              stroke={theme.colors.divider}
              strokeWidth={1}
              width={selectionLabelWidth}
              x={selectionLabelX}
              y={selectionLabelY}
            />
            <SvgText
              fill={theme.colors.topText}
              fontSize={13}
              fontWeight="600"
              textAnchor="middle"
              x={selectionLabelX + selectionLabelWidth / 2}
              y={selectionLabelY + 18}
            >
              {selectionLabel}
            </SvgText>
          </G>
        )}
      </Svg>
    </View>
  );
}
