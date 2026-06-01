# UNIT TESTS

This file defines unit-level tests for every requirement listed in `REQUIREMENTS.md`.
Each requirement includes a positive test, negative test, edge case, and boundary condition.

## REQ-001: User registration
- TEST-ID: UT-001-POS
  - REQ-ID: REQ-001
  - Input: `name='Alice'`, `email='alice@example.com'`, `password='P@ssw0rd!'`
  - Expected output: Registration succeeds; new user returned with ID; tokens stored in secure storage.
- TEST-ID: UT-001-NEG
  - REQ-ID: REQ-001
  - Input: `name='Alice'`, `email='not-an-email'`, `password='P@ssw0rd!'`
  - Expected output: Registration fails with validation error for invalid email; no user created.
- TEST-ID: UT-001-EDGE
  - REQ-ID: REQ-001
  - Input: `name='A'`, `email='a@b.co'`, `password='Short1!'`
  - Expected output: Registration succeeds only if the app allows minimum valid values; otherwise explicit validation error.
- TEST-ID: UT-001-BND
  - REQ-ID: REQ-001
  - Input: `name='A'.repeat(256)`, `email='alice@example.com'`, `password='P@ssw0rd!'`
  - Expected output: Registration rejects overly long name with a boundary validation error.

## REQ-002: User login
- TEST-ID: UT-002-POS
  - REQ-ID: REQ-002
  - Input: valid registered `email='alice@example.com'`, `password='P@ssw0rd!'`
  - Expected output: Login succeeds; user context is populated; token stored.
- TEST-ID: UT-002-NEG
  - REQ-ID: REQ-002
  - Input: `email='alice@example.com'`, `password='wrongpass'`
  - Expected output: Login fails with authentication error; no user context set.
- TEST-ID: UT-002-EDGE
  - REQ-ID: REQ-002
  - Input: `email='ALICE@example.com'` if email normalization is case-insensitive
  - Expected output: Login succeeds if email matching is case-insensitive; otherwise fails with correct message.
- TEST-ID: UT-002-BND
  - REQ-ID: REQ-002
  - Input: `password='P@ssw0rd!'.repeat(10)` (very long password)
  - Expected output: Login handles long password without crashing and either succeeds or returns validation error.

## REQ-003: Logout
- TEST-ID: UT-003-POS
  - REQ-ID: REQ-003
  - Input: authenticated user invokes logout action
  - Expected output: Secure storage is cleared; user context becomes unauthenticated.
- TEST-ID: UT-003-NEG
  - REQ-ID: REQ-003
  - Input: unauthenticated user invokes logout action
  - Expected output: Logout completes gracefully without error; app remains unauthenticated.
- TEST-ID: UT-003-EDGE
  - REQ-ID: REQ-003
  - Input: logout called while an async login request is pending
  - Expected output: Logout clears tokens and cancels or ignores pending session state.
- TEST-ID: UT-003-BND
  - REQ-ID: REQ-003
  - Input: secure storage deletion fails due to missing permission or error
  - Expected output: App still resets auth state and does not crash.

## REQ-004: Forgot password
- TEST-ID: UT-004-POS
  - REQ-ID: REQ-004
  - Input: registered `email='alice@example.com'`
  - Expected output: Password reset flow completes successfully and returns acknowledgement.
- TEST-ID: UT-004-NEG
  - REQ-ID: REQ-004
  - Input: unregistered `email='unknown@example.com'`
  - Expected output: Flow returns a not-found/invalid email error and does not disclose sensitive data.
- TEST-ID: UT-004-EDGE
  - REQ-ID: REQ-004
  - Input: empty email string
  - Expected output: Validation error instructing user to enter an email.
- TEST-ID: UT-004-BND
  - REQ-ID: REQ-004
  - Input: `email='a'.repeat(64)+'@example.com'`
  - Expected output: Either reset flow succeeds for max-length email or returns a boundary validation error.

## REQ-005: Persist authenticated state
- TEST-ID: UT-005-POS
  - REQ-ID: REQ-005
  - Input: app restart after successful login with stored token/user
  - Expected output: App initializes to authenticated state without requiring login.
- TEST-ID: UT-005-NEG
  - REQ-ID: REQ-005
  - Input: app restart with expired or invalid token stored
  - Expected output: App does not authenticate automatically; authentication state resets.
- TEST-ID: UT-005-EDGE
  - REQ-ID: REQ-005
  - Input: app restart with stored user but missing token
  - Expected output: App treats session as unauthenticated.
- TEST-ID: UT-005-BND
  - REQ-ID: REQ-005
  - Input: stored token string length at maximum storage limit
  - Expected output: Token still loads correctly if supported; otherwise explicit storage error.

## REQ-006: Secure token storage
- TEST-ID: UT-006-POS
  - REQ-ID: REQ-006
  - Input: save access and refresh tokens after login
  - Expected output: `expo-secure-store` stores token values securely and retrieval returns exact tokens.
- TEST-ID: UT-006-NEG
  - REQ-ID: REQ-006
  - Input: secure storage write fails due to storage error
  - Expected output: Login returns error and does not leave partial credential state.
- TEST-ID: UT-006-EDGE
  - REQ-ID: REQ-006
  - Input: secure storage contains corrupted token value
  - Expected output: Retrieval returns null or error, causing re-authentication.
- TEST-ID: UT-006-BND
  - REQ-ID: REQ-006
  - Input: token value exactly at storage length limit
  - Expected output: Token is stored and retrieved successfully if supported.

## REQ-007: Auth stack selection
- TEST-ID: UT-007-POS
  - REQ-ID: REQ-007
  - Input: isAuthenticated=true and isInitializing=false
  - Expected output: `RootNavigator` loads `MainNavigator`.
- TEST-ID: UT-007-NEG
  - REQ-ID: REQ-007
  - Input: isAuthenticated=false and isInitializing=false
  - Expected output: `RootNavigator` loads `AuthNavigator`.
- TEST-ID: UT-007-EDGE
  - REQ-ID: REQ-007
  - Input: isInitializing=true regardless of auth state
  - Expected output: `RootNavigator` renders splash screen only.
- TEST-ID: UT-007-BND
  - REQ-ID: REQ-007
  - Input: auth state changes from false to true during navigation initialization
  - Expected output: App transitions cleanly to `MainNavigator` without stale route.

