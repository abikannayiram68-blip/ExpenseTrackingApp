import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuth } from '@context/AuthContext';
import budgetService from '@services/budgetService';
import AppButton from '@components/common/AppButton';
import { formatCurrency } from '@utils/index';
import { Colors, Typography, Spacing, BorderRadius } from '@constants/theme';
import { EmptyState } from '@components/cards/GradientHeader';

const BudgetListScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBudgets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      setBudgets(await budgetService.getAll(user.id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBudgets();
  }, [user]);

  const renderItem = ({ item }: { item: any }) => {
    const progress = Math.min((item.spent / item.amount) * 100, 100);
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddBudget' as never, { budgetId: item.id } as never)}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.amount}>{formatCurrency(item.amount, user?.currency ?? 'INR')}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.label}>Spent: {formatCurrency(item.spent, user?.currency ?? 'INR')}</Text>
          <Text style={styles.label}>{progress.toFixed(0)}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Budgets</Text>
        <AppButton title="New" onPress={() => navigation.navigate('AddBudget' as never)} size="sm" />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : budgets.length ? (
        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          icon="briefcase-check"
          title="No budgets yet"
          description="Set spending limits to stay on top of your money."
          action={{ label: 'Create budget', onPress: () => navigation.navigate('AddBudget' as never) }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.base },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  heading: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary },
  listContent: { paddingBottom: Spacing['2xl'] },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.base, marginBottom: Spacing.sm, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 } },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semiBold, color: Colors.textPrimary },
  amount: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  label: { color: Colors.textSecondary },
  progressBarBackground: { height: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceSecondary, marginTop: Spacing.sm, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: Colors.primary },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default BudgetListScreen;
