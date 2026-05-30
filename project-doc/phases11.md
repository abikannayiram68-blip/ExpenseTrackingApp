# Phase 11: Security and Storage

Phase 11 improves how the app stores user data and protects access.

## Goals
- Securely store authentication tokens.
- Keep users logged in across app restarts.
- Protect routes so only logged-in users see main screens.

## Tasks
- Use `expo-secure-store` to save JWT tokens.
- Add auto-login logic when the app starts.
- Add logout and token refresh support.
- Protect the main app navigator with auth checks.
- Use secure storage for sensitive values only.

## Expected Results
- Users stay logged in until they log out.
- Tokens are not stored in plain storage.
- Unauthorized users cannot access protected screens.

## Notes
- Test on both emulator and real device.
- Keep auth logic in context and service layers.
