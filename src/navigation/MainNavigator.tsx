// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, BorderRadius, Shadows, Typography } from '@constants/theme';
import type { MainTabParamList } from '@constants/types';

// Screen imports
import DashboardScreen from '@screens/dashboard/DashboardScreen';
import ExpenseStackNavigator from './stacks/ExpenseStack';
import IncomeStackNavigator from './stacks/IncomeStack';
import BudgetStackNavigator from './stacks/BudgetStack';
import CategoryStackNavigator from './stacks/CategoryStack';
import ProfileScreen from '@screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

type TabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

const CustomTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'Dashboard', icon: 'view-dashboard', label: 'Home' },
    { name: 'Expenses', icon: 'credit-card-minus', label: 'Expenses' },
    { name: 'Income', icon: 'credit-card-plus', label: 'Income' },
    { name: 'Budget', icon: 'chart-pie', label: 'Budget' },
    { name: 'Categories', icon: 'shape-outline', label: 'Categories' },
    { name: 'Profile', icon: 'account-circle', label: 'Profile' },
  ];

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom + 8 }]}>
      {state.routes.map((route: any, index: number) => {
        const tab = tabs[index];
        const isFocused = state.index === index;

        return (
          <Pressable
            key={route.key}
            style={styles.tabItem}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
          >
            {isFocused && <View style={styles.activeIndicator} />}
            <MaterialCommunityIcons
              name={tab.icon as any}
              size={24}
              color={isFocused ? Colors.primary : Colors.textTertiary}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

// ─── Navigator ────────────────────────────────────────────────────────────────

const MainNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Expenses" component={ExpenseStackNavigator} />
    <Tab.Screen name="Income" component={IncomeStackNavigator} />
    <Tab.Screen name="Budget" component={BudgetStackNavigator} />
    <Tab.Screen name="Categories" component={CategoryStackNavigator} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingTop: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.md,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 32,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  tabLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default MainNavigator;
