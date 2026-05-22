import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { menuItems } from '../constants/menuItems';
import { themes } from '../constants/themes';
import type { Mode } from '../types/calculator';
import type { ThemeId } from '../types/theme';
import type { createStyles } from '../styles/createAppStyles';

type DrawerMenuProps = {
  mode: Mode;
  onClose: () => void;
  onSelectMode: (mode: Mode) => void;
  onSelectTheme: (themeId: ThemeId) => void;
  styles: ReturnType<typeof createStyles>;
  themeId: ThemeId;
};

const themeItems = Object.values(themes);

export function DrawerMenu({
  mode,
  onClose,
  onSelectMode,
  onSelectTheme,
  styles,
  themeId,
}: DrawerMenuProps) {
  return (
    <View style={styles.overlay}>
      <Pressable style={styles.scrim} onPress={onClose} />
      <View style={styles.drawer}>
        <SafeAreaView style={styles.drawerInner}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Calculator</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              onPress={onClose}
              style={styles.drawerCloseButton}
            >
              <Text style={styles.drawerCloseIcon}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.drawerContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.drawerSectionLabel}>MODE</Text>
            <View style={styles.drawerSection}>
              {menuItems.map((item, index) => {
                const active = item.mode === mode;
                const isLast = index === menuItems.length - 1;
                return (
                  <Pressable
                    key={item.label}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    disabled={!item.mode}
                    onPress={() => item.mode && onSelectMode(item.mode)}
                    style={[styles.menuItem, !isLast && styles.menuItemBorder]}
                  >
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <Text style={[styles.menuText, active && styles.menuTextActive]}>
                      {item.label}
                    </Text>
                    {active && <Text style={styles.menuCheck}>✓</Text>}
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.drawerSectionLabel}>THEME</Text>
            <View style={styles.drawerSection}>
              {themeItems.map((item, index) => {
                const active = item.id === themeId;
                const isLast = index === themeItems.length - 1;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => onSelectTheme(item.id)}
                    style={[styles.menuItem, !isLast && styles.menuItemBorder]}
                  >
                    <View style={styles.themeDot}>
                      <View style={[styles.themeDotInner, { backgroundColor: item.colors.buttonOperator }]} />
                    </View>
                    <Text style={[styles.menuText, active && styles.menuTextActive]}>
                      {item.label}
                    </Text>
                    {active && <Text style={styles.menuCheck}>✓</Text>}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}
