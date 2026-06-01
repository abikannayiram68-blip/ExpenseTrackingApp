# DECISIONS

- Use React Context API for global app state rather than Redux. This is already implemented in `src/context/*`.
- Maintain local fallback persistence with `LocalDatabase` in `src/services/localDatabase.ts` until backend integration is available.
- Use `expo-secure-store` for authentication tokens and `AsyncStorage` for app data and preferences.
- Implement auth token injection and refresh at the Axios client layer in `src/services/api.ts`.
- Derive dark theme from system preference when theme mode is `system` and persist theme mode in storage.
- Keep startup splash screen visible until initialization completes using `expo-splash-screen` in `App.tsx`.
- Structure app navigation with a root auth-gated stack and nested bottom tabs for main sections.
- Define REST API contracts in `src/constants/index.ts` to support planned backend endpoints.
- Use a seeded default category list and local data seeding to support offline/demo scenarios.
