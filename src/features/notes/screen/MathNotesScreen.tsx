import { useState } from "react";
import { View } from "react-native";

import type { AppStyles } from "../../../app/appTypes";
import type { AppMode } from "../../../app/appModes";
import type { CalculatorTheme } from "../../theme";
import { MathNotesCanvas } from "../drawing/components/MathNotesCanvas";
import { useReactNativeDrawing } from "../drawing/hooks/useReactNativeDrawing";
import { NotesHeader } from "../navigation/components/NotesHeader";
import { NotesManagerSheet } from "../navigation/components/NotesManagerSheet";
import { NotesPageControls } from "../navigation/components/NotesPageControls";
import { useMathNotesNotebook } from "../notebook/hooks/useMathNotesNotebook";
import { PencilKitCanvas } from "../platform/ios/PencilKitCanvas";
import { NotesColorPicker } from "../toolbar/components/NotesColorPicker";
import { NotesToolbar } from "../toolbar/components/NotesToolbar";
import type { NoteTool } from "../types";

type MathNotesScreenProps = {
  onSelectMode: (mode: AppMode) => void;
  styles: AppStyles;
  theme: CalculatorTheme;
};

export function MathNotesScreen({ onSelectMode, styles, theme }: MathNotesScreenProps) {
  const [notesManagerOpen, setNotesManagerOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<NoteTool>("pen");
  const [activeColor, setActiveColor] = useState("#ffffff");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const {
    activeCollection,
    activeCollectionIndex,
    activePage,
    activePageIndex,
    activePages,
    addPage,
    addTextBlock,
    changePage,
    createNewCollection,
    deleteActivePage,
    deleteCollection,
    deleteTextBlock,
    noteCollections,
    saveNotebookSnapshot,
    selectCollection,
    setTextDraft,
    textDraft,
    updateActivePage,
    updatePencilKitDrawing,
  } = useMathNotesNotebook();
  const { drawingStroke, notePanResponder, resetDrawingStroke } = useReactNativeDrawing({
    activeCollectionIndex,
    activeColor,
    activePageIndex,
    activeTool,
    noteCollections,
    updateActivePage,
  });

  function openCollection(collectionIndex: number) {
    selectCollection(collectionIndex);
    resetDrawingStroke();
    setNotesManagerOpen(false);
  }

  function openNotesManager() {
    setColorPickerOpen(false);
    setNotesManagerOpen(true);
  }

  function selectTool(tool: NoteTool) {
    setActiveTool(tool);
    setColorPickerOpen(false);
  }

  function selectColor(color: string) {
    setActiveColor(color);
    setColorPickerOpen(false);
  }

  return (
    <View style={styles.notesContainer}>
      <NotesHeader
        activePageIndex={activePageIndex}
        activePagesCount={activePages.length}
        onBack={() => onSelectMode("basic")}
        onOpenManager={openNotesManager}
        onSave={saveNotebookSnapshot}
        styles={styles}
        title={activeCollection?.title ?? "Math Notes"}
      />

      <NotesPageControls
        activePageIndex={activePageIndex}
        activePagesCount={activePages.length}
        onAddPage={addPage}
        onChangePage={changePage}
        onDeleteActivePage={deleteActivePage}
        styles={styles}
      />

      <MathNotesCanvas
        activeColor={activeColor}
        activePage={activePage}
        activeTool={activeTool}
        drawingStroke={drawingStroke}
        notePanResponder={notePanResponder}
        onAddTextBlock={addTextBlock}
        onDeleteTextBlock={deleteTextBlock}
        onSetTextDraft={setTextDraft}
        onUpdatePencilKitDrawing={updatePencilKitDrawing}
        styles={styles}
        textDraft={textDraft}
        theme={theme}
      />

      {!PencilKitCanvas && (
        <NotesToolbar
          activeColor={activeColor}
          activeTool={activeTool}
          onSelectTool={selectTool}
          onToggleColorPicker={() => setColorPickerOpen((open) => !open)}
          styles={styles}
        />
      )}

      {notesManagerOpen && (
        <NotesManagerSheet
          activeCollectionIndex={activeCollectionIndex}
          noteCollections={noteCollections}
          onClose={() => setNotesManagerOpen(false)}
          onCreateCollection={() => createNewCollection(() => setNotesManagerOpen(false))}
          onDeleteCollection={deleteCollection}
          onOpenCollection={openCollection}
          styles={styles}
        />
      )}

      {colorPickerOpen && (
        <NotesColorPicker
          activeColor={activeColor}
          onClose={() => setColorPickerOpen(false)}
          onSelectColor={selectColor}
          styles={styles}
        />
      )}
    </View>
  );
}
