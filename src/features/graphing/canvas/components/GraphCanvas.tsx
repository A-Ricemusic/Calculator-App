import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { AppStyles } from '../../../../app/appTypes';
import type { GraphViewport, PlottedEquation } from '../../types';
import { formatTick, makeTicks, niceStep, pointsToPath } from '../utils/graphGeometry';

type GraphCanvasProps = {
  equations: PlottedEquation[];
  height: number;
  styles: AppStyles;
  viewport: GraphViewport;
  width: number;
};

export function GraphCanvas({ equations, height, styles, viewport, width }: GraphCanvasProps) {
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

  return (
    <View style={styles.graphArea}>
      <Svg height={height} width={width}>
        <Rect fill="#fbfbfa" height={height} width={width} x={0} y={0} />

        <G>
          {geometry.xTicks.map((tick) => {
            const x = geometry.toScreenX(tick);
            const isAxis = Math.abs(tick) < 1e-8;

            return (
              <G key={`x-${tick}`}>
                <Line
                  stroke={isAxis ? '#202020' : '#d8d8d2'}
                  strokeWidth={isAxis ? 1.4 : 0.8}
                  x1={x}
                  x2={x}
                  y1={0}
                  y2={height}
                />
                {!isAxis && (
                  <SvgText fill="#555555" fontSize={11} textAnchor="middle" x={x} y={geometry.toScreenY(0) + 16}>
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
                  stroke={isAxis ? '#202020' : '#d8d8d2'}
                  strokeWidth={isAxis ? 1.4 : 0.8}
                  x1={0}
                  x2={width}
                  y1={y}
                  y2={y}
                />
                {!isAxis && (
                  <SvgText fill="#555555" fontSize={11} textAnchor="end" x={geometry.toScreenX(0) - 5} y={y - 4}>
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
              d={pointsToPath(
                equation.points,
                geometry.toScreenX,
                geometry.toScreenY,
                viewport,
              )}
              fill="none"
              key={equation.id}
              stroke={equation.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
            />
          );
        })}

        <Circle cx={geometry.toScreenX(0)} cy={geometry.toScreenY(0)} fill="#777777" r={2.5} />
      </Svg>
    </View>
  );
}
