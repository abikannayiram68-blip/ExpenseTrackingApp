import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

import { useAuth } from '@context/AuthContext';
import authService from '@services/authService';
import AppInput from '@components/common/AppInput';
import AppButton from '@components/common/AppButton';
import { Colors, Typography, Spacing, BorderRadius } from '@constants/theme';
import { CURRENCIES } from '@constants/index';

const ProfileScreen = () => {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setCurrency(user.currency || 'INR');
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updatedUser = await authService.updateProfile({ name: name.trim(), email: email.trim(), currency });
      updateUser(updatedUser);
      Toast.show({ type: 'success', text1: 'Profile updated successfully.' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to update profile.', text2: err instanceof Error ? err.message : undefined });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match.' });
      return;
    }
    setChangingPassword(true);
    try {
      await authService.changePassword(newPassword.trim());
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Toast.show({ type: 'success', text1: 'Password updated.' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Unable to change password.', text2: err instanceof Error ? err.message : undefined });
    } finally {
      setChangingPassword(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert('Sign out', 'Do you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.subtitle}>Manage your account details and security settings.</Text>

      <AppInput label="Name" value={name} onChangeText={setName} required />
      <AppInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" required />
      <Text style={styles.sectionLabel}>Preferred Currency</Text>
      <View style={styles.currencyRow}>
        {CURRENCIES.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.currencyOption, currency === option.value && styles.currencyOptionActive]}
            onPress={() => setCurrency(option.value)}
          >
            <Text style={[styles.currencyText, currency === option.value && styles.currencyTextActive]}>{option.value}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <AppButton title="Save Profile" onPress={handleSaveProfile} loading={saving} style={styles.button} />

      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>Security</Text>
      <AppInput label="Current password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
      <AppInput label="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
      <AppInput label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <AppButton title="Change Password" onPress={handleChangePassword} loading={changingPassword} style={styles.button} />

      <AppButton title="Log Out" onPress={confirmLogout} variant="outline" style={[styles.button, styles.logoutButton]} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.base, backgroundColor: Colors.background, paddingBottom: Spacing['2xl'] },
  heading: { fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.extraBold, color: Colors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { color: Colors.textSecondary, marginBottom: Spacing.base },
  sectionLabel: { color: Colors.textSecondary, marginBottom: Spacing.sm },
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.base },
  currencyOption: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.base, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, marginRight: Spacing.sm, marginBottom: Spacing.sm },
  currencyOptionActive: { backgroundColor: Colors.primary },
  currencyText: { color: Colors.textPrimary },
  currencyTextActive: { color: Colors.textInverse },
  sectionDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing['2xl'] },
  sectionTitle: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, marginBottom: Spacing.base },
  button: { marginBottom: Spacing.base },
  logoutButton: { borderColor: Colors.error },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { color: Colors.textSecondary },
});

export default ProfileScreen;
