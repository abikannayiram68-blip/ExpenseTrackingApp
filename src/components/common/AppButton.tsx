// src/components/common/AppButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@constants/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
}

const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
}: AppButtonProps) => {
  const sizeStyles = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.base, fontSize: Typography.fontSize.sm },
    md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, fontSize: Typography.fontSize.md },
    lg: { paddingVertical: Spacing.base, paddingHorizontal: Spacing['2xl'], fontSize: Typography.fontSize.lg },
  };

  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[styles.base, { opacity: isDisabled ? 0.6 : 1 }, style]}
      >
        <LinearGradient
          colors={Colors.gradients.primary as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, { paddingVertical: sizeStyles[size].paddingVertical, paddingHorizontal: sizeStyles[size].paddingHorizontal }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.row}>
              {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
              <Text style={[styles.primaryText, { fontSize: sizeStyles[size].fontSize }, textStyle]}>
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyle = {
    secondary: styles.secondary,
    outline: styles.outline,
    ghost: styles.ghost,
    danger: styles.danger,
  }[variant];

  const variantTextStyle = {
    secondary: styles.secondaryText,
    outline: styles.outlineText,
    ghost: styles.ghostText,
    danger: styles.dangerText,
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        variantStyle,
        { paddingVertical: sizeStyles[size].paddingVertical, paddingHorizontal: sizeStyles[size].paddingHorizontal },
        { opacity: isDisabled ? 0.6 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.primary : '#fff'} size="small" />
      ) : (
        <View style={styles.row}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[styles.baseText, { fontSize: sizeStyles[size].fontSize }, variantTextStyle, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  gradient: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconLeft: { marginRight: Spacing.sm },
  baseText: {
    fontWeight: Typography.fontWeight.semiBold,
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.textInverse,
    fontWeight: Typography.fontWeight.semiBold,
  },
  secondary: { backgroundColor: Colors.surfaceVariant },
  secondaryText: { color: Colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
  outlineText: { color: Colors.primary },
  ghost: { backgroundColor: 'transparent' },
  ghostText: { color: Colors.primary },
  danger: { backgroundColor: Colors.error },
  dangerText: { color: Colors.textInverse },
});

export default AppButton;
