# PHASES OVERVIEW

This phased plan divides the ExpenseTrackingApp work into distinct, non-overlapping delivery slices.
Each phase delivers usable value and builds toward the full system defined in `REQUIREMENTS.md`.

## Phase 1 — MVP Core App
- Focus: user authentication, expense tracking, local persistence, and basic app shell.
- Deliverables:
  - User register/login/logout flows
  - Local secure token storage
  - Expense CRUD with list and detail views
  - Auth-gated navigation between auth and main stacks
  - Splash screen and basic theme support
  - Local fallback storage via `LocalDatabase`

## Phase 2 — Financial Management Expansion
- Focus: complete income/budget/category management, analytics, UI polish, and user preferences.
- Deliverables:
  - Income CRUD with listing and reporting
  - Budget CRUD and budget usage tracking
  - Category creation and selection for expenses/income
  - Dashboard aggregation and analytics charts
  - Theme mode selection (dark/light/system)
  - Toast notifications, validation, empty-state handling
  - Improved navigation and app-wide UX consistency

## Phase 3 — Backend Integration & Hardening
- Focus: backend API implementation, synchronization, token refresh, and production readiness.
- Deliverables:
  - REST API backend for auth, expenses, income, budgets, categories, analytics
  - JWT access/refresh token flow with Axios interceptor refresh
  - Secure backend token storage and logout cleanup
  - Network error handling, request queuing, and retry behavior
  - Expo EAS build configuration validation for Android/iOS/web
  - Testing and documentation completeness
