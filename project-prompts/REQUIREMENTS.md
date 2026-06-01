# REQUIREMENTS

This document captures requirements inferred from the current ExpenseTrackingApp codebase and architecture.

## Assumptions

- The repository is an Expo-managed React Native mobile app with TypeScript.
- The app supports local auth and data storage through a local database and secure storage.
- Backend API integration is planned but the repository currently includes a mock/local auth flow.
- Requirements are derived from the implementation of context providers, services, navigation flows, and UI structure.

## Functional Requirements

REQ-001: The app must allow users to register with name, email, and password.
REQ-002: The app must allow users to log in with email and password.
REQ-003: The app must allow authenticated users to log out.
REQ-004: The app must support password reset via "forgot password" flow.
REQ-005: The app must persist authenticated user state across app launches.
REQ-006: The app must store authentication tokens securely using secure storage.
REQ-007: The app must display either the authentication stack or the main app stack based on authentication state.
REQ-008: The app must support expense CRUD operations, including adding, editing, deleting, and listing expenses.
REQ-009: The app must support income CRUD operations, including adding, editing, deleting, and listing income entries.
REQ-010: The app must support budget CRUD operations, including adding, editing, deleting, and listing budgets.
REQ-011: The app must support category management, including creating and selecting categories for expenses and income.
REQ-012: The app must display a dashboard screen that aggregates expense, income, and budget data.
REQ-013: The app must support analytics screens with charts and visual summaries of financial data.
REQ-014: The app must use a bottom tab navigator for the main app sections.
REQ-015: The app must show a splash screen while initializing resources.
REQ-016: The app must support dark mode and light mode themes.
REQ-017: The app must allow the user to select system, dark, or light theme modes.
REQ-018: The app must load and apply the selected theme on startup.
REQ-019: The app must provide toast notifications for user feedback.
REQ-020: The app must normalize API errors into user-friendly messages.
REQ-021: The app must attach authentication tokens to outgoing API requests if available.
REQ-022: The app must attempt token refresh automatically on HTTP 401 responses.
REQ-023: The app must queue requests while token refresh is in progress and retry them once refreshed.
REQ-024: The app must clear authentication storage when token refresh fails.
REQ-025: The app must handle safe area layout using `SafeAreaProvider`.
REQ-026: The app must use a gesture handler root view for navigation gestures.
REQ-027: The app must use React Native Paper for UI theming and components.
REQ-028: The app must support building with Expo EAS for Android APK preview and production.

## Non-functional Requirements

REQ-029: The app must be implemented in TypeScript for type safety.
REQ-030: The app must use Expo SDK 51 and React Native 0.74.5.
REQ-031: The app must be modular with separated concerns for navigation, context, services, and screens.
REQ-032: The app must use context providers for global state management.
REQ-033: The app must have a maximum API request timeout defined in configuration.
REQ-034: The app must preserve user preferences and session data using persistent storage.
REQ-035: The app must maintain acceptable startup performance by showing the splash screen until initialization completes.
REQ-036: The app must support offline-safe operations for locally stored auth and data until backend integration is available.
REQ-037: The app must provide consistent UI appearance across dark and light themes.
REQ-038: The app must handle network errors gracefully with user-facing messages.
REQ-039: The app must maintain code readability and use path aliases for cleaner imports.
REQ-040: The app must be compatible with Android, iOS, and web targets supported by Expo.

## Constraints

REQ-041: The app must use `expo-splash-screen` to prevent the splash screen from hiding until initialization is complete.
REQ-042: The app must use `expo-secure-store` or equivalent secure storage for tokens and user data.
REQ-043: The local auth flow must initialize the local database before use.
REQ-044: The app must use `axios` for network requests and interceptors for auth token injection.
REQ-045: The app must derive dark mode from system preference when theme mode is set to system.
REQ-046: The app must not render the main UI until startup preparation is complete.
REQ-047: The app must use `React Navigation v6` for stack and tab navigation.
REQ-048: The app must support `react-native-gesture-handler` as the root view wrapper.
REQ-049: The `BASE_URL` for backend requests must be configurable for development and production environments.
REQ-050: The project must remain compatible with current Expo / React Native versions in the codebase.

## Edge Cases

REQ-051: The app must handle invalid login credentials with an error message and no navigation to the main app.
REQ-052: The app must handle registration failure due to duplicate email or invalid payload.
REQ-053: The app must handle empty expense, income, and budget lists with an empty-state UI.
REQ-054: The app must handle failed token refresh by clearing storage and requiring re-authentication.
REQ-055: The app must handle network timeouts and display a network error message.
REQ-056: The app must handle a missing or malformed stored token gracefully on startup.
REQ-057: The app must handle secure storage read/write failures by showing an error and preventing crashes.
REQ-058: The app must handle inconsistent theme persistence values and revert to a default theme mode.
REQ-059: The app must handle API responses with missing or unexpected data structures.
REQ-060: The app must handle rapid consecutive requests during token refresh by queueing them until refresh completes.
REQ-061: The app must handle user state changes during async initialization without entering a stale navigation state.
REQ-062: The app must handle invalid expense/income amounts, dates, or categories before submission.
REQ-063: The app must handle attempts to update profile or password when no authenticated user exists.
REQ-064: The app must handle local database initialization failures without crashing the app.
