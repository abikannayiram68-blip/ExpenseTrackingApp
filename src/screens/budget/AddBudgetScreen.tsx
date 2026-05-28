import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
  const [name, setName] = useState('Monthly Budget');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  const budgetId = (route.params as any)?.budgetId as number | undefined;

  useEffect(() => {
    if (!budgetId) return;
    setLoading(true);
    budgetService
      .getById(budgetId)
      .then((item) => {
        setName(item.name);
        setAmount(item.amount.toString());
        setDeadline(item.deadline);
      })
      .catch(() => Toast.show({ type: 'error', text1: 'Unable to load budget.' }))
      .finally(() => setLoading(false));
  }, [budgetId]);

  const handleSubmit = async () => {
    if (!user) {
      Toast.show({ type: 'error', text1: 'Login required.' });
      return;
    }
    if (!name.trim() || !validateAmount(amount)) {
      Toast.show({ type: 'error', text1: 'Please complete all fields.' });
      return;
    }

    setLoading(true);
    try {
      const payload = { name: name.trim(), amount: Number(amount), deadline };
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <AppInput label="Budget Name" placeholder="e.g. Food, Shopping" value={name} onChangeText={setName} required />
      <AppInput label="Amount" placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="numeric" required />
      <AppInput label="Deadline" placeholder="YYYY-MM-DD" value={deadline} onChangeText={setDeadline} required />

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
