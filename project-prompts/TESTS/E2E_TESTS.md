# E2E TESTS

These end-to-end test scenarios simulate real user behavior across the ExpenseTrackingApp.

## E2E-001: New user registration and first login
- TEST-ID: E2E-001
  - REQ-ID: REQ-001, REQ-002, REQ-005
  - Input: user fills registration form with valid details and then logs in
  - Expected output: user account is created, login succeeds, and app navigates to main dashboard.

## E2E-002: Login, add expense, and verify dashboard summary
- TEST-ID: E2E-002
  - REQ-ID: REQ-002, REQ-008, REQ-012
  - Input: authenticated user adds an expense with category and amount
  - Expected output: expense appears in list and dashboard reflects updated expense total.

## E2E-003: Add income and view analytics
- TEST-ID: E2E-003
  - REQ-ID: REQ-009, REQ-013
  - Input: authenticated user adds an income item and opens analytics screen
  - Expected output: income is saved and analytics chart updates with the new dataset.

## E2E-004: Create budget, spend against it, and review budget status
- TEST-ID: E2E-004
  - REQ-ID: REQ-010, REQ-012
  - Input: authenticated user creates budget and adds expense to the budget category
  - Expected output: budget status shows spending progress and dashboard aggregates budget impact.

## E2E-005: Theme toggle and persistence across restart
- TEST-ID: E2E-005
  - REQ-ID: REQ-016, REQ-017, REQ-018
  - Input: user switches from system theme to dark theme and restarts the app
  - Expected output: app opens in dark theme and UI remains consistent.

## E2E-006: Logout and ensure protected routes are blocked
- TEST-ID: E2E-006
  - REQ-ID: REQ-003, REQ-007
  - Input: authenticated user logs out then attempts to access main screen by deep link or back navigation
  - Expected output: app remains on auth stack and main screens are not accessible.

## E2E-007: Forgot password flow from auth screen
- TEST-ID: E2E-007
  - REQ-ID: REQ-004, REQ-019
  - Input: user enters registered email in forgot password screen
  - Expected output: success toast appears and user is guided to authentication flow.

## E2E-008: Registration duplicate email prevents account creation
- TEST-ID: E2E-008
  - REQ-ID: REQ-052
  - Input: user attempts to register with an email already registered
  - Expected output: duplicate email error is displayed and registration does not proceed.

## E2E-009: Invalid login shows correct error message
- TEST-ID: E2E-009
  - REQ-ID: REQ-051, REQ-019
  - Input: user submits incorrect password on login screen
  - Expected output: login fails with explicit invalid credentials message.

## E2E-010: Add and delete an expense
- TEST-ID: E2E-010
  - REQ-ID: REQ-008, REQ-053
  - Input: user creates a new expense then deletes it
  - Expected output: expense appears, then disappears, and empty-state UI returns if no remaining items.

## E2E-011: Create category and assign it to income
- TEST-ID: E2E-011
  - REQ-ID: REQ-011, REQ-009
  - Input: user creates a category, then selects it when adding income
  - Expected output: income record is saved with the new category and category is visible in selectors.

## E2E-012: App behavior when network is offline
- TEST-ID: E2E-012
  - REQ-ID: REQ-036, REQ-038, REQ-055
  - Input: device offline while user performs expense save
  - Expected output: app shows offline error and may preserve local unsaved state gracefully.

## E2E-013: Startup with stored session and theme
- TEST-ID: E2E-013
  - REQ-ID: REQ-005, REQ-018, REQ-034
  - Input: app restarts with valid stored user and dark theme preference
  - Expected output: app opens authenticated and in dark mode.

## E2E-014: Token refresh while using app
- TEST-ID: E2E-014
  - REQ-ID: REQ-022, REQ-023
  - Input: authenticated request receives 401 and refresh succeeds while user continues using app
  - Expected output: app refreshes token transparently and request completes successfully.

## E2E-015: Failed refresh forces logout and login screen
- TEST-ID: E2E-015
  - REQ-ID: REQ-024, REQ-054, REQ-056
  - Input: refresh token invalid during API call
  - Expected output: auth storage clears and user is kicked back to login screen.

## E2E-016: Navigate between all main tabs
- TEST-ID: E2E-016
  - REQ-ID: REQ-014, REQ-025
  - Input: user taps through bottom tabs for dashboard, expenses, income, budget, profile
  - Expected output: each tab loads correctly with layout respecting safe area.

## E2E-017: Analytics screen with no data
- TEST-ID: E2E-017
  - REQ-ID: REQ-013, REQ-053
  - Input: authenticated user opens analytics with no transaction data
  - Expected output: analytics screen shows empty-state or message explaining lack of data.

## E2E-018: Create budget and verify tab navigation consistency
- TEST-ID: E2E-018
  - REQ-ID: REQ-010, REQ-014
  - Input: user creates a budget, switches tabs, returns to budget screen
  - Expected output: created budget persists and tab navigation state remains stable.

## E2E-019: Theme mode invalid storage fallback
- TEST-ID: E2E-019
  - REQ-ID: REQ-016, REQ-017, REQ-058
  - Input: corrupt theme mode value in storage on app launch
  - Expected output: app falls back to default theme and remains usable.

## E2E-020: Full sign-in, expense add, logout, and login again
- TEST-ID: E2E-020
  - REQ-ID: REQ-002, REQ-008, REQ-003, REQ-005
  - Input: user logs in, adds expense, logs out, then logs in again
  - Expected output: expense persists if stored locally, auth state resets on logout, and login succeeds again.
