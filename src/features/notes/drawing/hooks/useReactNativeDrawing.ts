import { useCallback, useMemo, useRef, useState } from "react";
import type { GestureResponderEvent } from "react-native";
import { PanResponder } from "react-native";

import { createId } from "@shared/utils/ids";
import type { NoteCollection, NotePage, NoteTool, Point, Stroke } from "../../types";
import { drawingToolSettings, minimumPointDistance } from "../constants/drawingTools";
import { distanceBetweenPoints, shouldAppendPoint } from "../utils/drawingGeometry";

type UseReactNativeDrawingParams = {
  activeCollectionIndex: number;
  activeColor: string;
  activePageIndex: number;
  activeTool: NoteTool;
  noteCollections: NoteCollection[];
  updateActivePage: (updater: (page: NotePage) => NotePage) => void;
};

function pointFromEvent(event: GestureResponderEvent) {
  const { locationX, locationY } = event.nativeEvent;
  return { x: locationX, y: locationY };
}

export function useReactNativeDrawing({
  activeCollectionIndex,
  activeColor,
  activePageIndex,
  activeTool,
  noteCollections,
  updateActivePage,
}: UseReactNativeDrawingParams) {
  const [drawingStroke, setDrawingStroke] = useState<Stroke | null>(null);
  const drawingStrokeRef = useRef<Stroke | null>(null);
  const drawingFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const erasedStrokeIdsRef = useRef<Set<string>>(new Set());
  const eraserFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  const flushDrawingStroke = useCallback(() => {
    drawingFrameRef.current = null;
    setDrawingStroke(drawingStrokeRef.current);
  }, []);

  const scheduleDrawingStrokeUpdate = useCallback(() => {
    if (drawingFrameRef.current !== null) {
      return;
    }

    drawingFrameRef.current = requestAnimationFrame(flushDrawingStroke);
  }, [flushDrawingStroke]);

  const flushErasedStrokes = useCallback(() => {
    eraserFrameRef.current = null;
    const erasedStrokeIds = erasedStrokeIdsRef.current;

    if (erasedStrokeIds.size === 0) {
      return;
    }

    updateActivePage((page) => ({
      ...page,
      strokes: page.strokes.filter((stroke) => !erasedStrokeIds.has(stroke.id)),
    }));
  }, [updateActivePage]);

  const scheduleErasedStrokeUpdate = useCallback(() => {
    if (eraserFrameRef.current !== null) {
      return;
    }

    eraserFrameRef.current = requestAnimationFrame(flushErasedStrokes);
  }, [flushErasedStrokes]);

  const resetDrawingStroke = useCallback(() => {
    if (drawingFrameRef.current !== null) {
      cancelAnimationFrame(drawingFrameRef.current);
      drawingFrameRef.current = null;
    }

    drawingStrokeRef.current = null;
    setDrawingStroke(null);
  }, []);

  const eraseAt = useCallback(
    (point: Point) => {
      const activePage = noteCollections[activeCollectionIndex]?.pages[activePageIndex];
      const erasedStrokeIds = erasedStrokeIdsRef.current;

      activePage?.strokes.forEach((stroke) => {
        if (erasedStrokeIds.has(stroke.id)) {
          return;
        }

        const shouldErase = stroke.points.some((strokePoint) => {
          const distance = distanceBetweenPoints(strokePoint, point);
          return distance <= drawingToolSettings.eraser.width;
        });

        if (shouldErase) {
          erasedStrokeIds.add(stroke.id);
        }
      });

      scheduleErasedStrokeUpdate();
    },
    [activeCollectionIndex, activePageIndex, noteCollections, scheduleErasedStrokeUpdate],
  );

  const beginStroke = useCallback(
    (event: GestureResponderEvent) => {
      const point = pointFromEvent(event);

      if (activeTool === "text") {
        return;
      }

      if (activeTool === "eraser") {
        erasedStrokeIdsRef.current = new Set();
        eraseAt(point);
        return;
      }

      const nextStroke: Stroke = {
        id: createId("stroke"),
        color: activeColor,
        tool: activeTool,
        width: drawingToolSettings[activeTool].width,
        points: [point],
      };

      drawingStrokeRef.current = nextStroke;
      setDrawingStroke(nextStroke);
    },
    [activeColor, activeTool, eraseAt],
  );

  const appendStrokePoint = useCallback(
    (event: GestureResponderEvent) => {
      const point = pointFromEvent(event);

      if (activeTool === "text") {
        return;
      }

      if (activeTool === "eraser") {
        eraseAt(point);
        return;
      }

      const currentStroke = drawingStrokeRef.current;
      if (!currentStroke) {
        return;
      }

      const previousPoint = currentStroke.points[currentStroke.points.length - 1];
      if (!shouldAppendPoint(previousPoint, point, minimumPointDistance[activeTool])) {
        return;
      }

      const nextStroke = {
        ...currentStroke,
        points: [...currentStroke.points, point],
      };
      drawingStrokeRef.current = nextStroke;
      scheduleDrawingStrokeUpdate();
    },
    [activeTool, eraseAt, scheduleDrawingStrokeUpdate],
  );

  const finishStroke = useCallback(() => {
    if (activeTool === "eraser") {
      if (eraserFrameRef.current !== null) {
        cancelAnimationFrame(eraserFrameRef.current);
        eraserFrameRef.current = null;
      }
      flushErasedStrokes();
      erasedStrokeIdsRef.current = new Set();
      return;
    }

    if (drawingFrameRef.current !== null) {
      cancelAnimationFrame(drawingFrameRef.current);
      drawingFrameRef.current = null;
    }

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
  }, [activeTool, flushErasedStrokes, resetDrawingStroke, updateActivePage]);

  const notePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => activeTool !== "text",
        onPanResponderGrant: beginStroke,
        onPanResponderMove: appendStrokePoint,
        onPanResponderRelease: finishStroke,
        onPanResponderTerminate: finishStroke,
      }),
    [activeTool, appendStrokePoint, beginStroke, finishStroke],
  );

  return {
    drawingStroke,
    notePanResponder,
    resetDrawingStroke,
  };
}
