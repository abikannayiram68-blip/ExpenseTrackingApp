import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { IncomeStackParamList } from '@constants/types';

import { useAuth } from '@context/AuthContext';
import incomeService from '@services/incomeService';
import AppButton from '@components/common/AppButton';
import { formatCurrency, formatDate } from '@utils/index';
import { Colors, Typography, Spacing, BorderRadius } from '@constants/theme';
import { EmptyState } from '@components/cards/GradientHeader';

const IncomeListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<IncomeStackParamList>>();
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const loadIncomes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await incomeService.getAll(user.id, { search: query, page: 1, limit: 50 });
      setIncomes(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadIncomes();
  }, [user, query]);

  const renderItem = ({ item }: { item: any }) => (
    <Pressable style={styles.card} onPress={() => navigation.navigate('AddIncome', { incomeId: item.id })}>
      <View style={styles.leftIcon}>
        <MaterialCommunityIcons name="cash-plus" size={22} color={Colors.textInverse} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{item.source}</Text>
        <Text style={styles.subtitle}>{formatDate(item.date)}</Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(item.amount, user?.currency ?? 'INR')}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Income</Text>
        <AppButton title="Add" onPress={() => navigation.navigate('AddIncome')} size="sm" />
      </View>

      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={22} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search income"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : incomes.length ? (
        <FlatList
          data={incomes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          icon="cash-plus"
          title="No income entries"
          description="Log your income to get a complete financial picture."
          action={{ label: 'Add Income', onPress: () => navigation.navigate('AddIncome') }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.base },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  heading: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, marginBottom: Spacing.base, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 } },
  searchInput: { flex: 1, marginLeft: Spacing.sm, color: Colors.textPrimary },
  listContent: { paddingBottom: Spacing['2xl'] },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.base, marginBottom: Spacing.sm, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 } },
  leftIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.income, marginRight: Spacing.base },
  body: { flex: 1 },
  title: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semiBold, color: Colors.textPrimary },
  subtitle: { marginTop: 4, fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  amount: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold, color: Colors.income },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default IncomeListScreen;
