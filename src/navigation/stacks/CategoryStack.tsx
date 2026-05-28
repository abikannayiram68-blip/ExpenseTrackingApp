import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CategoryListScreen from '@screens/categories/CategoryListScreen';
import AddCategoryScreen from '@screens/categories/AddCategoryScreen';
import type { CategoryStackParamList } from '@constants/types';

const Stack = createNativeStackNavigator<CategoryStackParamList>();

const CategoryStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CategoryList" component={CategoryListScreen} />
    <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
  </Stack.Navigator>
);

export default CategoryStackNavigator;
