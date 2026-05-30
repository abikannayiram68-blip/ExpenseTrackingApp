import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import AppInput from '@components/common/AppInput';
import AppButton from '@components/common/AppButton';
import { useAuth } from '@context/AuthContext';
import { validateEmail } from '@utils/index';
import { Colors, Typography, Spacing } from '@constants/theme';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { forgotPassword, error, isLoading, clearError } = useAuth();
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    clearError();
    if (!validateEmail(email)) {
      Toast.show({ type: 'error', text1: 'Please enter a valid email address.' });
      return;
    }

    try {
      await forgotPassword(email);
      Toast.show({ type: 'success', text1: 'Reset instructions sent to your email.' });
      navigation.navigate('Login' as never);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Request failed',
        text2: err instanceof Error ? err.message : 'Unable to proceed',
      });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Forgot Password</Text>
        <Text style={styles.subheading}>Enter your email to receive password reset instructions.</Text>

        <AppInput
          label="Email"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />

        <AppButton
          title="Send Reset Link"
          onPress={handleReset}
          loading={isLoading}
          disabled={isLoading || !email}
          style={styles.button}
        />

        <Pressable onPress={() => navigation.navigate('Login' as never)}>
          <Text style={styles.link}>Back to login</Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing['2xl'], justifyContent: 'center', flexGrow: 1 },
  heading: { fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  subheading: { fontSize: Typography.fontSize.md, color: Colors.textSecondary, marginBottom: Spacing['2xl'], lineHeight: 22 },
  button: { marginBottom: Spacing.lg },
  link: { color: Colors.primary, textAlign: 'center', marginTop: Spacing.base, fontWeight: Typography.fontWeight.semiBold },
  error: { marginTop: Spacing.sm, color: Colors.error, textAlign: 'center' },
});

export default ForgotPasswordScreen;
