import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import AppInput from '@components/common/AppInput';
import AppButton from '@components/common/AppButton';
import { useExpenses } from '@context/ExpenseContext';
import { useCategories } from '@context/CategoryContext';
import expenseService from '@services/expenseService';
import { useAuth } from '@context/AuthContext';
import { PAYMENT_METHODS } from '@constants/index';
import { validateAmount } from '@utils/index';
import { Colors, Typography, Spacing, BorderRadius } from '@constants/theme';
import type { ExpenseStackParamList } from '@constants/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const AddExpenseScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<ExpenseStackParamList>>();
  const { user } = useAuth();
  const { addExpense, updateExpense } = useExpenses();
  const { categories } = useCategories();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('Add Expense');

  const expenseId = (route.params as any)?.expenseId as number | undefined;

  useEffect(() => {
    if (!expenseId || !user) return;
    setTitle('Edit Expense');
    (async () => {
      try {
        const expense = await expenseService.getById(expenseId);
        setAmount(expense.amount.toString());
        setDescription(expense.description);
        setNotes(expense.notes ?? '');
        setDate(expense.date);
        setPaymentMethod(expense.paymentMethod);
        setSelectedCategory(expense.categoryId);
      } catch {
        Toast.show({ type: 'error', text1: 'Unable to load expense.' });
      }
    })();
  }, [expenseId, user]);

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type !== 'income'),
    [categories]
  );

  const handleSave = async () => {
    if (!validateAmount(amount)) {
      Toast.show({ type: 'error', text1: 'Enter a valid amount.' });
      return;
    }
    if (!description.trim()) {
      Toast.show({ type: 'error', text1: 'Description is required.' });
      return;
    }
    if (!selectedCategory) {
      Toast.show({ type: 'error', text1: 'Select a category.' });
      return;
    }
    if (!user) {
      Toast.show({ type: 'error', text1: 'Authentication required.' });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        amount: Number(amount),
        categoryId: selectedCategory,
        description,
        date,
        paymentMethod: paymentMethod as any,
        notes: notes.trim(),
      };

      if (expenseId) {
        await updateExpense(expenseId, payload);
        Toast.show({ type: 'success', text1: 'Expense updated successfully.' });
      } else {
        await addExpense(payload);
        Toast.show({ type: 'success', text1: 'Expense added successfully.' });
      }

      navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Save failed', text2: err instanceof Error ? err.message : undefined });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{title}</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>

      <AppInput label="Amount" placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="numeric" required leftIcon="currency-inr" />
      <AppInput label="Description" placeholder="What was it for?" value={description} onChangeText={setDescription} required leftIcon="text" />

      <View style={styles.sectionLabel}>
        <Text style={styles.sectionTitle}>Category</Text>
      </View>
      <View style={styles.categoryGrid}>
        {expenseCategories.map((category) => (
          <Pressable
            key={category.id}
            style={[styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <MaterialCommunityIcons name={category.icon as any} size={20} color={selectedCategory === category.id ? '#fff' : category.color} />
            <Text style={[styles.categoryLabel, selectedCategory === category.id && styles.categoryLabelActive]}>{category.name}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.rowInputs}>
        <AppInput label="Date" placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} style={styles.halfInput} leftIcon="calendar" />
        <AppInput
          label="Payment"
          placeholder="Cash, Card, UPI"
          value={paymentMethod}
          onChangeText={setPaymentMethod}
          style={styles.halfInput}
          leftIcon="credit-card"
        />
      </View>

      <AppInput label="Notes" placeholder="Optional note" value={notes} onChangeText={setNotes} leftIcon="note-outline" />

      <AppButton title={expenseId ? 'Update Expense' : 'Add Expense'} onPress={handleSave} loading={isSaving} style={styles.button} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.base, backgroundColor: Colors.background, paddingBottom: Spacing['2xl'] },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  heading: { fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary },
  cancel: { color: Colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  sectionLabel: { marginTop: Spacing.base, marginBottom: Spacing.sm },
  sectionTitle: { color: Colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.base },
  categoryButton: { flexDirection: 'row', alignItems: 'center', padding: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, marginRight: Spacing.sm, marginBottom: Spacing.sm },
  categoryButtonActive: { backgroundColor: Colors.primary },
  categoryLabel: { marginLeft: Spacing.xs, color: Colors.textPrimary },
  categoryLabelActive: { color: Colors.textInverse },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.base },
  halfInput: { flex: 1 },
  button: { marginTop: Spacing.lg },
});

export default AddExpenseScreen;
