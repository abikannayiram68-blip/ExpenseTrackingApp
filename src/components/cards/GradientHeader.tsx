// src/components/cards/GradientHeader.tsx
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '@constants/theme';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: [string, string];
  rightAction?: ReactNode;
  showBack?: boolean;
  children?: ReactNode;
}

export const GradientHeader = ({
  title,
  subtitle,
  gradient = Colors.gradients.primary as [string, string],
  rightAction,
  showBack = false,
  children,
}: GradientHeaderProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.row}>
        {showBack && (
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </Pressable>
        )}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightAction && <View>{rightAction}</View>}
      </View>
      {children}
    </LinearGradient>
  );
};

// ─── Summary Card ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: string;
  color: string;
  currency?: string;
  trend?: number;
}

export const SummaryCard = ({
  title,
  amount,
  icon,
  color,
  currency = '₹',
  trend,
}: SummaryCardProps) => (
  <View style={[cardStyles.card, { borderLeftColor: color }]}>
    <View style={[cardStyles.iconWrap, { backgroundColor: color + '20' }]}>
      <MaterialCommunityIcons name={icon as any} size={22} color={color} />
    </View>
    <View style={cardStyles.info}>
      <Text style={cardStyles.title}>{title}</Text>
      <Text style={[cardStyles.amount, { color }]}>
        {currency}{amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
      </Text>
      {trend !== undefined && (
        <View style={cardStyles.trendRow}>
          <MaterialCommunityIcons
            name={trend >= 0 ? 'trending-up' : 'trending-down'}
            size={14}
            color={trend >= 0 ? Colors.income : Colors.expense}
          />
          <Text style={[cardStyles.trendText, { color: trend >= 0 ? Colors.income : Colors.expense }]}>
            {Math.abs(trend)}% vs last month
          </Text>
        </View>
      )}
    </View>
  </View>
);

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

export const SkeletonCard = () => (
  <View style={skeletonStyles.card}>
    <View style={skeletonStyles.circle} />
    <View style={skeletonStyles.lines}>
      <View style={[skeletonStyles.line, { width: '40%' }]} />
      <View style={[skeletonStyles.line, { width: '60%', height: 20 }]} />
    </View>
  </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onPress: () => void };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <View style={emptyStyles.container}>
    <MaterialCommunityIcons name={icon as any} size={64} color={Colors.textTertiary} />
    <Text style={emptyStyles.title}>{title}</Text>
    <Text style={emptyStyles.description}>{description}</Text>
    {action && (
      <Pressable onPress={action.onPress} style={emptyStyles.action}>
        <Text style={emptyStyles.actionText}>{action.label}</Text>
      </Pressable>
    )}
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: Spacing.md, padding: Spacing.xs },
  titleBlock: { flex: 1 },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#fff',
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    flex: 1,
    marginHorizontal: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  info: { flex: 1 },
  title: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginBottom: 2 },
  amount: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  trendText: { fontSize: Typography.fontSize.xs, marginLeft: 2 },
});

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border,
    marginRight: Spacing.md,
  },
  lines: { flex: 1 },
  line: {
    height: 14,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
});

const emptyStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing['3xl'] },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.base,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  action: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 50,
  },
  actionText: { color: '#fff', fontWeight: Typography.fontWeight.semiBold },
});
