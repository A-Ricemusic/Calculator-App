import { View } from 'react-native';
import type { PanResponderInstance } from 'react-native';

import type { AppStyles } from '../../../../app/appTypes';
import type { CalculatorTheme } from '../../../theme';
import { TextBlockLayer } from '../../text/components/TextBlockLayer';
import type { NotePage, NoteTool, Stroke } from '../../types';
import { canvasGridDots } from '../constants/canvasGrid';
import { StrokeSegment } from './StrokeSegment';

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
      {canvasGridDots.map((dot) => (
        <View
          key={dot.id}
          pointerEvents="none"
          style={[styles.notesDot, { left: dot.left, top: dot.top }]}
        />
      ))}
      {activePage?.strokes.map((stroke) => (
        <StrokeSegment key={stroke.id} stroke={stroke} styles={styles} theme={theme} />
      ))}
      {drawingStroke && <StrokeSegment stroke={drawingStroke} styles={styles} theme={theme} />}
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
