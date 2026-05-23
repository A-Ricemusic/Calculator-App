import { useMemo, useState } from 'react';

import { createId } from '../../../shared/utils/ids';
import { GRAPH_COLORS, MAX_GRAPH_EQUATIONS } from '../constants/graphColors';
import type { GraphEquation, GraphViewport, PlottedEquation } from '../types';
import { parseGraphExpression } from '../utils/expressionParser';
import { sampleExpression } from '../utils/graphSampler';
import { initialGraphViewport, zoomViewport } from '../utils/graphViewport';

function createEquation(index: number): GraphEquation {
  return {
    id: createId('graph-equation'),
    expression: '',
    color: GRAPH_COLORS[index % GRAPH_COLORS.length],
    visible: true,
  };
}

export function useGraphingCalculator(graphWidth: number) {
  const [equations, setEquations] = useState<GraphEquation[]>([
    { ...createEquation(0), expression: '3x + 5y = 30' },
    { ...createEquation(1), expression: 'x^2 + 1' },
  ]);
  const [viewport, setViewport] = useState<GraphViewport>(initialGraphViewport);

  const plottedEquations = useMemo<PlottedEquation[]>(() => {
    return equations.map((equation) => {
      if (!equation.visible || !equation.expression.trim()) {
        return { ...equation, points: [], error: undefined };
      }

      try {
        const parsed = parseGraphExpression(equation.expression);
        const points = parsed ? sampleExpression(parsed, viewport, graphWidth) : [];
        return { ...equation, points, error: undefined };
      } catch (error) {
        return {
          ...equation,
          points: [],
          error: error instanceof Error ? error.message : 'Could not graph this equation.',
        };
      }
    });
  }, [equations, graphWidth, viewport]);

  function addEquation() {
    setEquations((current) => {
      if (current.length >= MAX_GRAPH_EQUATIONS) {
        return current;
      }

      return [...current, createEquation(current.length)];
    });
  }

  function updateEquation(id: string, expression: string) {
    setEquations((current) =>
      current.map((equation) => (equation.id === id ? { ...equation, expression } : equation)),
    );
  }

  function deleteEquation(id: string) {
    setEquations((current) => current.filter((equation) => equation.id !== id));
  }

  function toggleEquation(id: string) {
    setEquations((current) =>
      current.map((equation) =>
        equation.id === id ? { ...equation, visible: !equation.visible } : equation,
      ),
    );
  }

  function resetGraph() {
    setViewport(initialGraphViewport);
  }

  return {
    addEquation,
    canAddEquation: equations.length < MAX_GRAPH_EQUATIONS,
    deleteEquation,
    equations,
    plottedEquations,
    resetGraph,
    toggleEquation,
    updateEquation,
    viewport,
    zoomIn: () => setViewport((current) => zoomViewport(current, 0.72)),
    zoomOut: () => setViewport((current) => zoomViewport(current, 1.28)),
  };
}
