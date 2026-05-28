import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

import { useAuth } from '@context/AuthContext';
import analyticsService from '@services/analyticsService';
import { Colors, Typography, Spacing, BorderRadius } from '@constants/theme';
import { EmptyState } from '@components/cards/GradientHeader';

const chartWidth = Dimensions.get('window').width - Spacing['2xl'];

const chartConfig = {
  backgroundGradientFrom: Colors.background,
  backgroundGradientTo: Colors.background,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
  labelColor: () => Colors.textSecondary,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: Colors.primary,
  },
};

const AnalyticsScreen = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [activeType, setActiveType] = useState<'expense' | 'income'>('expense');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [dashboard, stats, breakdown] = await Promise.all([
          analyticsService.getDashboard(user.id),
          analyticsService.getMonthlyStats(user.id, 6),
          analyticsService.getCategoryBreakdown(user.id, activeType),
        ]);
        setSummary(dashboard);
        setMonthlyStats(stats);
        setCategoryBreakdown(breakdown);
      } catch {
        setSummary(null);
        setMonthlyStats([]);
        setCategoryBreakdown([]);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [user, activeType]);

  const savingsData = useMemo(
    () => ({
      labels: monthlyStats.map((item) => item.month.slice(0, 3)),
      datasets: [{ data: monthlyStats.map((item) => item.savings) }],
    }),
    [monthlyStats]
  );

  const pieData = useMemo(
    () =>
      categoryBreakdown.map((item) => ({
        name: item.categoryName,
        population: item.total,
        color: item.categoryColor,
        legendFontColor: Colors.textSecondary,
        legendFontSize: 12,
      })),
    [categoryBreakdown]
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Please log in to view analytics.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Analytics</Text>
      <Text style={styles.subtitle}>Track your performance with monthly trends and category breakdowns.</Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: Colors.income }]}> 
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={styles.statValue}>{summary ? `₹${summary.totalBalance.toLocaleString()}` : '0'}</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: Colors.expense }]}> 
          <Text style={styles.statLabel}>Expense</Text>
          <Text style={styles.statValue}>{summary ? `₹${summary.totalExpense.toLocaleString()}` : '0'}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: Colors.income }]}> 
          <Text style={styles.statLabel}>Income</Text>
          <Text style={styles.statValue}>{summary ? `₹${summary.totalIncome.toLocaleString()}` : '0'}</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: Colors.budget }]}> 
          <Text style={styles.statLabel}>Budget</Text>
          <Text style={styles.statValue}>{summary ? `₹${summary.monthlyBudget.toLocaleString()}` : '0'}</Text>
        </View>
      </View>

      {monthlyStats.length ? (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Savings Trend</Text>
          <LineChart
            data={savingsData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            fromZero
          />
        </View>
      ) : (
        <EmptyState icon="chart-line" title="No analytics data" description="Add transactions to populate charts." />
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        <View style={styles.toggleRow}>
          {(['expense', 'income'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setActiveType(type)}
              style={[styles.toggleButton, activeType === type && styles.toggleButtonActive]}
            >
              <Text style={[styles.toggleText, activeType === type && styles.toggleTextActive]}>{type === 'expense' ? 'Expenses' : 'Income'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {pieData.length ? (
        <PieChart
          data={pieData}
          width={chartWidth}
          height={220}
          accessor="population"
          chartConfig={chartConfig}
          backgroundColor="transparent"
          paddingLeft="15"
          center={[0, 0]}
          absolute
        />
      ) : (
        <EmptyState icon="chart-pie" title="No category breakdown" description="Add transactions in the selected category type." />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.base, backgroundColor: Colors.background, paddingBottom: Spacing['2xl'] },
  heading: { fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { color: Colors.textSecondary, marginBottom: Spacing.base },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderLeftWidth: 4, borderRadius: BorderRadius.xl, padding: Spacing.base, marginRight: Spacing.sm, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 } },
  statLabel: { color: Colors.textSecondary, marginBottom: Spacing.xs },
  statValue: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  chartSection: { marginTop: Spacing.lg },
  sectionTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  chart: { borderRadius: BorderRadius.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing['2xl'], marginBottom: Spacing.sm },
  toggleRow: { flexDirection: 'row' },
  toggleButton: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, marginLeft: Spacing.sm },
  toggleButtonActive: { backgroundColor: Colors.primary },
  toggleText: { color: Colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  toggleTextActive: { color: Colors.textInverse },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: Spacing['3xl'], backgroundColor: Colors.background },
  loadingText: { color: Colors.textSecondary },
});

export default AnalyticsScreen;
