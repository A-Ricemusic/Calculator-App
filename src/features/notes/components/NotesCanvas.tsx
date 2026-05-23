import { Pressable, Text, TextInput, View } from 'react-native';
import type { PanResponderInstance } from 'react-native';

import type { AppStyles } from '../../../app/appTypes';
import type { CalculatorTheme } from '../../theme';
import { noteDots } from '../constants/notes';
import { PencilKitCanvas } from '../native/PencilKitCanvas';
import type { NotePage, NoteTool, Stroke } from '../types';
import { StrokeSegment } from './StrokeSegment';

type NotesCanvasProps = {
  activeColor: string;
  activePage: NotePage | undefined;
  activeTool: NoteTool;
  drawingStroke: Stroke | null;
  notePanResponder: PanResponderInstance;
  onAddTextBlock: () => void;
  onDeleteTextBlock: (blockId: string) => void;
  onSetTextDraft: (text: string) => void;
  onUpdatePencilKitDrawing: (drawingData: string) => void;
  styles: AppStyles;
  textDraft: string;
  theme: CalculatorTheme;
};

export function NotesCanvas({
  activeColor,
  activePage,
  activeTool,
  drawingStroke,
  notePanResponder,
  onAddTextBlock,
  onDeleteTextBlock,
  onSetTextDraft,
  onUpdatePencilKitDrawing,
  styles,
  textDraft,
  theme,
}: NotesCanvasProps) {
  return (
    <>
      <View style={styles.notesCanvasWrap}>
        {PencilKitCanvas ? (
          <PencilKitCanvas
            drawingData={activePage?.pencilKitData ?? ''}
            onDrawingChange={(event) => onUpdatePencilKitDrawing(event.nativeEvent.drawingData)}
            style={styles.notesCanvas}
          />
        ) : (
          <View style={styles.notesCanvas} {...notePanResponder.panHandlers}>
            {noteDots.map((dot) => (
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
            {activePage?.textBlocks.map((textBlock) => (
              <View
                key={textBlock.id}
                style={[
                  styles.canvasTextBlockWrap,
                  { left: textBlock.x, top: textBlock.y },
                ]}
              >
                <Text style={[styles.canvasTextBlock, { color: activeColor }]}>
                  {textBlock.body}
                </Text>
                {activeTool === 'text' && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Delete "${textBlock.body}"`}
                    onPress={() => onDeleteTextBlock(textBlock.id)}
                    style={styles.textBlockDelete}
                  >
                    <Text style={styles.textBlockDeleteIcon}>✕</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {!PencilKitCanvas && activeTool === 'text' && (
        <View style={styles.notesTextBar}>
          <TextInput
            accessibilityLabel="Text to add to page"
            onChangeText={onSetTextDraft}
            placeholder="Type to add text…"
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={styles.notesTextInput}
            value={textDraft}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add text"
            onPress={onAddTextBlock}
            style={styles.notesTextAddBtn}
          >
            <Text style={styles.notesTextAddLabel}>Add</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

