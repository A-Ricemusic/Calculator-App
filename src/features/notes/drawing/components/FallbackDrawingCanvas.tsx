import { memo } from "react";
import { StyleSheet, View } from "react-native";
import type { PanResponderInstance } from "react-native";
import Svg from "react-native-svg";

import type { AppStyles } from "../../../../app/appTypes";
import type { CalculatorTheme } from "../../../theme";
import { TextBlockLayer } from "../../text/components/TextBlockLayer";
import type { NotePage, NoteTool, Stroke } from "../../types";
import { canvasGridDots } from "../constants/canvasGrid";
import { StrokeSegment } from "./StrokeSegment";

type CanvasGridProps = {
  styles: AppStyles;
};

type FallbackDrawingCanvasProps = {
  activeColor: string;
  activePage: NotePage | undefined;
  activeTool: NoteTool;
  drawingStroke: Stroke | null;
  notePanResponder: PanResponderInstance;
  onDeleteTextBlock: (blockId: string) => void;
  styles: AppStyles;
  theme: CalculatorTheme;
};

const CanvasGrid = memo(function CanvasGrid({ styles }: CanvasGridProps) {
  return (
    <>
      {canvasGridDots.map((dot) => (
        <View
          key={dot.id}
          pointerEvents="none"
          style={[styles.notesDot, { left: dot.left, top: dot.top }]}
        />
      ))}
    </>
  );
});

const SavedStrokeLayer = memo(function SavedStrokeLayer({
  strokes,
  theme,
}: {
  strokes: Stroke[];
  theme: CalculatorTheme;
}) {
  return (
    <>
      {strokes.map((stroke) => (
        <StrokeSegment key={stroke.id} stroke={stroke} theme={theme} />
      ))}
    </>
  );
});

export function FallbackDrawingCanvas({
  activeColor,
  activePage,
  activeTool,
  drawingStroke,
  notePanResponder,
  onDeleteTextBlock,
  styles,
  theme,
}: FallbackDrawingCanvasProps) {
  return (
    <View style={styles.notesCanvas} {...notePanResponder.panHandlers}>
      <CanvasGrid styles={styles} />
      <Svg pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <SavedStrokeLayer strokes={activePage?.strokes ?? []} theme={theme} />
        {drawingStroke && <StrokeSegment stroke={drawingStroke} theme={theme} />}
      </Svg>
      <TextBlockLayer
        activeColor={activeColor}
        activeTool={activeTool}
        onDeleteTextBlock={onDeleteTextBlock}
        styles={styles}
        textBlocks={activePage?.textBlocks ?? []}
      />
    </View>
  );
}