## REQ-008: Expense CRUD
- TEST-ID: UT-008-POS
  - REQ-ID: REQ-008
  - Input: add expense with valid amount, category, date, note
  - Expected output: Expense is created, saved, and returned in list.
- TEST-ID: UT-008-NEG
  - REQ-ID: REQ-008
  - Input: create expense with negative amount
  - Expected output: Creation fails with validation error; no expense saved.
- TEST-ID: UT-008-EDGE
  - REQ-ID: REQ-008
  - Input: update expense with empty note field
  - Expected output: Expense updates successfully if note is optional.
- TEST-ID: UT-008-BND
  - REQ-ID: REQ-008
  - Input: add expense with amount `0.01` and `999999.99`
  - Expected output: Amount values at boundaries are accepted if within business rules.

## REQ-009: Income CRUD
- TEST-ID: UT-009-POS
  - REQ-ID: REQ-009
  - Input: add income item with valid amount, category, date
  - Expected output: Income item is stored and appears in the income list.
- TEST-ID: UT-009-NEG
  - REQ-ID: REQ-009
  - Input: add income with empty category
  - Expected output: Validation error prevents save.
- TEST-ID: UT-009-EDGE
  - REQ-ID: REQ-009
  - Input: edit income entry to change date to today
  - Expected output: Edit succeeds; updated date is reflected.
- TEST-ID: UT-009-BND
  - REQ-ID: REQ-009
  - Input: income amount at minimal positive value `0.01`
  - Expected output: Value accepted if boundary rules permit.

## REQ-010: Budget CRUD
- TEST-ID: UT-010-POS
  - REQ-ID: REQ-010
  - Input: create budget with valid title, limit, category
  - Expected output: Budget saved and visible in budget list.
- TEST-ID: UT-010-NEG
  - REQ-ID: REQ-010
  - Input: create budget with limit `0`
  - Expected output: Validation error on budget limit.
- TEST-ID: UT-010-EDGE
  - REQ-ID: REQ-010
  - Input: delete budget that has associated expenses
  - Expected output: Delete should succeed if allowed, or return explicit relationship error.
- TEST-ID: UT-010-BND
  - REQ-ID: REQ-010
  - Input: create budget with extremely large limit value
  - Expected output: Budget accepted if within numeric limits, otherwise boundary validation.

## REQ-011: Category management
- TEST-ID: UT-011-POS
  - REQ-ID: REQ-011
  - Input: add new category `Travel` and use it for expense
  - Expected output: Category is saved and selectable in expense form.
- TEST-ID: UT-011-NEG
  - REQ-ID: REQ-011
  - Input: create category with empty name
  - Expected output: Validation error; category not created.
- TEST-ID: UT-011-EDGE
  - REQ-ID: REQ-011
  - Input: add duplicate category name
  - Expected output: Duplicate detection triggers error or deduplication behavior.
- TEST-ID: UT-011-BND
  - REQ-ID: REQ-011
  - Input: category name at maximum allowed length
  - Expected output: Category creation succeeds if within length limit.

## REQ-012: Dashboard aggregation
- TEST-ID: UT-012-POS
  - REQ-ID: REQ-012
  - Input: expense, income, budget data loaded from storage
  - Expected output: Dashboard aggregates totals and displays summaries.
- TEST-ID: UT-012-NEG
  - REQ-ID: REQ-012
  - Input: missing income data source
  - Expected output: Dashboard handles missing dataset gracefully without crash.
- TEST-ID: UT-012-EDGE
  - REQ-ID: REQ-012
  - Input: zero expenses and zero income
  - Expected output: Dashboard shows zero totals and empty-state messaging.
- TEST-ID: UT-012-BND
  - REQ-ID: REQ-012
  - Input: extremely large totals from many entries
  - Expected output: Aggregation displays large values correctly and does not overflow.

## REQ-013: Analytics charts
- TEST-ID: UT-013-POS
  - REQ-ID: REQ-013
  - Input: valid expense/income data over multiple dates
  - Expected output: Analytics charts render with correct dataset series.
- TEST-ID: UT-013-NEG
  - REQ-ID: REQ-013
  - Input: malformed analytics dataset missing labels
  - Expected output: Chart component returns friendly error or fallback view.
- TEST-ID: UT-013-EDGE
  - REQ-ID: REQ-013
  - Input: one data point only
  - Expected output: Chart still renders or displays a message explaining insufficient data.
- TEST-ID: UT-013-BND
  - REQ-ID: REQ-013
  - Input: no analytics data at all
  - Expected output: Empty-state analytics view is shown.

## REQ-014: Bottom tab navigator
- TEST-ID: UT-014-POS
  - REQ-ID: REQ-014
  - Input: app in authenticated state
  - Expected output: Main tab bar renders with expected section tabs.
- TEST-ID: UT-014-NEG
  - REQ-ID: REQ-014
  - Input: unauthenticated state
  - Expected output: Bottom tab navigator is not rendered.
- TEST-ID: UT-014-EDGE
  - REQ-ID: REQ-014
  - Input: tab selected while navigation stack resetting
  - Expected output: Tab selection remains stable and does not crash.
- TEST-ID: UT-014-BND
  - REQ-ID: REQ-014
  - Input: maximum number of tabs supported by layout
  - Expected output: Layout still renders without overflow.

## REQ-015: Splash screen
- TEST-ID: UT-015-POS
  - REQ-ID: REQ-015
  - Input: app launch with initialization in progress
  - Expected output: `expo-splash-screen` remains visible until initialization completes.
- TEST-ID: UT-015-NEG
  - REQ-ID: REQ-015
  - Input: initialization promise rejects
  - Expected output: Splash screen hides gracefully and app handles error state.
- TEST-ID: UT-015-EDGE
  - REQ-ID: REQ-015
  - Input: initialization completes instantly
  - Expected output: Splash screen still hides after startup and app shows main UI.
- TEST-ID: UT-015-BND
  - REQ-ID: REQ-015
  - Input: initialization takes an unusually long time
  - Expected output: App continues showing splash screen until ready, without crash.

## REQ-016: Dark/light theme
- TEST-ID: UT-016-POS
  - REQ-ID: REQ-016
  - Input: user selects dark theme
  - Expected output: app theme switches to dark appearance.
