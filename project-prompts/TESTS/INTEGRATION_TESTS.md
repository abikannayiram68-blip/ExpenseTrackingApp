# INTEGRATION TESTS

These tests validate combined app modules, navigation flows, and service interactions.

## IT-001: Login to dashboard flow
- TEST-ID: IT-001
  - REQ-ID: REQ-002, REQ-007, REQ-012
  - Input: valid login credentials and existing dashboard data
  - Expected output: user logs in successfully, app navigates to main stack, dashboard data displays correctly.

## IT-002: Logout clears auth and returns to auth stack
- TEST-ID: IT-002
  - REQ-ID: REQ-003, REQ-007, REQ-024
  - Input: authenticated session then logout action
  - Expected output: auth storage cleared, navigation returns to auth stack, no main screens accessible.

## IT-003: Forgot password from auth screen
- TEST-ID: IT-003
  - REQ-ID: REQ-004, REQ-019
  - Input: registered email submitted on forgot password screen
  - Expected output: success toast shown and screen remains on auth flow.

## IT-004: Theme selection persists across restart
- TEST-ID: IT-004
  - REQ-ID: REQ-017, REQ-018, REQ-034
  - Input: user selects `dark` theme, restarts app
  - Expected output: app restarts in dark theme without requiring reselection.

## IT-005: Token refresh with queued requests
- TEST-ID: IT-005
  - REQ-ID: REQ-022, REQ-023, REQ-060
  - Input: multiple API calls trigger 401 simultaneously while refresh token is valid
  - Expected output: refresh obtains new token, queued requests retry successfully.

## IT-006: Network error surfaces in UI during CRUD
- TEST-ID: IT-006
  - REQ-ID: REQ-008, REQ-038, REQ-055
  - Input: expense save request times out
  - Expected output: user-facing error toast appears and expense is not added.

## IT-007: Empty data displays empty-state screens
- TEST-ID: IT-007
  - REQ-ID: REQ-053, REQ-012, REQ-013
  - Input: fresh authenticated user with no expenses, income, or budgets
  - Expected output: empty-state UI shown on expense, income, and analytics screens.

## IT-008: Category creation and selection
- TEST-ID: IT-008
  - REQ-ID: REQ-011, REQ-008, REQ-009
  - Input: add a new category then attach it to an expense and income item
  - Expected output: category appears in selectors and is saved with both records.

## IT-009: Budget creation with expense impact
- TEST-ID: IT-009
  - REQ-ID: REQ-010, REQ-012
  - Input: create budget and add an expense under that category
  - Expected output: budget list reflects used limit and dashboard aggregates include the budget.

## IT-010: Safe area and gesture navigation integration
- TEST-ID: IT-010
  - REQ-ID: REQ-025, REQ-026, REQ-014
  - Input: navigate tabs and use gestures on device with notch
  - Expected output: tab bar and gestures function correctly with safe area layout.

## IT-011: Splash screen and startup readiness
- TEST-ID: IT-011
  - REQ-ID: REQ-015, REQ-035, REQ-046
  - Input: app launches and initialization completes successfully
  - Expected output: splash remains until ready, then main app appears once.

## IT-012: Local auth definitions with fallback
- TEST-ID: IT-012
  - REQ-ID: REQ-036, REQ-043, REQ-064
  - Input: backend unavailable but local database initialized
  - Expected output: auth and CRUD operations continue using local storage.

## IT-013: App compatibility check for web target
- TEST-ID: IT-013
  - REQ-ID: REQ-040, REQ-030
  - Input: build or run web target with current dependencies
  - Expected output: web target loads without import or platform compatibility errors.

## IT-014: Auth token attach then refresh fallback
- TEST-ID: IT-014
  - REQ-ID: REQ-021, REQ-022, REQ-024
  - Input: request view with stored token then refresh fails
  - Expected output: token header is attached, refresh fails, auth storage clears, app returns to login.

## IT-015: Theme and Paper UI integration
- TEST-ID: IT-015
  - REQ-ID: REQ-016, REQ-027, REQ-037
  - Input: toggle theme mode in UI
  - Expected output: Material components update style consistently across screens.

## IT-016: Analytics render after data changes
- TEST-ID: IT-016
  - REQ-ID: REQ-013, REQ-012
  - Input: add expense and income data then open analytics screen
  - Expected output: charts refresh and show updated totals.

## IT-017: Logout while refresh is in progress
- TEST-ID: IT-017
  - REQ-ID: REQ-003, REQ-023, REQ-024
  - Input: user logs out while an API refresh attempt is queued
  - Expected output: queued refresh and pending requests are cancelled; auth cleared.

## IT-018: Persistent theme and auth after restart
- TEST-ID: IT-018
  - REQ-ID: REQ-005, REQ-017, REQ-034
  - Input: login, select theme, restart app
  - Expected output: auth is restored and the chosen theme persists.

## IT-019: Invalid token handled gracefully
- TEST-ID: IT-019
  - REQ-ID: REQ-056, REQ-054, REQ-061
  - Input: stored malformed token on startup
  - Expected output: app does not authenticate, shows auth stack, and handles invalid token.

## IT-020: Error normalization across API and UI
- TEST-ID: IT-020
  - REQ-ID: REQ-020, REQ-038, REQ-055
  - Input: API returns various error shapes including 404, 500, and timeout
  - Expected output: app surfaces consistent user-friendly error messages in UI.
