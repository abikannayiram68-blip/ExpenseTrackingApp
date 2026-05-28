// src/constants/theme.ts

export const Colors = {
  // Brand
  primary: '#6C63FF',
  primaryDark: '#4A42D6',
  primaryLight: '#8B84FF',
  secondary: '#FF6B8A',
  accent: '#00D4AA',

  // Semantic
  income: '#00C48C',
  expense: '#FF647C',
  budget: '#FFA26B',
  savings: '#0095FF',

  // Backgrounds
  background: '#F8F9FE',
  surface: '#FFFFFF',
  surfaceVariant: '#F0EFFF',
  card: '#FFFFFF',

  // Text
  textPrimary: '#1A1D3B',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Status
  success: '#00C48C',
  warning: '#FFAB2E',
  error: '#FF647C',
  info: '#0095FF',

  // Borders & Dividers
  border: '#E5E7EB',
  divider: '#F3F4F6',

  // Dark Mode
  dark: {
    background: '#0F0F1A',
    surface: '#1A1D2E',
    surfaceVariant: '#252840',
    card: '#1E2235',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#2D3155',
  },

  // Chart Colors
  chart: ['#6C63FF', '#FF6B8A', '#00D4AA', '#FFA26B', '#0095FF', '#FFAB2E', '#8B5CF6'],

  // Gradients (use with expo-linear-gradient)
  gradients: {
    primary: ['#6C63FF', '#8B84FF'],
    secondary: ['#FF6B8A', '#FF8FA3'],
    income: ['#00C48C', '#00E5A8'],
    expense: ['#FF647C', '#FF8FA3'],
    dark: ['#1A1D3B', '#2D3155'],
    card: ['#6C63FF', '#4A42D6'],
  },
};

export const Typography = {
  // Font families - using system fonts (add custom via expo-font if needed)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },

  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const APP_CONFIG = {
  apiTimeout: 15000,
  tokenKey: 'auth_token',
  userKey: 'user_data',
  onboardingKey: 'has_onboarded',
};