- TEST-ID: UT-016-NEG
  - REQ-ID: REQ-016
  - Input: invalid theme value saved in storage
  - Expected output: App falls back to default theme without crashing.
- TEST-ID: UT-016-EDGE
  - REQ-ID: REQ-016
  - Input: system theme changes while app is open in system mode
  - Expected output: App updates appearance dynamically if supported.
- TEST-ID: UT-016-BND
  - REQ-ID: REQ-016
  - Input: theme toggle called repeatedly in rapid succession
  - Expected output: Theme state remains consistent and does not desynchronize.

## REQ-017: Theme selection modes
- TEST-ID: UT-017-POS
  - REQ-ID: REQ-017
  - Input: select `system` mode
  - Expected output: App chooses theme based on OS scheme.
- TEST-ID: UT-017-NEG
  - REQ-ID: REQ-017
  - Input: select unsupported mode `blue`
  - Expected output: App rejects selection and retains last valid theme.
- TEST-ID: UT-017-EDGE
  - REQ-ID: REQ-017
  - Input: stored theme mode absent on startup
  - Expected output: App defaults to `system` or configured fallback.
- TEST-ID: UT-017-BND
  - REQ-ID: REQ-017
  - Input: theme preference string at storage size limit
  - Expected output: Preference loads correctly or resets gracefully.

## REQ-018: Apply theme on startup
- TEST-ID: UT-018-POS
  - REQ-ID: REQ-018
  - Input: stored theme mode `dark` before app launch
  - Expected output: App loads in dark theme immediately after startup.
- TEST-ID: UT-018-NEG
  - REQ-ID: REQ-018
  - Input: corrupt theme data in storage
  - Expected output: App falls back to default theme and logs or surfaces error.
- TEST-ID: UT-018-EDGE
  - REQ-ID: REQ-018
  - Input: system theme unavailable on the platform
  - Expected output: App still applies the stored explicit theme.
- TEST-ID: UT-018-BND
  - REQ-ID: REQ-018
  - Input: theme initialization occurs at the exact same time as splash hide
  - Expected output: App theme is applied before the main UI renders.

## REQ-019: Toast notifications
- TEST-ID: UT-019-POS
  - REQ-ID: REQ-019
  - Input: successful expense save event
  - Expected output: Toast appears with success message.
- TEST-ID: UT-019-NEG
  - REQ-ID: REQ-019
  - Input: error occurs during API call
  - Expected output: Toast appears with failure message and no crash.
- TEST-ID: UT-019-EDGE
  - REQ-ID: REQ-019
  - Input: multiple toast triggers in quick succession
  - Expected output: Toast queue handles them sequentially without UI break.
- TEST-ID: UT-019-BND
  - REQ-ID: REQ-019
  - Input: very long toast text message
  - Expected output: Toast truncates or wraps correctly and remains readable.

## REQ-020: Normalize API errors
- TEST-ID: UT-020-POS
  - REQ-ID: REQ-020
  - Input: Axios response error with `data.message='Rate limit exceeded'`
  - Expected output: `normalizeError` returns `Error('Rate limit exceeded')`.
- TEST-ID: UT-020-NEG
  - REQ-ID: REQ-020
  - Input: Axios error with no `response` and network failure
  - Expected output: `normalizeError` returns `Error('Network error. Please check your connection.')`.
- TEST-ID: UT-020-EDGE
  - REQ-ID: REQ-020
  - Input: Axios error with `response.data` undefined
  - Expected output: `normalizeError` returns generic server error message.
- TEST-ID: UT-020-BND
  - REQ-ID: REQ-020
  - Input: Axios error with `response.status=500` and no body
  - Expected output: `Error('Server error: 500')`.

## REQ-021: Attach auth token to requests
- TEST-ID: UT-021-POS
  - REQ-ID: REQ-021
  - Input: valid token stored in secure storage before request
  - Expected output: request header includes `Authorization: Bearer <token>`.
- TEST-ID: UT-021-NEG
  - REQ-ID: REQ-021
  - Input: no token present in storage
  - Expected output: request proceeds without Authorization header.
- TEST-ID: UT-021-EDGE
  - REQ-ID: REQ-021
  - Input: token retrieval throws an exception
  - Expected output: request interceptor fails silently and request is sent unauthenticated.
- TEST-ID: UT-021-BND
  - REQ-ID: REQ-021
  - Input: token exactly at max length allowed by storage
  - Expected output: token header is still attached correctly.

## REQ-022: Automatic token refresh on 401
- TEST-ID: UT-022-POS
  - REQ-ID: REQ-022
  - Input: request returns 401 and refresh token is valid
  - Expected output: refresh request succeeds; original request is retried with new access token.
- TEST-ID: UT-022-NEG
  - REQ-ID: REQ-022
  - Input: refresh token invalid or expired
  - Expected output: refresh fails; promise rejects and auth storage cleared.
- TEST-ID: UT-022-EDGE
  - REQ-ID: REQ-022
  - Input: original request already retried once and 401s again
  - Expected output: interceptor does not enter infinite retry loop; rejects cleanly.
- TEST-ID: UT-022-BND
  - REQ-ID: REQ-022
  - Input: refresh request returns access token of zero length
  - Expected output: interceptor treats this as failure and clears auth storage.

## REQ-023: Queue requests during refresh
- TEST-ID: UT-023-POS
  - REQ-ID: REQ-023
  - Input: two requests receive 401 while refresh is in progress
  - Expected output: second request waits for refresh and retries with new token.
- TEST-ID: UT-023-NEG
  - REQ-ID: REQ-023
  - Input: refresh fails while queued requests await retry
  - Expected output: queued requests reject with refresh failure and no stale auth headers.
- TEST-ID: UT-023-EDGE
  - REQ-ID: REQ-023
  - Input: queue is empty and refresh begins
  - Expected output: refresh proceeds normally and any subsequent request joins queue.
- TEST-ID: UT-023-BND
  - REQ-ID: REQ-023
  - Input: many parallel 401-triggered requests during refresh
  - Expected output: all requests are queued and retried once after refresh.

## REQ-024: Clear auth storage when refresh fails
- TEST-ID: UT-024-POS
  - REQ-ID: REQ-024
  - Input: refresh endpoint returns 401 or network error
  - Expected output: `APP_CONFIG.tokenKey`, `refresh_token`, and user storage are deleted.
