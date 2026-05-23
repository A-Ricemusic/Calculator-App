import { useMemo, useRef, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { PanResponder } from 'react-native';

import { createId } from '../../../shared/utils/ids';
import { toolSettings } from '../constants/notes';
import type { NoteCollection, NotePage, NoteTool, Point, Stroke } from '../types';

type UseFallbackDrawingParams = {
  activeCollectionIndex: number;
  activeColor: string;
  activePageIndex: number;
  activeTool: NoteTool;
  noteCollections: NoteCollection[];
  updateActivePage: (updater: (page: NotePage) => NotePage) => void;
};

export function useFallbackDrawing({
  activeCollectionIndex,
  activeColor,
  activePageIndex,
  activeTool,
  noteCollections,
  updateActivePage,
}: UseFallbackDrawingParams) {
  const [drawingStroke, setDrawingStroke] = useState<Stroke | null>(null);
  const drawingStrokeRef = useRef<Stroke | null>(null);

  function resetDrawingStroke() {
    drawingStrokeRef.current = null;
    setDrawingStroke(null);
  }

  function pointFromEvent(event: GestureResponderEvent) {
    const { locationX, locationY } = event.nativeEvent;
    return { x: locationX, y: locationY };
  }

  function eraseAt(point: Point) {
    updateActivePage((page) => ({
      ...page,
      strokes: page.strokes.filter((stroke) => !stroke.points.some((strokePoint) => {
        const distance = Math.hypot(strokePoint.x - point.x, strokePoint.y - point.y);
        return distance <= toolSettings.eraser.width;
      })),
    }));
  }

  function beginStroke(event: GestureResponderEvent) {
    const point = pointFromEvent(event);

    if (activeTool === 'text') {
      return;
    }

    if (activeTool === 'eraser') {
      eraseAt(point);
      return;
    }

    const nextStroke: Stroke = {
      id: createId('stroke'),
      color: activeColor,
      tool: activeTool,
      width: toolSettings[activeTool].width,
      points: [point],
    };

    drawingStrokeRef.current = nextStroke;
    setDrawingStroke(nextStroke);
  }

  function appendStrokePoint(event: GestureResponderEvent) {
    const point = pointFromEvent(event);

    if (activeTool === 'text') {
      return;
    }

    if (activeTool === 'eraser') {
      eraseAt(point);
      return;
    }

    const currentStroke = drawingStrokeRef.current;
    if (!currentStroke) {
      return;
    }

    const nextStroke = {
      ...currentStroke,
      points: [...currentStroke.points, point],
    };
    drawingStrokeRef.current = nextStroke;
    setDrawingStroke(nextStroke);
  }

  function finishStroke() {
    const currentStroke = drawingStrokeRef.current;

    if (!currentStroke) {
      return;
    }

    if (currentStroke.points.length > 1) {
      updateActivePage((page) => ({
        ...page,
        strokes: [...page.strokes, currentStroke],
      }));
    }

    resetDrawingStroke();
  }

  const notePanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => activeTool !== 'text',
    onPanResponderGrant: beginStroke,
    onPanResponderMove: appendStrokePoint,
    onPanResponderRelease: finishStroke,
    onPanResponderTerminate: finishStroke,
  }), [activeTool, activeColor, activeCollectionIndex, activePageIndex, noteCollections]);

  return {
    drawingStroke,
    notePanResponder,
    resetDrawingStroke,
  };
}

