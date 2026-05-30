import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ExpenseStackParamList } from '@constants/types';

import { useExpenses } from '@context/ExpenseContext';
import { useCategories } from '@context/CategoryContext';
import AppButton from '@components/common/AppButton';
import { EmptyState } from '@components/cards/GradientHeader';
import { Colors, Typography, Spacing, BorderRadius } from '@constants/theme';
import { formatCurrency, formatDate } from '@utils/index';

const ExpenseListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ExpenseStackParamList>>();
  const { expenses, isLoading, error, refresh, setFilters, clearFilters } = useExpenses();
  const { categories } = useCategories();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    setFilters({ search: query, categoryId: selectedCategory ?? undefined, page: 1 });
  }, [query, selectedCategory, setFilters]);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type !== 'income'),
    [categories]
  );

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('ExpenseDetail', { expenseId: item.id })}
    >
      <View style={styles.leftIcon}>
        <MaterialCommunityIcons name="cash-minus" size={22} color={Colors.textInverse} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{item.description || 'Expense'}</Text>
        <Text style={styles.subtitle}>{formatDate(item.date)}</Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(item.amount, 'INR')}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Expenses</Text>
        <AppButton title="Add" onPress={() => navigation.navigate('AddExpense')} size="sm" />
      </View>

      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={22} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>

      <View style={styles.categoryRow}>
        <Pressable
          style={[styles.categoryChip, selectedCategory === null && styles.categoryChipActive]}
          onPress={() => {
            setSelectedCategory(null);
            clearFilters();
          }}
        >
          <Text style={[styles.categoryChipText, selectedCategory === null && styles.categoryChipTextActive]}>All</Text>
        </Pressable>
        {filteredCategories.map((category) => (
          <Pressable
            key={category.id}
            style={[styles.categoryChip, selectedCategory === category.id && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[styles.categoryChipText, selectedCategory === category.id && styles.categoryChipTextActive]}>{category.name}</Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : expenses.length ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onRefresh={refresh}
          refreshing={isLoading}
        />
      ) : (
        <EmptyState
          icon="receipt"
          title="No expenses found"
          description="Track your spending to see it appear here."
          action={{ label: 'Add Expense', onPress: () => navigation.navigate('AddExpense') }}
        />
      )}

      <AppButton
        title="Add Expense"
        onPress={() => navigation.navigate('AddExpense')}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.base },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  heading: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, marginBottom: Spacing.base, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 } },
  searchInput: { flex: 1, marginLeft: Spacing.sm, color: Colors.textPrimary },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.base },
  categoryChip: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, marginRight: Spacing.xs, marginBottom: Spacing.xs },
  categoryChipActive: { backgroundColor: Colors.primary },
  categoryChipText: { color: Colors.textSecondary },
  categoryChipTextActive: { color: '#fff' },
  listContent: { paddingBottom: 120 },
  card: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, marginBottom: Spacing.sm, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 } },
  leftIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.base },
  body: { flex: 1 },
  title: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semiBold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  amount: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold, color: Colors.expense },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: Spacing['2xl'] },
  fab: { position: 'absolute', right: Spacing.base, bottom: Spacing.base, width: 140, borderRadius: BorderRadius.full },
});

export default ExpenseListScreen;
