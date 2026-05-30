import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import AppInput from '@components/common/AppInput';
import AppButton from '@components/common/AppButton';
import { useCategories } from '@context/CategoryContext';
import { Colors, Typography, Spacing, BorderRadius } from '@constants/theme';
import type { CategoryStackParamList } from '@constants/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const AddCategoryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<CategoryStackParamList>>();
  const route = useRoute();
  const { categories, addCategory, updateCategory } = useCategories();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('tag');
  const [color, setColor] = useState('#6C63FF');
  const [type, setType] = useState<'expense' | 'income' | 'both'>('expense');
  const [loading, setLoading] = useState(false);

  const categoryId = (route.params as any)?.categoryId as number | undefined;

  useEffect(() => {
    if (!categoryId) return;
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;
    setName(category.name);
    setIcon(category.icon);
    setColor(category.color);
    setType(category.type);
  }, [categoryId, categories]);

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'Category name is required.' });
      return;
    }
    if (!icon.trim()) {
      Toast.show({ type: 'error', text1: 'Select an icon name.' });
      return;
    }

    setLoading(true);
    try {
      if (categoryId) {
        await updateCategory(categoryId, { name: name.trim(), icon: icon.trim(), color, type });
        Toast.show({ type: 'success', text1: 'Category updated.' });
      } else {
        await addCategory({ name: name.trim(), icon: icon.trim(), color, type });
        Toast.show({ type: 'success', text1: 'Category added.' });
      }
      navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Unable to save category.', text2: err instanceof Error ? err.message : undefined });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{categoryId ? 'Edit Category' : 'Add Category'}</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>

      <AppInput label="Name" placeholder="Category name" value={name} onChangeText={setName} required />
      <AppInput label="Icon" placeholder="e.g. cash, food" value={icon} onChangeText={setIcon} required />
      <AppInput label="Color" placeholder="#6C63FF" value={color} onChangeText={setColor} required />

      <Text style={styles.sectionLabel}>Type</Text>
      <View style={styles.typeRow}>
        {(['expense', 'income', 'both'] as const).map((option) => (
          <Pressable
            key={option}
            style={[styles.typeOption, type === option && styles.typeOptionActive]}
            onPress={() => setType(option)}
          >
            <Text style={[styles.typeOptionText, type === option && styles.typeOptionTextActive]}>
              {option === 'both' ? 'Both' : option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <AppButton title={categoryId ? 'Update Category' : 'Save Category'} onPress={handleSave} loading={loading} style={styles.button} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.base, backgroundColor: Colors.background, paddingBottom: Spacing['2xl'] },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  heading: { fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary },
  cancel: { color: Colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  sectionLabel: { color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.base },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.base },
  typeOption: { flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.full, paddingVertical: Spacing.sm, alignItems: 'center', marginRight: Spacing.sm, backgroundColor: Colors.surface },
  typeOptionActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeOptionText: { color: Colors.textPrimary, fontWeight: Typography.fontWeight.medium },
  typeOptionTextActive: { color: Colors.textInverse },
  button: { marginTop: Spacing.lg },
});

export default AddCategoryScreen;
