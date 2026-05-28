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
import { validateEmail } from '@utils/index';
import { Colors, Typography, Spacing } from '@constants/theme';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, error, isLoading, clearError } = useAuth();
  const [email, setEmail] = useState('demo@expenseapp.com');
  const [password, setPassword] = useState('demo123');

  const handleLogin = async () => {
    clearError();
    if (!validateEmail(email)) {
      Toast.show({ type: 'error', text1: 'Invalid email address' });
      return;
    }

    try {
      await login({ email, password });
      Toast.show({ type: 'success', text1: 'Welcome back!' });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: err instanceof Error ? err.message : 'Unable to login',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subheading}>Sign in to manage your expenses and budgets.</Text>

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
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword' as never)}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        <AppButton
          title="Login"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading || !email || !password}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
            <Text style={styles.link}>Create an account</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.demo}>Demo: demo@expenseapp.com / demo123</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Spacing['2xl'],
    justifyContent: 'center',
    flexGrow: 1,
  },
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
  forgot: {
    color: Colors.primary,
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
    fontWeight: Typography.fontWeight.medium,
  },
  button: { marginBottom: Spacing.lg },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  footerText: { color: Colors.textSecondary, marginRight: Spacing.xs },
  link: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  error: {
    marginTop: Spacing.sm,
    color: Colors.error,
    textAlign: 'center',
  },
  demo: {
    marginTop: Spacing['2xl'],
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});

export default LoginScreen;
