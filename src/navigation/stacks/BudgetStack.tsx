// src/navigation/stacks/BudgetStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BudgetListScreen from '@screens/budget/BudgetListScreen';
import AddBudgetScreen from '@screens/budget/AddBudgetScreen';
import AnalyticsScreen from '@screens/analytics/AnalyticsScreen';
import type { BudgetStackParamList } from '@constants/types';

const Stack = createNativeStackNavigator<BudgetStackParamList>();

const BudgetStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BudgetList" component={BudgetListScreen} />
    <Stack.Screen name="AddBudget" component={AddBudgetScreen} />
    <Stack.Screen name="Analytics" component={AnalyticsScreen} />
  </Stack.Navigator>
);

export default BudgetStackNavigator;
