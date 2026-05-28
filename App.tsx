// App.tsx
import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '@context/AuthContext';
import { ExpenseProvider } from '@context/ExpenseContext';
import { BudgetProvider } from '@context/BudgetContext';
import { CategoryProvider } from '@context/CategoryContext';
import { ThemeProvider, useTheme } from '@context/ThemeContext';
import RootNavigator from '@navigation/RootNavigator';
import { Colors } from '@constants/theme';

// Keep splash screen visible while initializing
SplashScreen.preventAutoHideAsync();

// ─── Inner App (needs ThemeContext) ───────────────────────────────────────────
const AppInner = () => {
  const { isDark } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate any startup tasks (fonts, etc.)
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsReady(true);
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) return null;

  const theme = isDark
    ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, primary: Colors.primary } }
    : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: Colors.primary } };

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthProvider>
          <ExpenseProvider>
            <BudgetProvider>
              <CategoryProvider>
                <RootNavigator />
              </CategoryProvider>
            </BudgetProvider>
          </ExpenseProvider>
        </AuthProvider>
      </View>
      <Toast />
    </PaperProvider>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppInner />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
