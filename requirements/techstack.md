# Tech Stack

This document defines the technology stack and core dependencies for ExpenseTrackingApp.

## Frontend

- Expo-managed React Native application
- TypeScript for static typing and safer code
- React 18.2.0 and React Native 0.74.5
- React Navigation v6 for stack and tab navigation
- React Native Paper for theming and reusable UI components
- `react-native-safe-area-context` for safe area handling
- `react-native-gesture-handler` for gesture-enabled navigation

## State Management

- React Context API for global state providers
- Separate context providers for auth, expense, income, budget, category, and theme
- Local state hooks for form and screen-level behavior

## Networking and API

- Axios for HTTP requests
- Axios interceptors for auth token injection, error normalization, and refresh handling
- Configurable `BASE_URL` for environment-specific API targets
- Planned support for backend contract with auth and transaction endpoints

## Storage

- AsyncStorage or local database layer for transaction persistence
- Expo Secure Store for auth token and sensitive session data
- Local persistence to support offline-safe behavior and session restore
- Storage fallback handling to avoid crashes on failures

## UI and Theming

- React Native Paper theme provider for light/dark mode
- Custom theme mode management for system, light, and dark preferences
- Toast notifications for feedback and validation messages
- Consistent UI patterns for forms, lists, cards, and alerts

## Tooling and Build

- Expo CLI / EAS for build, preview, and deployment
- TypeScript compiler and `tsconfig.json` for code validation
- ESLint for linting and code quality enforcement
- Prettier for consistent formatting
- Git for version control and collaboration

## Testing and Validation

- Test planning documentation for unit, integration, and end-to-end coverage
- Potential test tooling: Jest for unit tests, React Native Testing Library for components, and Expo E2E tools or Cypress for flows
- Validation through requirement/test mapping and planned execution stages

## Target Platforms

- Android and iOS mobile
- Web support as allowed by Expo compatibility
- Build targets aligned with Expo SDK 51 requirements
