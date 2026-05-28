import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import AppInput from '@components/common/AppInput';
import AppButton from '@components/common/AppButton';
import { useAuth } from '@context/AuthContext';
import { validateEmail, validatePassword } from '@utils/index';
import { Colors, Typography, Spacing } from '@constants/theme';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register, error, isLoading, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    clearError();
    if (!name || !validateEmail(email)) {
      Toast.show({ type: 'error', text1: 'Please enter a valid name and email.' });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      Toast.show({ type: 'error', text1: passwordError });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match.' });
      return;
    }

    try {
      await register({ name, email, password, confirmPassword });
      Toast.show({ type: 'success', text1: 'Account created successfully!' });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: err instanceof Error ? err.message : 'Unable to create account',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create an account</Text>
        <Text style={styles.subheading}>Start tracking expenses, income and budgets with ease.</Text>

        <AppInput label="Full Name" placeholder="Enter your name" value={name} onChangeText={setName} required />
        <AppInput
          label="Email"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />
        <AppInput
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
        />
        <AppInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          required
        />

        <AppButton
          title="Register"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading || !name || !email || !password || !confirmPassword}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing['2xl'], justifyContent: 'center', flexGrow: 1 },
  heading: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.extraBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subheading: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing['2xl'],
    lineHeight: 22,
  },
  button: { marginBottom: Spacing.lg },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.sm },
  footerText: { color: Colors.textSecondary, marginRight: Spacing.xs },
  link: { color: Colors.primary, fontWeight: Typography.fontWeight.semiBold },
  error: { marginTop: Spacing.sm, color: Colors.error, textAlign: 'center' },
});

export default RegisterScreen;
