// ============================================
// APP ROOT
// React Navigation + Paper Provider + Toast
// ============================================

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/styleConstants';

// Custom Paper theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.bgWhite,
    surface: COLORS.white,
    text: COLORS.gray900,
    error: COLORS.danger,
    notification: COLORS.primary,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
          <StatusBar style="auto" />
          <Toast />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
