import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import AppInput from '@components/common/AppInput';
import AppButton from '@components/common/AppButton';
import { useAuth } from '@context/AuthContext';
import budgetService from '@services/budgetService';
import { validateAmount } from '@utils/index';
import { Colors, Typography, Spacing } from '@constants/theme';
import type { BudgetStackParamList } from '@constants/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const AddBudgetScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<BudgetStackParamList>>();
  const { user } = useAuth();
  const now = new Date();
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState((now.getMonth() + 1).toString());
  const [year, setYear] = useState(now.getFullYear().toString());
  const [alertAt, setAlertAt] = useState('80');
  const [loading, setLoading] = useState(false);

  const budgetId = (route.params as any)?.budgetId as number | undefined;

  useEffect(() => {
    if (!budgetId) return;
    setLoading(true);
    budgetService
      .getById(budgetId)
      .then((item) => {
        setAmount(item.amount.toString());
        setMonth(item.month.toString());
        setYear(item.year.toString());
        setAlertAt(item.alertAt.toString());
      })
      .catch(() => Toast.show({ type: 'error', text1: 'Unable to load budget.' }))
      .finally(() => setLoading(false));
  }, [budgetId]);

  const handleSubmit = async () => {
    if (!user) {
      Toast.show({ type: 'error', text1: 'Login required.' });
      return;
    }

    if (!validateAmount(amount) || !month || !year || Number(month) < 1 || Number(month) > 12 || Number(year) < 2000) {
      Toast.show({ type: 'error', text1: 'Please enter a valid amount, month, and year.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        amount: Number(amount),
        month: Number(month),
        year: Number(year),
        alertAt: Number(alertAt) || 80,
      };

      if (budgetId) {
        await budgetService.update(budgetId, payload);
        Toast.show({ type: 'success', text1: 'Budget updated.' });
      } else {
        await budgetService.create(user.id, payload);
        Toast.show({ type: 'success', text1: 'Budget created.' });
      }
      navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Unable to save budget.', text2: err instanceof Error ? err.message : undefined });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{budgetId ? 'Edit Budget' : 'Create Budget'}</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>

      <AppInput label="Amount" placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="numeric" required />
      <AppInput label="Month" placeholder="1-12" value={month} onChangeText={setMonth} keyboardType="numeric" required />
      <AppInput label="Year" placeholder="2025" value={year} onChangeText={setYear} keyboardType="numeric" required />
      <AppInput label="Alert Threshold (%)" placeholder="80" value={alertAt} onChangeText={setAlertAt} keyboardType="numeric" required />

      <AppButton title={budgetId ? 'Update Budget' : 'Save Budget'} onPress={handleSubmit} loading={loading} style={styles.button} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.base, backgroundColor: Colors.background, paddingBottom: Spacing['2xl'] },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  heading: { fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary },
  cancel: { color: Colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  button: { marginTop: Spacing.lg },
});

export default AddBudgetScreen;
