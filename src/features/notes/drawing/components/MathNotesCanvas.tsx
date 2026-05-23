import { View } from "react-native";
import type { PanResponderInstance } from "react-native";

import type { AppStyles } from "../../../../app/appTypes";
import type { CalculatorTheme } from "../../../theme";
import { PencilKitCanvas } from "../../platform/ios/PencilKitCanvas";
import { TextEntryBar } from "../../text/components/TextEntryBar";
import type { NotePage, NoteTool, Stroke } from "../../types";
import { FallbackDrawingCanvas } from "./FallbackDrawingCanvas";

type MathNotesCanvasProps = {
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

export function MathNotesCanvas({
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
}: MathNotesCanvasProps) {
  return (
    <>
      <View style={styles.notesCanvasWrap}>
        {PencilKitCanvas ? (
          <PencilKitCanvas
            drawingData={activePage?.pencilKitData ?? ""}
            onDrawingChange={(event) => onUpdatePencilKitDrawing(event.nativeEvent.drawingData)}
            style={styles.notesCanvas}
          />
        ) : (
          <FallbackDrawingCanvas
            activeColor={activeColor}
            activePage={activePage}
            activeTool={activeTool}
            drawingStroke={drawingStroke}
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
