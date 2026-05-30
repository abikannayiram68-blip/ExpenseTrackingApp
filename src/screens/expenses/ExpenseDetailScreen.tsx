import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ExpenseStackParamList } from '@constants/types';

import expenseService from '@services/expenseService';
import { useExpenses } from '@context/ExpenseContext';
import { useAuth } from '@context/AuthContext';
import { formatCurrency, formatDate } from '@utils/index';
import { Colors, Typography, Spacing, BorderRadius } from '@constants/theme';

const ExpenseDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ExpenseStackParamList>>();
  const route = useRoute();
  const { deleteExpense } = useExpenses();
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expenseId = (route.params as any)?.expenseId as number;

  useEffect(() => {
    if (!expenseId) return;
    setLoading(true);
    expenseService
      .getById(expenseId)
      .then(setExpense)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to find expense.'))
      .finally(() => setLoading(false));
  }, [expenseId]);

  const handleDelete = () => {
    Alert.alert('Delete expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExpense(expenseId);
            Toast.show({ type: 'success', text1: 'Expense deleted.' });
            navigation.goBack();
          } catch (err) {
            Toast.show({ type: 'error', text1: 'Unable to delete expense.' });
          }
        },
      },
    ]);
  };

  if (loading || !expense) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>{error ? error : 'Loading expense...'}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Expense Details</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Close</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.amountRow}>
          <Text style={styles.amount}>{formatCurrency(expense.amount, 'INR')}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Expense</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="calendar" size={18} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{formatDate(expense.date)}</Text>
        </View>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="tag" size={18} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{expense.description}</Text>
        </View>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="credit-card" size={18} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{expense.paymentMethod}</Text>
        </View>
        <Text style={styles.notesLabel}>Notes</Text>
        <Text style={styles.notes}>{expense.notes || 'No notes provided.'}</Text>
      </View>

      <View style={styles.actionsRow}>
        <AppButton title="Edit" onPress={() => navigation.navigate('AddExpense', { expenseId })} style={styles.actionButton} />
        <AppButton title="Delete" variant="outline" onPress={handleDelete} style={styles.actionButton} />
      </View>
    </ScrollView>
  );
};

const AppButton = ({ title, onPress, variant = 'primary', style }: any) => (
  <Pressable onPress={onPress} style={[styles.actionCustomButton, variant === 'outline' && styles.outlineButton, style]}>
    <Text style={[styles.actionCustomText, variant === 'outline' && styles.outlineText]}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: Spacing.base, paddingBottom: Spacing['2xl'] },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  heading: { fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary },
  cancel: { color: Colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.base, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 } },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { fontSize: Typography.fontSize['4xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary },
  statusBadge: { backgroundColor: Colors.expense, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  statusText: { color: '#fff', fontWeight: Typography.fontWeight.semiBold, fontSize: Typography.fontSize.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
  metaText: { marginLeft: Spacing.xs, color: Colors.textSecondary },
  notesLabel: { marginTop: Spacing.lg, fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semiBold, color: Colors.textSecondary },
  notes: { marginTop: Spacing.sm, color: Colors.textPrimary, lineHeight: 22 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing['2xl'] },
  actionButton: { flex: 1, marginHorizontal: Spacing.xs },
  actionCustomButton: { flex: 1, backgroundColor: Colors.primary, padding: Spacing.base, borderRadius: BorderRadius.md, alignItems: 'center' },
  actionCustomText: { color: '#fff', fontWeight: Typography.fontWeight.semiBold },
  outlineButton: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.primary },
  outlineText: { color: Colors.primary },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textSecondary },
});

export default ExpenseDetailScreen;
