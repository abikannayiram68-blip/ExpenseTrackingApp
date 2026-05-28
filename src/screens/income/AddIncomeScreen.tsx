import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import AppInput from '@components/common/AppInput';
import AppButton from '@components/common/AppButton';
import incomeService from '@services/incomeService';
import { useAuth } from '@context/AuthContext';
import { formatDate, validateAmount } from '@utils/index';
import { Colors, Typography, Spacing } from '@constants/theme';
import type { IncomeStackParamList } from '@constants/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const AddIncomeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<IncomeStackParamList>>();
  const { user } = useAuth();
  const [source, setSource] = useState('Salary');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  const incomeId = (route.params as any)?.incomeId as number | undefined;

  useEffect(() => {
    if (!incomeId) return;
    setLoading(true);
    incomeService
      .getById(incomeId)
      .then((item) => {
        setSource(item.source);
        setAmount(item.amount.toString());
        setNotes(item.notes ?? '');
        setDate(item.date);
      })
      .catch(() => Toast.show({ type: 'error', text1: 'Unable to load income item.' }))
      .finally(() => setLoading(false));
  }, [incomeId]);

  const handleSubmit = async () => {
    if (!user) {
      Toast.show({ type: 'error', text1: 'Login required.' });
      return;
    }
    if (!validateAmount(amount) || !source.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields.' });
      return;
    }

    setLoading(true);
    try {
      const payload = { source, amount: Number(amount), date, notes: notes.trim() };
      if (incomeId) {
        await incomeService.update(incomeId, payload);
        Toast.show({ type: 'success', text1: 'Income updated.' });
      } else {
        await incomeService.create(user.id, payload);
        Toast.show({ type: 'success', text1: 'Income added.' });
      }
      navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Unable to save income.', text2: err instanceof Error ? err.message : undefined });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{incomeId ? 'Edit Income' : 'Add Income'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <AppInput label="Source" placeholder="Salary, Freelance, Bonus" value={source} onChangeText={setSource} required />
      <AppInput label="Amount" placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="numeric" required />
      <AppInput label="Date" placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} required />
      <AppInput label="Notes" placeholder="Optional note" value={notes} onChangeText={setNotes} />

      <AppButton title={incomeId ? 'Update Income' : 'Add Income'} onPress={handleSubmit} loading={loading} style={styles.button} />
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

export default AddIncomeScreen;
