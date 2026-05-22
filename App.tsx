import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DrawerMenu } from './src/components/DrawerMenu';
import { basicButtons, scientificFnButtons, scientificNumButtons } from './src/constants/calculatorButtons';
import { maxPagesPerNote, noteDots, toolSettings, trayTools, utensilColors } from './src/constants/notes';
import { useCalculator } from './src/hooks/useCalculator';
import { useMathNotes } from './src/hooks/useMathNotes';
import { useThemePreference } from './src/hooks/useThemePreference';
import { createStyles } from './src/styles/createAppStyles';
import { PencilKitCanvas } from './src/native/PencilKitCanvas';
import type { ButtonConfig, Mode } from './src/types/calculator';
import type { NoteTool, Point, Stroke } from './src/types/notes';
import type { ThemeId } from './src/types/theme';
import { createId } from './src/utils/ids';

export default function App() {
  const [mode, setMode] = useState<Mode>('basic');
  const [menuOpen, setMenuOpen] = useState(false);
  const { setThemeId, theme, themeId } = useThemePreference();
  const [notesManagerOpen, setNotesManagerOpen] = useState(false);
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
    deleteCollection,
    deleteTextBlock,
    noteCollections,
    saveNotebookSnapshot,
    selectCollection,
    setTextDraft,
    textDraft,
    updateActivePage,
    updatePencilKitDrawing,
  } = useMathNotes();
  const [activeTool, setActiveTool] = useState<NoteTool>('pen');
  const [activeColor, setActiveColor] = useState('#ffffff');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [drawingStroke, setDrawingStroke] = useState<Stroke | null>(null);
  const drawingStrokeRef = useRef<Stroke | null>(null);
  const { clearLabel, display, handlePress, resetAll } = useCalculator(mode);

  const styles = useMemo(() => createStyles(theme), [theme]);
















  function selectMode(nextMode: Mode) {
    setMode(nextMode);
    setMenuOpen(false);
  }

  function selectTheme(nextThemeId: ThemeId) {
    setThemeId(nextThemeId);
  }









  function openCollection(collectionIndex: number) {
    selectCollection(collectionIndex);
    setDrawingStroke(null);
    drawingStrokeRef.current = null;
    setNotesManagerOpen(false);
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

    drawingStrokeRef.current = null;
    setDrawingStroke(null);
  }

  const notePanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => activeTool !== 'text',
    onPanResponderGrant: beginStroke,
    onPanResponderMove: appendStrokePoint,
    onPanResponderRelease: finishStroke,
    onPanResponderTerminate: finishStroke,
  }), [activeTool, activeColor, activeCollectionIndex, activePageIndex, noteCollections]);



  function renderSciFnButton(button: ButtonConfig) {
    const label = button.action === 'clear' ? clearLabel : button.label;

    return (
      <Pressable
        key={button.label}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => handlePress(button)}
        style={({ pressed }) => [
          styles.sciFnButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          style={styles.sciFnButtonText}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  function renderNumButton(button: ButtonConfig) {
    const label = button.action === 'clear' ? clearLabel : button.label;
    const isScientificMode = mode === 'scientific';

    return (
      <Pressable
        key={button.label}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => handlePress(button)}
        style={({ pressed }) => [
          styles.button,
          isScientificMode && styles.sciNumButton,
          button.wide && styles.buttonWide,
          button.variant === 'utility' && styles.buttonUtility,
          button.variant === 'operator' && styles.buttonOperator,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          style={[
            styles.buttonText,
            isScientificMode && styles.sciNumButtonText,
            button.variant === 'utility' && styles.utilityText,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  function renderStroke(stroke: Stroke) {
    return stroke.points.slice(1).map((point, index) => {
      const previousPoint = stroke.points[index];
      const length = Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y);
      const angle = Math.atan2(point.y - previousPoint.y, point.x - previousPoint.x);

      return (
        <View
          key={`${stroke.id}-${index}`}
          pointerEvents="none"
          style={[
            styles.strokeSegment,
            {
              backgroundColor: stroke.tool === 'eraser' ? theme.colors.screen : stroke.color,
              height: stroke.width,
              left: previousPoint.x,
              opacity: stroke.tool === 'highlighter' ? 0.45 : 1,
              top: previousPoint.y - stroke.width / 2,
              transform: [
                { rotateZ: `${angle}rad` },
                { translateX: length / 2 },
              ],
              width: length,
            },
          ]}
        />
      );
    });
  }

  function renderUtensil(tool: NoteTool, isActive: boolean) {
    const tint = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.55)';
    const band = isActive ? activeColor : 'rgba(255, 255, 255, 0.2)';

    if (tool === 'pen') {
      return (
        <View style={styles.utensilWrap}>
          <View style={[styles.penTip, { borderBottomColor: tint }]} />
          <View style={[styles.penBarrel, { borderColor: band }]} />
          <View style={styles.penGrip} />
        </View>
      );
    }

    if (tool === 'marker') {
      return (
        <View style={styles.utensilWrap}>
          <View style={[styles.markerNib, { backgroundColor: tint }]} />
          <View style={[styles.markerBarrel, { borderColor: band }]} />
        </View>
      );
    }

    if (tool === 'highlighter') {
      return (
        <View style={styles.utensilWrap}>
          <View style={[styles.highlighterTip, { backgroundColor: isActive ? activeColor : 'rgba(255,255,255,0.25)' }]} />
          <View style={[styles.highlighterBarrel, { borderColor: band }]} />
        </View>
      );
    }

    if (tool === 'eraser') {
      return (
        <View style={styles.utensilWrap}>
          <View style={styles.eraserTop} />
          <View style={styles.eraserBody} />
        </View>
      );
    }

    return (
      <View style={styles.utensilWrap}>
        <View style={[styles.textToolBox, { borderColor: tint }]}>
          <Text style={[styles.textToolLetter, { color: tint }]}>T</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <View style={styles.appShell}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open calculator menu"
              onPress={() => setMenuOpen(true)}
              style={styles.iconButton}
            >
              <Text style={styles.iconText}>☰</Text>
            </Pressable>
            {mode === 'scientific' && <Text style={styles.angleLabel}>rad</Text>}
          </View>
          {mode === 'basic' && <Text style={styles.modeTitle}>Calculator</Text>}
          {mode === 'notes' && <Text style={styles.modeTitle}>Math Notes</Text>}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset calculator"
            onPress={resetAll}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>↺</Text>
          </Pressable>
        </View>

        {mode === 'notes' ? (
          <View style={styles.notesContainer}>
            <View style={styles.notesHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to calculator"
                onPress={() => setMode('basic')}
                style={styles.notesBackBtn}
              >
                <Text style={styles.notesBackIcon}>‹</Text>
              </Pressable>
              <View style={styles.notesHeaderCenter}>
                <Text numberOfLines={1} style={styles.notesTitle}>
                  {activeCollection?.title ?? 'Math Notes'}
                </Text>
              </View>
              <Text style={styles.notesPageBadge}>
                {(activePageIndex + 1).toString().padStart(2, '0')}/{activePages.length.toString().padStart(2, '0')}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open notes manager"
                onPress={() => {
                  setColorPickerOpen(false);
                  setNotesManagerOpen(true);
                }}
                style={styles.notesManagerBtn}
              >
                <Text style={styles.notesManagerIcon}>☷</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save notebook"
                onPress={saveNotebookSnapshot}
                style={styles.notesSaveBtn}
              >
                <Text style={styles.notesSaveIcon}>✓</Text>
              </Pressable>
            </View>

            <View style={styles.notesCanvasWrap}>
              {PencilKitCanvas ? (
                <PencilKitCanvas
                  drawingData={activePage?.pencilKitData ?? ''}
                  onDrawingChange={(event) => updatePencilKitDrawing(event.nativeEvent.drawingData)}
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
                  {activePage?.strokes.map((stroke) => renderStroke(stroke))}
                  {drawingStroke && renderStroke(drawingStroke)}
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
                          onPress={() => deleteTextBlock(textBlock.id)}
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
                  onChangeText={setTextDraft}
                  placeholder="Type to add text…"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  style={styles.notesTextInput}
                  value={textDraft}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Add text"
                  onPress={addTextBlock}
                  style={styles.notesTextAddBtn}
                >
                  <Text style={styles.notesTextAddLabel}>Add</Text>
                </Pressable>
              </View>
            )}

            {!PencilKitCanvas && <View style={styles.notesBottomBar}>
              <View style={styles.notesToolRow}>
                {trayTools.map(({ tool, label }) => {
                  const isActive = activeTool === tool;
                  return (
                    <Pressable
                      key={tool}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${tool}`}
                      onPress={() => { setActiveTool(tool); setColorPickerOpen(false); }}
                      style={[
                        styles.notesToolBtn,
                        isActive && styles.notesToolBtnActive,
                      ]}
                    >
                      {renderUtensil(tool, isActive)}
                      <Text style={[styles.utensilLabel, isActive && styles.utensilLabelActive]}>{label}</Text>
                    </Pressable>
                  );
                })}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Pick color"
                  onPress={() => setColorPickerOpen((o) => !o)}
                  style={styles.notesColorBtn}
                >
                  <View style={[styles.notesColorBtnDot, { backgroundColor: activeColor }]} />
                </Pressable>
              </View>

              <View style={styles.notesPageRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Previous page"
                  disabled={activePageIndex === 0}
                  onPress={() => changePage(-1)}
                  style={[styles.notesPageBtn, activePageIndex === 0 && styles.notesPageBtnDisabled]}
                >
                  <Text style={styles.notesPageBtnText}>‹</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Create new page"
                  disabled={activePages.length >= maxPagesPerNote}
                  onPress={addPage}
                  style={[
                    styles.notesNewPageBtn,
                    activePages.length >= maxPagesPerNote && styles.notesNewPageBtnDisabled,
                  ]}
                >
                  <Text style={styles.notesNewPageText}>
                    {activePages.length >= maxPagesPerNote ? '20 Page Max' : '+ New Page'}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Next page"
                  disabled={activePageIndex === activePages.length - 1}
                  onPress={() => changePage(1)}
                  style={[
                    styles.notesPageBtn,
                    activePageIndex === activePages.length - 1 && styles.notesPageBtnDisabled,
                  ]}
                >
                  <Text style={styles.notesPageBtnText}>›</Text>
                </Pressable>
              </View>
            </View>}

            {notesManagerOpen && (
              <View style={styles.notesManagerOverlay}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close notes manager"
                  onPress={() => setNotesManagerOpen(false)}
                  style={styles.notesManagerScrim}
                />
                <View style={styles.notesManagerSheet}>
                  <View style={styles.notesManagerHeader}>
                    <Text style={styles.notesManagerTitle}>Notes</Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Create new note"
                      onPress={() => createNewCollection(() => setNotesManagerOpen(false))}
                      style={styles.notesManagerNewBtn}
                    >
                      <Text style={styles.notesManagerNewText}>+ Note</Text>
                    </Pressable>
                  </View>

                  <ScrollView contentContainerStyle={styles.notesManagerList}>
                    {noteCollections.map((collection, index) => (
                      <View
                        key={collection.id}
                        style={[
                          styles.notesManagerItem,
                          index === activeCollectionIndex && styles.notesManagerItemActive,
                        ]}
                      >
                        <Pressable
                          accessibilityRole="button"
                          accessibilityState={{ selected: index === activeCollectionIndex }}
                          accessibilityLabel={`Open ${collection.title}`}
                          onPress={() => openCollection(index)}
                          style={styles.notesManagerItemMain}
                        >
                          <Text numberOfLines={1} style={styles.notesManagerItemTitle}>
                            {collection.title}
                          </Text>
                          <Text style={styles.notesManagerItemMeta}>
                            {collection.pages.length}/{maxPagesPerNote} pages
                          </Text>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Delete ${collection.title}`}
                          onPress={() => deleteCollection(collection.id)}
                          style={styles.notesManagerDeleteBtn}
                        >
                          <Text style={styles.notesManagerDeleteText}>Delete</Text>
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            {colorPickerOpen && (
              <View style={styles.colorPickerOverlay}>
                <Pressable style={styles.colorPickerScrim} onPress={() => setColorPickerOpen(false)} />
                <View style={styles.colorPickerPanel}>
                  {utensilColors.map((color) => (
                    <Pressable
                      key={color}
                      accessibilityRole="button"
                      accessibilityLabel={`Set color ${color}`}
                      onPress={() => { setActiveColor(color); setColorPickerOpen(false); }}
                      style={[
                        styles.colorPickerDot,
                        { backgroundColor: color },
                        activeColor === color && styles.colorPickerDotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <>
            <View style={[styles.displayPanel, mode === 'scientific' && styles.scientificDisplay]}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.display, mode === 'scientific' && styles.scientificDisplayText]}
              >
                {display}
              </Text>
            </View>

            {mode === 'scientific' && (
              <View style={styles.sciFnSection}>
                {scientificFnButtons.map((row) => (
                  <View key={row.map((b) => b.label).join('-')} style={styles.sciFnRow}>
                    {row.map((button) => renderSciFnButton(button))}
                  </View>
                ))}
              </View>
            )}

            <View style={[styles.keypad, mode === 'scientific' && styles.scientificKeypad]}>
              {(mode === 'basic' ? basicButtons : scientificNumButtons).map((row) => (
                <View key={row.map((b) => b.label).join('-')} style={[styles.row, mode === 'scientific' && styles.sciRow]}>
                  {row.map((button) => renderNumButton(button))}
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      {menuOpen && (
        <DrawerMenu
          mode={mode}
          onClose={() => setMenuOpen(false)}
          onSelectMode={selectMode}
          onSelectTheme={selectTheme}
          styles={styles}
          themeId={themeId}
        />
      )}
    </SafeAreaView>
  );
}
