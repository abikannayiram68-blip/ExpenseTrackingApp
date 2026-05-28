// src/navigation/stacks/ExpenseStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ExpenseListScreen from '@screens/expenses/ExpenseListScreen';
import AddExpenseScreen from '@screens/expenses/AddExpenseScreen';
import ExpenseDetailScreen from '@screens/expenses/ExpenseDetailScreen';
import type { ExpenseStackParamList } from '@constants/types';

const Stack = createNativeStackNavigator<ExpenseStackParamList>();

const ExpenseStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ExpenseList" component={ExpenseListScreen} />
    <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
    <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
  </Stack.Navigator>
);

export default ExpenseStackNavigator;
