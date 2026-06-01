# Phase 1 — MVP Core App

## Goal
Deliver a minimal, usable expense tracking mobile app with core authentication, expense management, and local persistence.

## Scope
- Authentication flows
  - Register user with name, email, password
  - Login with email and password
  - Logout action
  - Password reset placeholder / forgot password flow
- Persistence
  - Store user/session data securely with `expo-secure-store`
  - Persist auth state across app launches
  - Local fallback storage using `AsyncStorage` via `LocalDatabase`
- Expense management
  - Add, edit, delete expenses
  - List expenses with basic filtering and pagination
- Navigation
  - Auth stack for login/register/forgot password
  - Main app stack guarded by auth state
  - Splash screen during initialization
- UI
  - Basic React Native Paper styling
  - Toast feedback for auth and expense actions

## Deliverables
- Working auth-based app shell
- Expense CRUD screens
- Local offline-ready data persistence
- Auth-gated root navigator

## Exclusions
- Income CRUD
- Budget CRUD
- Analytics charts
- Full backend integration
- Advanced theme modes beyond basic support
