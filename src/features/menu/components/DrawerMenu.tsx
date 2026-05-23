import { useState } from "react";
import { Platform, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { menuItems } from "../constants/menuItems";
import { themes } from "@features/theme";
import type { AppMode } from "@app/appModes";
import type { ThemeId } from "@features/theme";
import type { DrawerStyles } from "../styles/drawerStyleTypes";

const ANDROID_TOP_INSET = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;
type DrawerView = "menu" | "theme";

type DrawerMenuProps = {
  mode: AppMode;
  onClose: () => void;
  onSelectMode: (mode: AppMode) => void;
  onSelectTheme: (themeId: ThemeId) => void;
  styles: DrawerStyles;
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
  const [drawerView, setDrawerView] = useState<DrawerView>("menu");
  const selectedTheme = themes[themeId];
  const isThemeView = drawerView === "theme";

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.scrim} onPress={onClose} />
      <View style={styles.drawer}>
        <SafeAreaView
          style={[
            styles.drawerInner,
            ANDROID_TOP_INSET > 0 && { paddingTop: ANDROID_TOP_INSET + 12 },
          ]}
        >
          <View style={styles.drawerHeader}>
            {isThemeView ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to menu"
                onPress={() => setDrawerView("menu")}
                style={styles.drawerBackButton}
              >
                <Text style={styles.drawerBackIcon}>{"<"}</Text>
              </Pressable>
            ) : null}
            <Text style={styles.drawerTitle}>{isThemeView ? "Theme" : "Calculator"}</Text>
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
            {isThemeView ? (
              <>
                <Text style={styles.drawerSectionLabel}>THEMES</Text>
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
                          <View
                            style={[
                              styles.themeDotInner,
                              { backgroundColor: item.colors.buttonOperator },
                            ]}
                          />
                        </View>
                        <View style={styles.menuTextStack}>
                          <Text style={[styles.menuText, active && styles.menuTextActive]}>
                            {item.label}
                          </Text>
                          <Text style={styles.menuSubtext}>{item.colors.buttonOperator}</Text>
                        </View>
                        {active && <Text style={styles.menuCheck}>✓</Text>}
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : (
              <>
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

                <View style={styles.drawerSection}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setDrawerView("theme")}
                    style={styles.menuItem}
                  >
                    <Text style={styles.menuIcon}>◐</Text>
                    <View style={styles.menuTextStack}>
                      <Text style={styles.menuText}>Theme</Text>
                      <Text style={styles.menuSubtext}>{selectedTheme.label}</Text>
                    </View>
                    <Text style={styles.menuCheck}>{">"}</Text>
                  </Pressable>
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}
