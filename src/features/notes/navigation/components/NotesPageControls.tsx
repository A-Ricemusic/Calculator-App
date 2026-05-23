import { Pressable, Text, View } from 'react-native';

import type { AppStyles } from '../../../../app/appTypes';
import { maxPagesPerNotebook } from '../../notebook/constants/notebookLimits';

type NotesPageControlsProps = {
  activePageIndex: number;
  activePagesCount: number;
  onAddPage: () => void;
  onChangePage: (direction: -1 | 1) => void;
  onDeleteActivePage: () => void;
  styles: AppStyles;
};

export function NotesPageControls({
  activePageIndex,
  activePagesCount,
  onAddPage,
  onChangePage,
  onDeleteActivePage,
  styles,
}: NotesPageControlsProps) {
  return (
    <View style={styles.notesPageControlsBar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Previous page"
        disabled={activePageIndex === 0}
        onPress={() => onChangePage(-1)}
        style={[styles.notesPageIconBtn, activePageIndex === 0 && styles.notesPageBtnDisabled]}
      >
        <Text style={styles.notesPageIconText}>‹</Text>
      </Pressable>
      <View style={styles.notesPageStatus}>
        <Text style={styles.notesPageStatusText}>
          Page {(activePageIndex + 1).toString().padStart(2, '0')} of {activePagesCount.toString().padStart(2, '0')}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Next page"
        disabled={activePageIndex === activePagesCount - 1}
        onPress={() => onChangePage(1)}
        style={[
          styles.notesPageIconBtn,
          activePageIndex === activePagesCount - 1 && styles.notesPageBtnDisabled,
        ]}
      >
        <Text style={styles.notesPageIconText}>›</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create new page"
        disabled={activePagesCount >= maxPagesPerNotebook}
        onPress={onAddPage}
        style={[
          styles.notesPageActionBtn,
          activePagesCount >= maxPagesPerNotebook && styles.notesNewPageBtnDisabled,
        ]}
      >
        <Text style={styles.notesPageActionText}>
          {activePagesCount >= maxPagesPerNotebook ? '20 Max' : '+ Page'}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Delete current page"
        onPress={onDeleteActivePage}
        style={styles.notesPageDeleteBtn}
      >
        <Text style={styles.notesPageDeleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}
