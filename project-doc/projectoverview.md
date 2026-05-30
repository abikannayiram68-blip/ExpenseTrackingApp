# Project Overview

ExpenseTrackingApp is a React Native mobile app built with Expo. The app helps users track expenses, income, budgets, categories, and analytics. It uses TypeScript, React Navigation, Context API, and Axios for network requests.

## Main Purpose

- Let users log expenses and income.
- Show summaries and charts for spending and savings.
- Allow user login, register, and secure sessions.
- Support budget tracking and category management.

## App Structure

- `App.tsx` — app entry point.
- `app.json` and `eas.json` — Expo app and build settings.
- `src/` — main source code.
- `src/navigation/` — app navigation and screen flows.
- `src/screens/` — screen components for auth, dashboard, expenses, income, budget, analytics, and profile.
- `src/context/` — global state management using React Context.
- `src/services/` — API calls, auth, expense, income, budget, and analytics services.
- `src/components/` — reusable UI components and shared controls.
- `src/constants/` — app constants, theme data, and type definitions.
- `src/utils/` — helper functions for dates, currency, and validation.

## Key Screens

- Login and Register
- Forgot Password
- Dashboard with summary cards and charts
- Expense list and add expense
- Income list and add income
- Budget list and add budget
- Category list and add category
- Analytics screen
- Profile screen

## Technology Stack

- Frontend: React Native with Expo
- Language: TypeScript
- Navigation: React Navigation
- UI: React Native Paper, custom components
- Storage: SecureStore for auth tokens
- HTTP: Axios
- Build: Expo EAS for APK builds

## Notes

- The project includes a `database/schema.sql` file for backend database structure.
- The app is ready for both development and building a preview APK.
