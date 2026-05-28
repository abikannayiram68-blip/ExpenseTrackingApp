import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useCategories } from '@context/CategoryContext';
import AppButton from '@components/common/AppButton';
import { EmptyState } from '@components/cards/GradientHeader';
import { Colors, Typography, Spacing, BorderRadius } from '@constants/theme';
import type { CategoryStackParamList } from '@constants/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const CategoryListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<CategoryStackParamList>>();
  const { categories, isLoading, error, deleteCategory, refresh } = useCategories();

  const grouped = useMemo(
    () => {
      const expense = categories.filter((category) => category.type === 'expense');
      const income = categories.filter((category) => category.type === 'income');
      const both = categories.filter((category) => category.type === 'both');
      return { expense, income, both };
    },
    [categories]
  );

  const confirmDelete = (id: number, isDefault: boolean) => {
    if (isDefault) {
      return;
    }
    Alert.alert('Delete category', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCategory(id);
          await refresh();
        },
      },
    ]);
  };

  const renderCategory = ({ item }: { item: any }) => (
    <View style={styles.categoryRow}>
      <View style={[styles.categoryBadge, { backgroundColor: item.color + '20' }]}> 
        <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryType}>{item.type === 'both' ? 'Expense & Income' : item.type}</Text>
      </View>
      <View style={styles.actions}> 
        <TouchableOpacity onPress={() => navigation.navigate('AddCategory' as never, { categoryId: item.id } as never)}>
          <MaterialCommunityIcons name="pencil" size={20} color={Colors.primary} />
        </TouchableOpacity>
        {!item.isDefault && (
          <TouchableOpacity onPress={() => confirmDelete(item.id, item.isDefault)} style={styles.deleteButton}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Manage Categories</Text>
        <AppButton title="Add" onPress={() => navigation.navigate('AddCategory' as never)} size="sm" />
      </View>

      <Text style={styles.description}>Create custom categories and keep track of where your money goes.</Text>

      {categories.length === 0 && !isLoading ? (
        <EmptyState
          icon="shape-outline"
          title="No categories found"
          description="Add categories to sort income and expenses."
          action={{ label: 'Add Category', onPress: () => navigation.navigate('AddCategory' as never) }}
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategory}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={refresh}
          ListEmptyComponent={!isLoading ? null : undefined}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.base },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  heading: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary },
  description: { color: Colors.textSecondary, marginBottom: Spacing.base },
  listContent: { paddingBottom: Spacing['2xl'] },
  categoryRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 } },
  categoryBadge: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.base },
  categoryInfo: { flex: 1 },
  categoryName: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semiBold, color: Colors.textPrimary },
  categoryType: { marginTop: 4, color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  deleteButton: { marginLeft: Spacing.sm },
  separator: { height: Spacing.sm },
  error: { color: Colors.error, marginTop: Spacing.base, textAlign: 'center' },
});

export default CategoryListScreen;