- TEST-ID: UT-024-NEG
  - REQ-ID: REQ-024
  - Input: storage deletion throws error during cleanup
  - Expected output: function still rejects refresh failure but does not crash app.
- TEST-ID: UT-024-EDGE
  - REQ-ID: REQ-024
  - Input: token storage already empty when refresh fails
  - Expected output: cleanup completes harmlessly.
- TEST-ID: UT-024-BND
  - REQ-ID: REQ-024
  - Input: partial storage data present (token without refresh token)
  - Expected output: cleanup clears remaining authentication values.

## REQ-025: Safe area layout
- TEST-ID: UT-025-POS
  - REQ-ID: REQ-025
  - Input: `SafeAreaProvider` wraps app components
  - Expected output: child components receive safe area insets without layout overlap.
- TEST-ID: UT-025-NEG
  - REQ-ID: REQ-025
  - Input: safe area data unavailable on platform
  - Expected output: UI falls back to default layout and remains usable.
- TEST-ID: UT-025-EDGE
  - REQ-ID: REQ-025
  - Input: device with a notch and home indicator
  - Expected output: app content avoids unsafe screen areas.
- TEST-ID: UT-025-BND
  - REQ-ID: REQ-025
  - Input: safe area top and bottom insets are zero
  - Expected output: layout still renders without negative spacing.

## REQ-026: Gesture handler root view
- TEST-ID: UT-026-POS
  - REQ-ID: REQ-026
  - Input: root app wrapped in `GestureHandlerRootView`
  - Expected output: gesture-enabled navigation and swipes function correctly.
- TEST-ID: UT-026-NEG
  - REQ-ID: REQ-026
  - Input: missing root wrapper in code
  - Expected output: app may warn or fail on gesture navigation; test should detect missing wrapper.
- TEST-ID: UT-026-EDGE
  - REQ-ID: REQ-026
  - Input: complex nested gesture handlers inside the root view
  - Expected output: gestures still propagate properly.
- TEST-ID: UT-026-BND
  - REQ-ID: REQ-026
  - Input: root view style set to zero height
  - Expected output: gesture handler wrapper still exists and app does not crash.

## REQ-027: React Native Paper UI
- TEST-ID: UT-027-POS
  - REQ-ID: REQ-027
  - Input: app wrapped in `PaperProvider`
  - Expected output: Paper theming values are available to components.
- TEST-ID: UT-027-NEG
  - REQ-ID: REQ-027
  - Input: component uses Paper theming without provider
  - Expected output: component renders fallback or errors explicitly.
- TEST-ID: UT-027-EDGE
  - REQ-ID: REQ-027
  - Input: dynamic theme passed to `PaperProvider`
  - Expected output: component styles update to the new theme.
- TEST-ID: UT-027-BND
  - REQ-ID: REQ-027
  - Input: theme with missing color value
  - Expected output: Paper uses default palette for missing keys.

## REQ-028: Expo EAS build support
- TEST-ID: UT-028-POS
  - REQ-ID: REQ-028
  - Input: project contains `eas.json` and valid build profile
  - Expected output: build configuration loads without syntax errors.
- TEST-ID: UT-028-NEG
  - REQ-ID: REQ-028
  - Input: invalid `eas.json` structure
  - Expected output: validation catches malformed build configuration.
- TEST-ID: UT-028-EDGE
  - REQ-ID: REQ-028
  - Input: build profile names contain unusual characters
  - Expected output: `eas build` parser accepts valid names or rejects properly.
- TEST-ID: UT-028-BND
  - REQ-ID: REQ-028
  - Input: `eas.json` with maximum allowed profile entries
  - Expected output: config still loads correctly.

## REQ-029: TypeScript implementation
- TEST-ID: UT-029-POS
  - REQ-ID: REQ-029
  - Input: run `tsc --noEmit`
  - Expected output: compilation succeeds with zero TypeScript errors.
- TEST-ID: UT-029-NEG
  - REQ-ID: REQ-029
  - Input: invalid type assignment introduced in a service file
  - Expected output: TypeScript reports a type error.
- TEST-ID: UT-029-EDGE
  - REQ-ID: REQ-029
  - Input: `any` used in a typed component prop
  - Expected output: compile still passes if types allow; test detects usage patterns if linted.
- TEST-ID: UT-029-BND
  - REQ-ID: REQ-029
  - Input: file with maximum export count and complex types
  - Expected output: `tsc` handles it without unexpected compile failures.

## REQ-030: Expo SDK and React Native versions
- TEST-ID: UT-030-POS
  - REQ-ID: REQ-030
  - Input: inspect `package.json` versions for Expo and React Native
  - Expected output: values match `expo` ~51.0.28 and `react-native` 0.74.5.
- TEST-ID: UT-030-NEG
  - REQ-ID: REQ-030
  - Input: version mismatch introduced in dependencies
  - Expected output: test detects unsupported SDK or RN version.
- TEST-ID: UT-030-EDGE
  - REQ-ID: REQ-030
  - Input: patch version update in Expo dependencies
  - Expected output: versions remain compatible if minor patch is acceptable.
- TEST-ID: UT-030-BND
  - REQ-ID: REQ-030
  - Input: dependency lockfile missing
  - Expected output: test still validates `package.json` values.

## REQ-031: Modular architecture
- TEST-ID: UT-031-POS
  - REQ-ID: REQ-031
  - Input: analyze import paths for `context`, `services`, `navigation`, `screens`
  - Expected output: modules are separated and files follow layer responsibilities.
- TEST-ID: UT-031-NEG
  - REQ-ID: REQ-031
  - Input: a service file imports UI-specific component directly
  - Expected output: architecture check flags inappropriate dependency.
- TEST-ID: UT-031-EDGE
  - REQ-ID: REQ-031
  - Input: cross-import between `context` and `screens`
  - Expected output: allowed only if necessary; test ensures it is intentional.
- TEST-ID: UT-031-BND
  - REQ-ID: REQ-031
  - Input: module with both service and UI concerns
  - Expected output: structural review marks it as boundary violation.

## REQ-032: Context state management
- TEST-ID: UT-032-POS
  - REQ-ID: REQ-032
  - Input: `AuthProvider` and `ExpenseProvider` wrap the app
  - Expected output: child components can consume context values.
