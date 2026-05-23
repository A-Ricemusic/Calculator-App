import { useState } from "react";
import { View } from "react-native";

import type { NotesStyles } from "../styles/notesStyleTypes";
import type { AppMode } from "@app/appModes";
import type { CalculatorTheme } from "@features/theme";
import { MathNotesCanvas } from "../drawing/components/MathNotesCanvas";
import { useReactNativeDrawing } from "../drawing/hooks/useReactNativeDrawing";
import { NotesHeader } from "../navigation/components/NotesHeader";
import { NotesManagerSheet } from "../navigation/components/NotesManagerSheet";
import { NotesPageControls } from "../navigation/components/NotesPageControls";
import { useMathNotesNotebook } from "../notebook/hooks/useMathNotesNotebook";
import { PencilKitCanvas } from "../platform/ios/PencilKitCanvas";
import { NotesColorPicker } from "../toolbar/components/NotesColorPicker";
import { NotesToolbar } from "../toolbar/components/NotesToolbar";
import { NotesUtensilToggle } from "../toolbar/components/NotesUtensilToggle";
import { NotesZoomControls } from "../toolbar/components/NotesZoomControls";
import type { NoteTool } from "../types";

type MathNotesScreenProps = {
  onSelectMode: (mode: AppMode) => void;
  styles: NotesStyles;
  theme: CalculatorTheme;
};

const minimumCanvasZoom = 0.75;
const maximumCanvasZoom = 2.5;
const canvasZoomStep = 0.25;

export function MathNotesScreen({ onSelectMode, styles, theme }: MathNotesScreenProps) {
  const [notesManagerOpen, setNotesManagerOpen] = useState(false);
  const [utensilsOpen, setUtensilsOpen] = useState(true);
  const [canvasZoomScale, setCanvasZoomScale] = useState(1);
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

  function toggleUtensils() {
    setUtensilsOpen((open) => {
      const nextOpen = !open;

      if (nextOpen) {
        setCanvasZoomScale(1);
      } else {
        setColorPickerOpen(false);
      }

      return nextOpen;
    });
  }

  function zoomCanvas(direction: -1 | 1) {
    setCanvasZoomScale((scale) =>
      Math.min(maximumCanvasZoom, Math.max(minimumCanvasZoom, scale + direction * canvasZoomStep)),
    );
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
        canvasZoomEnabled={!utensilsOpen}
        canvasZoomScale={canvasZoomScale}
        drawingStroke={drawingStroke}
        drawingEnabled={utensilsOpen}
        nativeToolPickerVisible={utensilsOpen && !notesManagerOpen}
        notePanResponder={notePanResponder}
        onAddTextBlock={addTextBlock}
        onDeleteTextBlock={deleteTextBlock}
        onSetTextDraft={setTextDraft}
        onUpdatePencilKitDrawing={updatePencilKitDrawing}
        styles={styles}
        textDraft={textDraft}
        theme={theme}
      />

      {utensilsOpen && !PencilKitCanvas && (
        <NotesToolbar
          activeColor={activeColor}
          activeTool={activeTool}
          onSelectTool={selectTool}
          onToggleColorPicker={() => setColorPickerOpen((open) => !open)}
          styles={styles}
        />
      )}

      <NotesUtensilToggle isOpen={utensilsOpen} onToggle={toggleUtensils} styles={styles} />

      {!utensilsOpen && (
        <NotesZoomControls
          onZoomIn={() => zoomCanvas(1)}
          onZoomOut={() => zoomCanvas(-1)}
          styles={styles}
          zoomScale={canvasZoomScale}
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
