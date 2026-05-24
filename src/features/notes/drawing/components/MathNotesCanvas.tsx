import { View } from "react-native";
import type { PanResponderInstance } from "react-native";

import type { NotesStyles } from "../../styles/notesStyleTypes";
import type { CalculatorTheme } from "@features/theme";
import { PencilKitCanvas } from "../../platform/ios/PencilKitCanvas";
import { TextEntryBar } from "../../text/components/TextEntryBar";
import type { NotePage, NoteTool, Stroke } from "../../types";
import { FallbackDrawingCanvas } from "./FallbackDrawingCanvas";

type MathNotesCanvasProps = {
  activeColor: string;
  activePage: NotePage | undefined;
  activeTool: NoteTool;
  canvasZoomEnabled: boolean;
  canvasZoomScale: number;
  drawingStroke: Stroke | null;
  drawingEnabled: boolean;
  notePanResponder: PanResponderInstance;
  nativeToolPickerVisible: boolean;
  onAddTextBlock: () => void;
  onDeleteTextBlock: (blockId: string) => void;
  onSetTextDraft: (text: string) => void;
  onUpdatePencilKitDrawing: (drawingData: string) => void;
  styles: NotesStyles;
  textDraft: string;
  theme: CalculatorTheme;
};

export function MathNotesCanvas({
  activeColor,
  activePage,
  activeTool,
  canvasZoomEnabled,
  canvasZoomScale,
  drawingStroke,
  drawingEnabled,
  notePanResponder,
  nativeToolPickerVisible,
  onAddTextBlock,
  onDeleteTextBlock,
  onSetTextDraft,
  onUpdatePencilKitDrawing,
  styles,
  textDraft,
  theme,
}: MathNotesCanvasProps) {
  return (
    <>
      <View style={styles.notesCanvasWrap}>
        {PencilKitCanvas ? (
          <PencilKitCanvas
            drawingEnabled={drawingEnabled}
            drawingData={activePage?.pencilKitData ?? ""}
            onDrawingChange={(event) => onUpdatePencilKitDrawing(event.nativeEvent.drawingData)}
            style={styles.notesCanvas}
            toolPickerVisible={nativeToolPickerVisible}
            zoomEnabled={canvasZoomEnabled}
            zoomScale={canvasZoomScale}
          />
        ) : (
          <FallbackDrawingCanvas
            activeColor={activeColor}
            activePage={activePage}
            activeTool={activeTool}
            canvasZoomScale={canvasZoomScale}
            drawingStroke={drawingStroke}
            drawingEnabled={drawingEnabled}
            notePanResponder={notePanResponder}
            onDeleteTextBlock={onDeleteTextBlock}
            styles={styles}
            theme={theme}
          />
        )}
      </View>

      {!PencilKitCanvas && activeTool === "text" && (
        <TextEntryBar
          onAddTextBlock={onAddTextBlock}
          onSetTextDraft={onSetTextDraft}
          styles={styles}
          textDraft={textDraft}
        />
      )}
    </>
  );
}
