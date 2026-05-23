import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import type { CalculatorStyles } from "../styles/calculatorStyleTypes";
import type { CalculatorHistoryEntry } from "../types";

type CalculatorHistoryProps = {
  history: CalculatorHistoryEntry[];
  onClose: () => void;
  onClear: () => void;
  onLoad: (entry: CalculatorHistoryEntry) => void;
  styles: CalculatorStyles;
  visible: boolean;
};

export function CalculatorHistory({
  history,
  onClear,
  onClose,
  onLoad,
  styles,
  visible,
}: CalculatorHistoryProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.historyOverlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close calculator history"
          onPress={onClose}
          style={styles.historyBackdrop}
        />
        <View style={styles.historySheet}>
          <View style={styles.historyGrabber} />
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>History</Text>
            <View style={styles.historyActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear calculator history"
                disabled={history.length === 0}
                onPress={onClear}
                style={({ pressed }) => [
                  styles.historyClearButton,
                  history.length === 0 && styles.historyClearButtonDisabled,
                  pressed && history.length > 0 && styles.buttonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.historyClearText,
                    history.length === 0 && styles.historyClearTextDisabled,
                  ]}
                >
                  Clear
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close calculator history"
                onPress={onClose}
                style={({ pressed }) => [
                  styles.historyCloseButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.historyCloseText}>×</Text>
              </Pressable>
            </View>
          </View>

          {history.length === 0 ? (
            <View style={styles.historyEmptyState}>
              <Text style={styles.historyEmptyIcon}>↺</Text>
              <Text style={styles.historyEmpty}>No History</Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.historyList}
            >
              {history.map((entry) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Load ${entry.expression} equals ${entry.result}`}
                  key={entry.id}
                  onPress={() => onLoad(entry)}
                  style={({ pressed }) => [styles.historyItem, pressed && styles.buttonPressed]}
                >
                  <Text numberOfLines={1} style={styles.historyExpression}>
                    {entry.expression}
                  </Text>
                  <Text numberOfLines={1} style={styles.historyResult}>
                    {entry.result}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