- TEST-ID: UT-032-NEG
  - REQ-ID: REQ-032
  - Input: component tries to use context outside provider
  - Expected output: hook throws the expected error.
- TEST-ID: UT-032-EDGE
  - REQ-ID: REQ-032
  - Input: nested provider updates state concurrently
  - Expected output: providers keep state isolated and stable.
- TEST-ID: UT-032-BND
  - REQ-ID: REQ-032
  - Input: provider receives null children
  - Expected output: provider does not crash.

## REQ-033: API timeout configuration
- TEST-ID: UT-033-POS
  - REQ-ID: REQ-033
  - Input: inspect `APP_CONFIG.apiTimeout`
  - Expected output: timeout value is defined and used by Axios instance.
- TEST-ID: UT-033-NEG
  - REQ-ID: REQ-033
  - Input: API client without timeout configured
  - Expected output: test fails because timeout is undefined.
- TEST-ID: UT-033-EDGE
  - REQ-ID: REQ-033
  - Input: timeout set to very low value (e.g. 100ms)
  - Expected output: requests time out quickly and error is surfaced.
- TEST-ID: UT-033-BND
  - REQ-ID: REQ-033
  - Input: timeout equals zero or infinite
  - Expected output: Axios either treats as no timeout or rejects invalid config.

## REQ-034: Persist preferences and session data
- TEST-ID: UT-034-POS
  - REQ-ID: REQ-034
  - Input: save theme mode and user session to storage
  - Expected output: stored values are retrievable after app restart.
- TEST-ID: UT-034-NEG
  - REQ-ID: REQ-034
  - Input: storage write error while saving theme preference
  - Expected output: app catches error and does not crash.
- TEST-ID: UT-034-EDGE
  - REQ-ID: REQ-034
  - Input: preference data is partially written
  - Expected output: app uses fallback values.
- TEST-ID: UT-034-BND
  - REQ-ID: REQ-034
  - Input: large preference payload near storage capacity
  - Expected output: storage handles it or returns clear error.

## REQ-035: Startup performance with splash screen
- TEST-ID: UT-035-POS
  - REQ-ID: REQ-035
  - Input: app initialization completes successfully
  - Expected output: splash screen hides after initialization and main UI appears.
- TEST-ID: UT-035-NEG
  - REQ-ID: REQ-035
  - Input: initialization fails due to resource load error
  - Expected output: app shows error state instead of hanging indefinitely.
- TEST-ID: UT-035-EDGE
  - REQ-ID: REQ-035
  - Input: initialization completes immediately
  - Expected output: no flicker or crash when hiding splash screen.
- TEST-ID: UT-035-BND
  - REQ-ID: REQ-035
  - Input: startup initialization lasts longer than normal
  - Expected output: app remains responsive and does not bypass splash too early.

## REQ-036: Offline-safe operations
- TEST-ID: UT-036-POS
  - REQ-ID: REQ-036
  - Input: user operates with local auth/data while backend unavailable
  - Expected output: app still supports login and CRUD using local storage.
- TEST-ID: UT-036-NEG
  - REQ-ID: REQ-036
  - Input: backend requests fail and local fallback is not implemented
  - Expected output: app surfaces offline error rather than crashing.
- TEST-ID: UT-036-EDGE
  - REQ-ID: REQ-036
  - Input: network restored after offline usage
  - Expected output: app can resume normal sync or retry behavior.
- TEST-ID: UT-036-BND
  - REQ-ID: REQ-036
  - Input: persistent offline mode across app restart
  - Expected output: app retains local session and data safely.

## REQ-037: Consistent dark/light UI
- TEST-ID: UT-037-POS
  - REQ-ID: REQ-037
  - Input: theme mode set to dark and UI renders
  - Expected output: all styled components use dark theme colors.
- TEST-ID: UT-037-NEG
  - REQ-ID: REQ-037
  - Input: theme mode set to invalid value
  - Expected output: app falls back to consistent default theme.
- TEST-ID: UT-037-EDGE
  - REQ-ID: REQ-037
  - Input: switching between themes rapidly
  - Expected output: UI updates consistently with no style glitches.
- TEST-ID: UT-037-BND
  - REQ-ID: REQ-037
  - Input: theme config missing some color keys
  - Expected output: UI uses defaults for missing values without crash.

## REQ-038: Network error handling
- TEST-ID: UT-038-POS
  - REQ-ID: REQ-038
  - Input: axios request fails with no response
  - Expected output: `normalizeError` returns network error message.
- TEST-ID: UT-038-NEG
  - REQ-ID: REQ-038
  - Input: API returns 500 status and invalid payload
  - Expected output: app surfaces generic server error message.
- TEST-ID: UT-038-EDGE
  - REQ-ID: REQ-038
  - Input: request aborted due to timeout
  - Expected output: user-friendly timeout message.
- TEST-ID: UT-038-BND
  - REQ-ID: REQ-038
  - Input: intermittent network connectivity during request
  - Expected output: app retains stability and reports the network failure.

## REQ-039: Code readability and aliases
- TEST-ID: UT-039-POS
  - REQ-ID: REQ-039
  - Input: import path `@context/AuthContext`
  - Expected output: module resolves successfully with configured alias.
- TEST-ID: UT-039-NEG
  - REQ-ID: REQ-039
  - Input: alias path misconfigured in Babel/tsconfig
  - Expected output: build fails with import resolution error.
- TEST-ID: UT-039-EDGE
  - REQ-ID: REQ-039
  - Input: alias used in linting rule check
  - Expected output: alias is accepted by tooling.
- TEST-ID: UT-039-BND
  - REQ-ID: REQ-039
  - Input: alias path points to nested index file
  - Expected output: import still resolves correctly.

## REQ-040: Expo platform compatibility
- TEST-ID: UT-040-POS
  - REQ-ID: REQ-040
  - Input: app built for Android, iOS, web via Expo configuration
  - Expected output: platform-specific build config exists and resolves.
- TEST-ID: UT-040-NEG
  - REQ-ID: REQ-040
  - Input: unsupported platform target requested
  - Expected output: build tooling rejects with clear error.
- TEST-ID: UT-040-EDGE
  - REQ-ID: REQ-040
  - Input: web-specific component used in mobile app
  - Expected output: compatibility issue detected in static analysis or runtime.
