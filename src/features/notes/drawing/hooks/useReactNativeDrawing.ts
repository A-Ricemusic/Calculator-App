import { useCallback, useMemo, useRef, useState } from "react";
import type { GestureResponderEvent } from "react-native";
import { PanResponder } from "react-native";

import { createId } from "../../../../shared/utils/ids";
import type { NoteCollection, NotePage, NoteTool, Point, Stroke } from "../../types";
import { drawingToolSettings } from "../constants/drawingTools";
import { distanceBetweenPoints } from "../utils/drawingGeometry";

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
  activeColor,
  activeTool,
  updateActivePage,
}: UseReactNativeDrawingParams) {
  const [drawingStroke, setDrawingStroke] = useState<Stroke | null>(null);
  const drawingStrokeRef = useRef<Stroke | null>(null);

  const resetDrawingStroke = useCallback(() => {
    drawingStrokeRef.current = null;
    setDrawingStroke(null);
  }, []);

  const eraseAt = useCallback(
    (point: Point) => {
      updateActivePage((page) => ({
        ...page,
        strokes: page.strokes.filter(
          (stroke) =>
            !stroke.points.some((strokePoint) => {
              const distance = distanceBetweenPoints(strokePoint, point);
              return distance <= drawingToolSettings.eraser.width;
            }),
        ),
      }));
    },
    [updateActivePage],
  );

  const beginStroke = useCallback(
    (event: GestureResponderEvent) => {
      const point = pointFromEvent(event);

      if (activeTool === "text") {
        return;
      }

      if (activeTool === "eraser") {
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

      const nextStroke = {
        ...currentStroke,
        points: [...currentStroke.points, point],
      };
      drawingStrokeRef.current = nextStroke;
      setDrawingStroke(nextStroke);
    },
    [activeTool, eraseAt],
  );

  const finishStroke = useCallback(() => {
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
  }, [resetDrawingStroke, updateActivePage]);

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
