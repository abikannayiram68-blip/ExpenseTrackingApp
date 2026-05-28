import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@constants/theme';

const SplashScreen = () => (
  <LinearGradient colors={Colors.gradients.primary} style={styles.container}>
    <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
    <View style={styles.content}>
      <MaterialCommunityIcons name="wallet-outline" size={86} color="#fff" />
      <Text style={styles.title}>Expense Tracker</Text>
      <Text style={styles.subtitle}>Securely track expenses, income, budgets and analytics.</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  content: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    marginTop: Spacing.lg,
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.extraBold,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: Spacing.sm,
    fontSize: Typography.fontSize.md,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SplashScreen;
