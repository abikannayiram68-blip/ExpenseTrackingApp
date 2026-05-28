// src/navigation/stacks/IncomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IncomeListScreen from '@screens/income/IncomeListScreen';
import AddIncomeScreen from '@screens/income/AddIncomeScreen';
import type { IncomeStackParamList } from '@constants/types';

const Stack = createNativeStackNavigator<IncomeStackParamList>();

const IncomeStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="IncomeList" component={IncomeListScreen} />
    <Stack.Screen name="AddIncome" component={AddIncomeScreen} />
  </Stack.Navigator>
);

export default IncomeStackNavigator;
