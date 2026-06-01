# Phase 1 — Execution Stages

This execution plan maps the MVP phase into discrete stages with explicit requirements and tests.
Each stage follows the mandatory TDD flow: write tests, run → fail, implement, run → pass, refactor.

## Stage 1: Setup
- REQ-IDs: REQ-029, REQ-030, REQ-039, REQ-050
- TEST-IDs: UT-029-POS, UT-030-POS, UT-039-POS, UT-050-POS
- Tasks:
  1. Install dependencies from `package.json`.
  2. Verify TypeScript build (`npm run type-check`).
  3. Confirm Expo/React Native versions match required stack.
  4. Validate path alias resolution in Babel/tsconfig.
  5. Write tests for env validation and dependency compatibility.

## Stage 2: Architecture
- REQ-IDs: REQ-007, REQ-014, REQ-031, REQ-032
- TEST-IDs: UT-007-POS, UT-014-POS, UT-031-POS, UT-032-POS
- Tasks:
  1. Define root navigation in `RootNavigator.tsx`.
  2. Implement auth and main stack separation.
  3. Create provider composition for app state contexts.
  4. Write tests verifying auth stack selection and module separation.

## Stage 3: Database
- REQ-IDs: REQ-034, REQ-043, REQ-064, REQ-036
- TEST-IDs: UT-034-POS, UT-043-POS, UT-064-POS, UT-036-POS
- Tasks:
  1. Implement `LocalDatabase.initialize()` with seeded defaults.
  2. Add AsyncStorage-based persistence for users, categories, expenses, incomes, budgets.
  3. Write tests confirming persistence, init success, and fail-safe behavior.

## Stage 4: Backend
- REQ-IDs: REQ-044, REQ-049, REQ-036
- TEST-IDs: UT-044-POS, UT-049-POS, UT-036-POS
- Tasks:
  1. Build Axios client skeleton in `src/services/api.ts`.
  2. Add token injection interceptor and configurable `BASE_URL`.
  3. Create local fallback service patterns in `authService.ts` and domain services.
  4. Write tests for interceptor configuration and local backend contract fallback.

## Stage 5: Frontend
- REQ-IDs: REQ-001, REQ-002, REQ-003, REQ-004, REQ-008, REQ-015, REQ-019, REQ-027
- TEST-IDs: UT-001-POS, UT-002-POS, UT-003-POS, UT-004-POS, UT-008-POS, UT-015-POS, UT-019-POS, UT-027-POS
- Tasks:
  1. Implement auth screens: Login, Register, ForgotPassword.
  2. Implement expense screens: ExpenseList, AddExpense, ExpenseDetail.
  3. Add toast notifications for success and failure.
  4. Wrap UI in `PaperProvider` and apply basic theming.
  5. Write component-level tests for screen render and form behavior.

## Stage 6: State
- REQ-IDs: REQ-032, REQ-005, REQ-006, REQ-034, REQ-007
- TEST-IDs: UT-032-POS, UT-005-POS, UT-006-POS, UT-034-POS, UT-007-POS
- Tasks:
  1. Implement `AuthContext` with login/logout/register/forgotPassword.
  2. Implement `ExpenseContext` CRUD operations and pagination.
  3. Persist auth and preferences using secure storage.
  4. Write tests for context consumption, auth persistence, and state updates.

## Stage 7: Auth
- REQ-IDs: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-024, REQ-056
- TEST-IDs: UT-001-POS, UT-002-POS, UT-003-POS, UT-004-POS, UT-005-POS, UT-006-POS, UT-024-POS, UT-056-POS
- Tasks:
  1. Implement registration, login, and logout flows.
  2. Store user and token data securely using `expo-secure-store`.
  3. Handle missing or malformed tokens on startup.
  4. Write auth flow tests ensuring failures are handled gracefully.

## Stage 8: Integration
- REQ-IDs: REQ-007, REQ-008, REQ-035, REQ-046
- TEST-IDs: IT-001, IT-011, IT-011, UT-035-POS, UT-046-POS
- Tasks:
  1. Integrate auth state with root navigation.
  2. Verify expense creation flows through UI, context, and storage.
  3. Confirm splash screen remains until initialization completes.
  4. Write integration tests for login-to-dashboard and startup flows.

## Stage 9: Testing
- REQ-IDs: REQ-029, REQ-038, REQ-051, REQ-052, REQ-053
- TEST-IDs: UT-029-POS, UT-038-POS, UT-051-POS, UT-052-POS, UT-053-POS
- Tasks:
  1. Draft unit tests for auth validation, error normalization, and empty-state UI.
  2. Run tests and confirm failures before implementation.
  3. Implement feature code.
  4. Run tests again and refactor failing or brittle code.

## Stage 10: Deployment
- REQ-IDs: REQ-028, REQ-030, REQ-040, REQ-050
- TEST-IDs: UT-028-POS, UT-030-POS, UT-040-POS, UT-050-POS
- Tasks:
  1. Validate `eas.json` and Expo build configuration.
  2. Confirm app launches in Expo development mode.
  3. Create a preview APK or web build if possible.
  4. Write deployment verification tests against config files.
