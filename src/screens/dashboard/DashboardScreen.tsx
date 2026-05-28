import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import analyticsService from '@services/analyticsService';
import { useAuth } from '@context/AuthContext';
import { formatCurrency, formatDate } from '@utils/index';
import { GradientHeader, SummaryCard, EmptyState } from '@components/cards/GradientHeader';
import { Colors, Typography, Spacing } from '@constants/theme';
import type { DashboardSummary } from '@constants/types';
import { LineChart, PieChart } from 'react-native-chart-kit';

const chartWidth = Dimensions.get('window').width - Spacing['2xl'];

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [stats, setStats] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const dashboard = await analyticsService.getDashboard(user.id);
      setSummary(dashboard);
      const monthly = await analyticsService.getMonthlyStats(user.id, 6);
      setLabels(monthly.map((item) => item.month));
      setStats(monthly.map((item) => item.totalExpense));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSummary();
  }, [user]);

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionIcon}>
        <MaterialCommunityIcons
          name={item.type === 'expense' ? 'arrow-down-circle' : 'arrow-up-circle'}
          size={22}
          color={item.type === 'expense' ? Colors.expense : Colors.income}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.description}</Text>
        <Text style={styles.transactionSubtitle}>{formatDate(item.date)}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.type === 'expense' ? Colors.expense : Colors.income }]}> 
        {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount, user?.currency ?? 'INR')}
      </Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GradientHeader title="Dashboard" subtitle="Your financial snapshot" />

      <View style={styles.cardsRow}>
        <SummaryCard title="Balance" amount={summary?.totalBalance ?? 0} icon="currency-inr" color={Colors.primary} currency={user?.currency === 'USD' ? '$' : '₹'} trend={summary ? Math.round((summary.totalIncome - summary.totalExpense) / (summary.totalIncome || 1) * 100) : 0} />
        <SummaryCard title="Income" amount={summary?.totalIncome ?? 0} icon="wallet-plus" color={Colors.income} currency={user?.currency === 'USD' ? '$' : '₹'} />
      </View>

      <View style={styles.cardsRow}>
        <SummaryCard title="Expense" amount={summary?.totalExpense ?? 0} icon="wallet-minus" color={Colors.expense} currency={user?.currency === 'USD' ? '$' : '₹'} />
        <SummaryCard title="Budget" amount={summary?.monthlyBudget ?? 0} icon="chart-donut" color={Colors.budget} currency={user?.currency === 'USD' ? '$' : '₹'} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly trends</Text>
        <LineChart
          data={{ labels, datasets: [{ data: stats }] }}
          width={chartWidth}
          height={220}
          withShadow={false}
          withDots={true}
          withInnerLines={false}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => Colors.primary,
            labelColor: () => Colors.textSecondary,
            propsForDots: { r: '4', fill: Colors.primary },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent transactions</Text>
        {summary?.recentTransactions.length ? (
          <FlatList
            data={summary.recentTransactions}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            renderItem={renderTransaction}
            scrollEnabled={false}
          />
        ) : (
          <EmptyState
            icon="database-refresh"
            title="Nothing yet"
            description="Add expenses or income to view recent activity."
            action={{ label: 'Add Expense', onPress: () => navigation.navigate('Expenses' as never) }}
          />
        )}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Expenses' as never)}>
          <MaterialCommunityIcons name="receipt" size={24} color={Colors.primary} />
          <Text style={styles.actionLabel}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Income' as never)}>
          <MaterialCommunityIcons name="cash-plus" size={24} color={Colors.income} />
          <Text style={styles.actionLabel}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Budget' as never)}>
          <MaterialCommunityIcons name="piggy-bank" size={24} color={Colors.budget} />
          <Text style={styles.actionLabel}>Budget</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing['2xl'] },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing['2xl'] },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: Spacing.base, marginTop: Spacing.base },
  section: { marginTop: Spacing['2xl'], paddingHorizontal: Spacing.base },
  sectionTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semiBold, color: Colors.textPrimary, marginBottom: Spacing.md },
  chart: { borderRadius: 20 },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  },
  transactionIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4FF', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.base },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semiBold, color: Colors.textPrimary },
  transactionSubtitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  transactionAmount: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.base, marginTop: Spacing['2xl'] },
  actionCard: {
    width: '30%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.base,
    alignItems: 'center',
    ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  },
  actionLabel: { marginTop: Spacing.sm, color: Colors.textPrimary, fontWeight: Typography.fontWeight.semiBold, textAlign: 'center' },
  error: { color: Colors.error, textAlign: 'center', marginTop: Spacing.lg },
});

export default DashboardScreen;
