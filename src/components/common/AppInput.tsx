// src/components/common/AppInput.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@constants/theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
}

const AppInput = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  secureTextEntry,
  required,
  ...props
}: AppInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const borderColor = error
    ? Colors.error
    : isFocused
    ? Colors.primary
    : Colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={[styles.inputWrapper, { borderColor }]}>
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon as any}
            size={20}
            color={isFocused ? Colors.primary : Colors.textTertiary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          {...props}
          secureTextEntry={isSecure}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          style={[styles.input, leftIcon && styles.inputWithLeft, (rightIcon || secureTextEntry) && styles.inputWithRight]}
          placeholderTextColor={Colors.textTertiary}
        />

        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={styles.rightIcon}>
            <MaterialCommunityIcons
              name={isSecure ? 'eye-off' : 'eye'}
              size={20}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <MaterialCommunityIcons name={rightIcon as any} size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.base },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  required: { color: Colors.error },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
  },
  inputWithLeft: { paddingLeft: Spacing.sm },
  inputWithRight: { paddingRight: Spacing.sm },
  leftIcon: { marginLeft: Spacing.md },
  rightIcon: { paddingRight: Spacing.md },
  error: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  hint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

export default AppInput;