- TEST-ID: UT-040-BND
  - REQ-ID: REQ-040
  - Input: new platform support added with minimal config
  - Expected output: app still maintains compatibility for current supported targets.

## REQ-041: expo-splash-screen usage
- TEST-ID: UT-041-POS
  - REQ-ID: REQ-041
  - Input: SplashScreen.preventAutoHideAsync called on startup
  - Expected output: splash screen does not hide until `hideAsync` is called.
- TEST-ID: UT-041-NEG
  - REQ-ID: REQ-041
  - Input: `hideAsync` never called
  - Expected output: app remains on splash screen; test ensures this failure mode is detectable.
- TEST-ID: UT-041-EDGE
  - REQ-ID: REQ-041
  - Input: `onLayoutRootView` executed before readiness
  - Expected output: `hideAsync` is deferred until `isReady` true.
- TEST-ID: UT-041-BND
  - REQ-ID: REQ-041
  - Input: splash screen prevent and hide calls happen in rapid succession
  - Expected output: no thrown errors and splash lifecycle remains stable.

## REQ-042: Secure storage for tokens/user data
- TEST-ID: UT-042-POS
  - REQ-ID: REQ-042
  - Input: store user JSON and token values in secure storage
  - Expected output: stored entries are available for later retrieval.
- TEST-ID: UT-042-NEG
  - REQ-ID: REQ-042
  - Input: secure storage unavailable due to device restrictions
  - Expected output: service returns explicit error and app handles it.
- TEST-ID: UT-042-EDGE
  - REQ-ID: REQ-042
  - Input: store and retrieve empty JSON string for user
  - Expected output: retrieval returns null or valid parse error handled safely.
- TEST-ID: UT-042-BND
  - REQ-ID: REQ-042
  - Input: maximum storage key length or data size
  - Expected output: secure storage handles limits or reports the overflow.

## REQ-043: Local database initialization
- TEST-ID: UT-043-POS
  - REQ-ID: REQ-043
  - Input: app starts and `LocalDatabase.initialize()` is called
  - Expected output: database is initialized before any auth call uses it.
- TEST-ID: UT-043-NEG
  - REQ-ID: REQ-043
  - Input: initialization fails due to storage error
  - Expected output: app catches the failure and login/register do not proceed.
- TEST-ID: UT-043-EDGE
  - REQ-ID: REQ-043
  - Input: initialize called multiple times concurrently
  - Expected output: initialization is idempotent or handles duplicates gracefully.
- TEST-ID: UT-043-BND
  - REQ-ID: REQ-043
  - Input: initialization call after app already has user state
  - Expected output: app continues safely without corrupting data.

## REQ-044: Axios auth interceptors
- TEST-ID: UT-044-POS
  - REQ-ID: REQ-044
  - Input: API request made after interceptor registered
  - Expected output: request uses Axios instance with configured interceptors.
- TEST-ID: UT-044-NEG
  - REQ-ID: REQ-044
  - Input: interceptor throws inside request hook
  - Expected output: request rejects with the thrown error.
- TEST-ID: UT-044-EDGE
  - REQ-ID: REQ-044
  - Input: response interceptor receives a 202 success status
  - Expected output: response passes through unchanged.
- TEST-ID: UT-044-BND
  - REQ-ID: REQ-044
  - Input: originalRequest lacks headers object
  - Expected output: interceptor creates headers object before retrying.

## REQ-045: System dark mode derivation
- TEST-ID: UT-045-POS
  - REQ-ID: REQ-045
  - Input: theme mode `system` and device scheme `dark`
  - Expected output: `isDark` is true.
- TEST-ID: UT-045-NEG
  - REQ-ID: REQ-045
  - Input: theme mode `system` and unsupported scheme return null
  - Expected output: app falls back to default light mode.
- TEST-ID: UT-045-EDGE
  - REQ-ID: REQ-045
  - Input: system scheme changes mid-session
  - Expected output: `isDark` updates when app rerenders.
- TEST-ID: UT-045-BND
  - REQ-ID: REQ-045
  - Input: theme mode set to `dark` while device scheme is `light`
  - Expected output: `isDark` remains true because explicit mode overrides system.

## REQ-046: Do not render UI before startup complete
- TEST-ID: UT-046-POS
  - REQ-ID: REQ-046
  - Input: `isReady=false` in `AppInner`
  - Expected output: `AppInner` returns null and no app UI is rendered.
- TEST-ID: UT-046-NEG
  - REQ-ID: REQ-046
  - Input: `isReady=true` with pending async initialization state
  - Expected output: UI renders only after readiness conditions are satisfied.
- TEST-ID: UT-046-EDGE
  - REQ-ID: REQ-046
  - Input: `onLayoutRootView` called before `isReady` becomes true
  - Expected output: splash screen remains visible until ready.
- TEST-ID: UT-046-BND
  - REQ-ID: REQ-046
  - Input: readiness toggles rapidly around app start
  - Expected output: App UI transitions cleanly once.

## REQ-047: React Navigation v6 usage
- TEST-ID: UT-047-POS
  - REQ-ID: REQ-047
  - Input: `createNativeStackNavigator` and `NavigationContainer` imported from v6 packages
  - Expected output: navigation setup compiles and works.
- TEST-ID: UT-047-NEG
  - REQ-ID: REQ-047
  - Input: old v5 syntax used in navigator definitions
  - Expected output: static analysis fails or runtime warnings indicate mismatch.
- TEST-ID: UT-047-EDGE
  - REQ-ID: REQ-047
  - Input: nested stack inside tab navigator
  - Expected output: navigation state resolves correctly.
- TEST-ID: UT-047-BND
  - REQ-ID: REQ-047
  - Input: stack screen count approaches large number
  - Expected output: navigation structure remains functional.

## REQ-048: Gesture handler root wrapper
- TEST-ID: UT-048-POS
  - REQ-ID: REQ-048
  - Input: `GestureHandlerRootView` at app root
  - Expected output: gesture handling is enabled.
- TEST-ID: UT-048-NEG
  - REQ-ID: REQ-048
  - Input: no gesture handler root wrapper
  - Expected output: gesture interactions fail or warn in React Native.
