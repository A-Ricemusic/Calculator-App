import { StyleSheet } from 'react-native';

import type { CalculatorTheme } from '../../theme';

export function createDrawerStyles(theme: CalculatorTheme) {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      flexDirection: 'row',
    },
    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.drawerScrim,
    },
    drawer: {
      backgroundColor: theme.colors.drawerBackground,
      borderBottomRightRadius: 20,
      borderTopRightRadius: 20,
      height: '100%',
      width: '72%',
    },
    drawerInner: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    drawerHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    drawerTitle: {
      color: theme.colors.topText,
      fontSize: 22,
      fontWeight: '700',
    },
    drawerCloseButton: {
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderRadius: 999,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    drawerCloseIcon: {
      color: theme.colors.mutedText,
      fontSize: 14,
      fontWeight: '600',
    },
    drawerContent: {
      paddingBottom: 36,
    },
    drawerSectionLabel: {
      color: theme.colors.mutedText,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.2,
      marginBottom: 6,
      marginTop: 8,
      paddingHorizontal: 4,
    },
    drawerSection: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderRadius: 12,
      marginBottom: 20,
      overflow: 'hidden',
    },
    menuItem: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    menuItemBorder: {
      borderBottomColor: 'rgba(255, 255, 255, 0.08)',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    menuIcon: {
      color: theme.colors.mutedText,
      fontSize: 18,
      marginRight: 14,
      textAlign: 'center',
      width: 28,
    },
    menuText: {
      color: theme.colors.topText,
      flex: 1,
      fontSize: 17,
      fontWeight: '400',
    },
    menuTextActive: {
      fontWeight: '600',
    },
    menuCheck: {
      color: theme.colors.segmentedActive,
      fontSize: 18,
      fontWeight: '600',
    },
    themeDot: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
      width: 28,
    },
    themeDotInner: {
      borderRadius: 999,
      height: 18,
      width: 18,
    },
  });
}

