# Phase 3: App Navigation

Phase 3 connects the screens with navigation and app flow control.

## Goals
- Build the root navigator.
- Add authentication flow and main app flow.
- Add bottom tabs and screen stacks.

## Tasks
- Create `RootNavigator.tsx` with auth gating.
- Create `AuthNavigator.tsx` for login/register screens.
- Create `MainNavigator.tsx` for the app's main tabs.
- Add stack navigators for expenses, income, budget, categories, and profile.
- Use React Navigation `createNativeStackNavigator` and `createBottomTabNavigator`.
- Add placeholders for each screen if not complete.

## Expected Results
- The app can switch between auth and main app screens.
- The bottom tab bar shows key sections.
- Navigation transitions feel natural.

## Notes
- Keep navigation state separate from screen logic.
- Plan for protected routes after auth integration.