- TEST-ID: UT-048-EDGE
  - REQ-ID: REQ-048
  - Input: root view nested under additional wrappers
  - Expected output: `GestureHandlerRootView` still applies correctly.
- TEST-ID: UT-048-BND
  - REQ-ID: REQ-048
  - Input: root wrapper style mutated to hidden
  - Expected output: app navigation still initializes without crash.

## REQ-049: Configurable BASE_URL
- TEST-ID: UT-049-POS
  - REQ-ID: REQ-049
  - Input: `__DEV__` true and local BASE_URL set
  - Expected output: API client uses local development URL.
- TEST-ID: UT-049-NEG
  - REQ-ID: REQ-049
  - Input: `BASE_URL` undefined in config
  - Expected output: API client initialization fails with clear error.
- TEST-ID: UT-049-EDGE
  - REQ-ID: REQ-049
  - Input: production build with `__DEV__` false
  - Expected output: API client uses production `https://api.yourapp.com/api/v1`.
- TEST-ID: UT-049-BND
  - REQ-ID: REQ-049
  - Input: `BASE_URL` contains trailing slash
  - Expected output: client handles URL concatenation correctly.

## REQ-050: Compatibility with current Expo/RN versions
- TEST-ID: UT-050-POS
  - REQ-ID: REQ-050
  - Input: app dependencies match supported Expo/RN versions
  - Expected output: app compiles and launches successfully.
- TEST-ID: UT-050-NEG
  - REQ-ID: REQ-050
  - Input: unsupported dependency version introduced
  - Expected output: app build or runtime issue is detected.
- TEST-ID: UT-050-EDGE
  - REQ-ID: REQ-050
  - Input: minor patch updates within supported range
  - Expected output: compatibility remains intact.
- TEST-ID: UT-050-BND
  - REQ-ID: REQ-050
  - Input: maximum supported package version within semver range
  - Expected output: project still resolves dependencies successfully.

## REQ-051: Invalid login credentials handling
- TEST-ID: UT-051-POS
  - REQ-ID: REQ-051
  - Input: login with invalid credentials
  - Expected output: auth error message is shown and app remains on login screen.
- TEST-ID: UT-051-NEG
  - REQ-ID: REQ-051
  - Input: invalid credentials with empty password
  - Expected output: validation message appears, no auth attempt occurs.
- TEST-ID: UT-051-EDGE
  - REQ-ID: REQ-051
  - Input: case variation in email but same registered account
  - Expected output: behavior matches email normalization policy.
- TEST-ID: UT-051-BND
  - REQ-ID: REQ-051
  - Input: invalid credentials with maximum input length
  - Expected output: login validation still handles the input without crash.

## REQ-052: Registration duplicate email handling
- TEST-ID: UT-052-POS
  - REQ-ID: REQ-052
  - Input: register with email already in local database
  - Expected output: duplicate email error returned and registration blocked.
- TEST-ID: UT-052-NEG
  - REQ-ID: REQ-052
  - Input: register with malformed payload and existing email
  - Expected output: validation error surfaced before duplicate check.
- TEST-ID: UT-052-EDGE
  - REQ-ID: REQ-052
  - Input: register with same email but different case
  - Expected output: duplicate handling follows email normalization rules.
- TEST-ID: UT-052-BND
  - REQ-ID: REQ-052
  - Input: email at boundary max length and duplicate
  - Expected output: duplicate detection still works.

## REQ-053: Empty list handling
- TEST-ID: UT-053-POS
  - REQ-ID: REQ-053
  - Input: expense/income/budget lists are empty
  - Expected output: empty-state UI displays informative message.
- TEST-ID: UT-053-NEG
  - REQ-ID: REQ-053
  - Input: empty list data is null instead of array
  - Expected output: UI handles null gracefully and converts to empty state.
- TEST-ID: UT-053-EDGE
  - REQ-ID: REQ-053
  - Input: lists contain only deleted and archived items
  - Expected output: empty-state view still appears.
- TEST-ID: UT-053-BND
  - REQ-ID: REQ-053
  - Input: list contains one item and user deletes it
  - Expected output: UI transitions to empty-state view correctly.

## REQ-054: Failed token refresh handling
- TEST-ID: UT-054-POS
  - REQ-ID: REQ-054
  - Input: refresh request returns unauthorized
  - Expected output: auth storage clears and user is required to log in again.
- TEST-ID: UT-054-NEG
  - REQ-ID: REQ-054
  - Input: refresh fails while request queue holds pending retries
  - Expected output: queued requests reject with refresh error.
- TEST-ID: UT-054-EDGE
  - REQ-ID: REQ-054
  - Input: refresh fail happens after auth storage already partially cleared
  - Expected output: app still ends in unauthenticated state.
- TEST-ID: UT-054-BND
  - REQ-ID: REQ-054
  - Input: refresh response returns invalid token format
  - Expected output: refresh treated as failure and storage cleared.

## REQ-055: Network timeout message
- TEST-ID: UT-055-POS
  - REQ-ID: REQ-055
  - Input: request exceeds configured timeout
  - Expected output: user-facing timeout error message.
- TEST-ID: UT-055-NEG
  - REQ-ID: REQ-055
  - Input: timeout occurs with non-network error
  - Expected output: app still distinguishes timeout from other errors.
- TEST-ID: UT-055-EDGE
  - REQ-ID: REQ-055
  - Input: timeout threshold set very close to the request duration
  - Expected output: timeout triggers reliably when duration exceeds threshold.
- TEST-ID: UT-055-BND
  - REQ-ID: REQ-055
  - Input: request duration equals timeout exactly
  - Expected output: behavior is defined by Axios and user sees appropriate message.

## REQ-056: Missing/malformed stored token
- TEST-ID: UT-056-POS
  - REQ-ID: REQ-056
  - Input: secure storage returns malformed token string
  - Expected output: app treats session as invalid and does not authenticate.
- TEST-ID: UT-056-NEG
  - REQ-ID: REQ-056
  - Input: token storage returns non-JSON string when parsing user
  - Expected output: parser catches error and resets auth.
- TEST-ID: UT-056-EDGE
  - REQ-ID: REQ-056
  - Input: token value present but expired by timestamp semantics
  - Expected output: app invalidates the session and prompts login.
- TEST-ID: UT-056-BND
  - REQ-ID: REQ-056
  - Input: token string length at storage minimum/maximum
  - Expected output: app handles it without crash.

## REQ-057: Secure storage failure handling
- TEST-ID: UT-057-POS
  - REQ-ID: REQ-057
  - Input: secure storage getItem throws error
  - Expected output: app catches exception and uses fallback behavior.
- TEST-ID: UT-057-NEG
  - REQ-ID: REQ-057
  - Input: secure storage setItem rejects during login
  - Expected output: login fails and error is surfaced.
- TEST-ID: UT-057-EDGE
  - REQ-ID: REQ-057
  - Input: deleteItem fails while logging out
  - Expected output: logout completes logically and app remains stable.
- TEST-ID: UT-057-BND
  - REQ-ID: REQ-057
  - Input: storage operations are throttled or slow
  - Expected output: app remains responsive and handles async delays.

## REQ-058: Inconsistent theme persistence values
- TEST-ID: UT-058-POS
  - REQ-ID: REQ-058
  - Input: storage contains `theme_mode='light'`
  - Expected output: app applies light theme.
- TEST-ID: UT-058-NEG
  - REQ-ID: REQ-058
  - Input: storage contains invalid `theme_mode='rainbow'`
  - Expected output: app reverts to default theme.
- TEST-ID: UT-058-EDGE
  - REQ-ID: REQ-058
  - Input: storage contains null or missing theme value
  - Expected output: app uses system/default theme safely.
- TEST-ID: UT-058-BND
  - REQ-ID: REQ-058
  - Input: theme persistence key exists but empty string
  - Expected output: fallback theme activates without crash.

## REQ-059: Missing/unexpected API data structures
- TEST-ID: UT-059-POS
  - REQ-ID: REQ-059
  - Input: API response missing optional analytics fields
  - Expected output: app uses default values and renders fallback UI.
- TEST-ID: UT-059-NEG
  - REQ-ID: REQ-059
  - Input: API response contains unexpected data type for amount
  - Expected output: app handles parse error and surfaces a message.
- TEST-ID: UT-059-EDGE
  - REQ-ID: REQ-059
  - Input: API response with empty arrays instead of objects
  - Expected output: app treats the response as empty dataset.
- TEST-ID: UT-059-BND
  - REQ-ID: REQ-059
  - Input: API response includes extra unknown fields
  - Expected output: app ignores unknown fields and proceeds.

## REQ-060: Rapid requests during token refresh
- TEST-ID: UT-060-POS
  - REQ-ID: REQ-060
  - Input: trigger three authorized requests while token refresh is ongoing
  - Expected output: all requests queue and retry after refresh with new token.
- TEST-ID: UT-060-NEG
  - REQ-ID: REQ-060
  - Input: one queued request uses stale token after refresh fails
  - Expected output: request rejects and does not continue with stale auth.
- TEST-ID: UT-060-EDGE
  - REQ-ID: REQ-060
  - Input: refresh completes while new 401 request arrives mid-queue
  - Expected output: request joins queue or uses updated token consistently.
- TEST-ID: UT-060-BND
  - REQ-ID: REQ-060
  - Input: maximum concurrent queued requests while refresh is happening
  - Expected output: queue handles all requests without losing or duplicating them.

## REQ-061: User state changes during async initialization
- TEST-ID: UT-061-POS
  - REQ-ID: REQ-061
  - Input: app initialization loads user session and sets `isAuthenticated=true`
  - Expected output: navigation updates to authenticated stack after init completes.
- TEST-ID: UT-061-NEG
  - REQ-ID: REQ-061
  - Input: user state is toggled to unauthenticated while init is running
  - Expected output: app resolves to unauthenticated stack without stale screen state.
- TEST-ID: UT-061-EDGE
  - REQ-ID: REQ-061
  - Input: initialization completes after user manually logs out
  - Expected output: nav state remains unauthenticated.
- TEST-ID: UT-061-BND
  - REQ-ID: REQ-061
  - Input: async init resolves exactly as `RootNavigator` renders
  - Expected output: no inconsistent route state occurs.

## REQ-062: Invalid CRUD submission handling
- TEST-ID: UT-062-POS
  - REQ-ID: REQ-062
  - Input: add expense with valid amount, date, category
  - Expected output: creation succeeds.
- TEST-ID: UT-062-NEG
  - REQ-ID: REQ-062
  - Input: add income with amount `-50`
  - Expected output: validation error and rejection.
- TEST-ID: UT-062-EDGE
  - REQ-ID: REQ-062
  - Input: create expense with date in future if allowed
  - Expected output: either accepted or rejected per business rules with clear message.
- TEST-ID: UT-062-BND
  - REQ-ID: REQ-062
  - Input: category ID at maximum valid numeric boundary
  - Expected output: submission accepted if category exists.

## REQ-063: Update profile/password without auth
- TEST-ID: UT-063-POS
  - REQ-ID: REQ-063
  - Input: authenticated user updates profile successfully
  - Expected output: profile changes persist and returned user object updates.
- TEST-ID: UT-063-NEG
  - REQ-ID: REQ-063
  - Input: call `changePassword` with no user in storage
  - Expected output: service throws `No authenticated user.` error.
- TEST-ID: UT-063-EDGE
  - REQ-ID: REQ-063
  - Input: stored user exists but token expired
  - Expected output: update attempts fail due to invalid auth.
- TEST-ID: UT-063-BND
  - REQ-ID: REQ-063
  - Input: partial user profile object in storage
  - Expected output: update merges partial fields without crash.

## REQ-064: Local database init failure resilience
- TEST-ID: UT-064-POS
  - REQ-ID: REQ-064
  - Input: local database initializes successfully
  - Expected output: app continues with normal auth and data operations.
- TEST-ID: UT-064-NEG
  - REQ-ID: REQ-064
  - Input: database initialization throws exception
  - Expected output: app catches the failure and prevents crashes, showing fallback/error state.
- TEST-ID: UT-064-EDGE
  - REQ-ID: REQ-064
  - Input: database init partially succeeds but misses one table
  - Expected output: app reports initialization inconsistency and avoids operations relying on missing table.
- TEST-ID: UT-064-BND
  - REQ-ID: REQ-064
  - Input: init failure occurs after a retry attempt
  - Expected output: retry logic handles the boundary of one retry and then surfaces error.
