# Phase 3 — Execution Stages

This file defines the execution stages for backend integration and hardening.
Each stage includes explicit requirements and test IDs.

## Stage 1: Setup
- REQ-IDs: REQ-029, REQ-030, REQ-039, REQ-050
- TEST-IDs: UT-029-POS, UT-030-POS, UT-039-POS, UT-050-POS
- Tasks:
  1. Confirm the current codebase still passes baseline type and dependency validation.
  2. Install backend-related packages if required.
  3. Write tests to verify backend contract readiness.

## Stage 2: Architecture
- REQ-IDs: REQ-031, REQ-032, REQ-044, REQ-049
- TEST-IDs: UT-031-POS, UT-032-POS, UT-044-POS, UT-049-POS
- Tasks:
  1. Design the API integration layer in `src/services/api.ts`.
  2. Define backend contract requirements for auth, expenses, income, budgets, categories, and analytics.
  3. Write tests for API endpoint configuration and service layering.

## Stage 3: Database
- REQ-IDs: REQ-034, REQ-043, REQ-064
- TEST-IDs: UT-034-POS, UT-043-POS, UT-064-POS
- Tasks:
  1. Verify backend database schema in `database/schema.sql`.
  2. Ensure local fallback remains compatible with server schema.
  3. Write tests confirming schema alignment and seeded default data.

## Stage 4: Backend
- REQ-IDs: REQ-001, REQ-002, REQ-004, REQ-021, REQ-022, REQ-023, REQ-024, REQ-049
- TEST-IDs: UT-001-POS, UT-002-POS, UT-004-POS, UT-021-POS, UT-022-POS, UT-023-POS, UT-024-POS, UT-049-POS
- Tasks:
  1. Implement backend auth endpoints and token refresh contract.
  2. Wire Axios interceptor refresh queue and retry behavior.
  3. Write tests for auth API success, 401 handling, and refresh failures.

## Stage 5: Frontend
- REQ-IDs: REQ-008, REQ-009, REQ-010, REQ-011, REQ-012, REQ-013, REQ-016, REQ-017, REQ-018, REQ-019
- TEST-IDs: UT-008-POS, UT-009-POS, UT-010-POS, UT-011-POS, UT-012-POS, UT-013-POS, UT-016-POS, UT-017-POS, UT-018-POS, UT-019-POS
- Tasks:
  1. Update frontend services to call real backend endpoints.
  2. Ensure UI reflects backend-fetched expenses, incomes, budgets, categories, and analytics.
  3. Write tests verifying frontend/backend integration for data display and theme.

## Stage 6: State
- REQ-IDs: REQ-032, REQ-034, REQ-037, REQ-038
- TEST-IDs: UT-032-POS, UT-034-POS, UT-037-POS, UT-038-POS
- Tasks:
  1. Ensure context providers correctly consume backend responses.
  2. Maintain persisted preferences and offline fallback behavior.
  3. Write tests for state updates after backend sync and network error handling.

## Stage 7: Auth
- REQ-IDs: REQ-005, REQ-006, REQ-020, REQ-021, REQ-022, REQ-023, REQ-024, REQ-054, REQ-056
- TEST-IDs: UT-005-POS, UT-006-POS, UT-020-POS, UT-021-POS, UT-022-POS, UT-023-POS, UT-024-POS, UT-054-POS, UT-056-POS
- Tasks:
  1. Validate secure storage of backend tokens and refresh token lifecycle.
  2. Implement request retry queue during refresh.
  3. Add handling for invalid stored tokens and auth cleanup.
  4. Write tests for token attach, refresh success/failure, and cleanup.

## Stage 8: Integration
- REQ-IDs: REQ-012, REQ-013, REQ-019, REQ-020, REQ-038, REQ-054, REQ-060
- TEST-IDs: IT-005, IT-014, IT-020, UT-054-POS, UT-060-POS
- Tasks:
  1. Integrate backend data into dashboard and analytics.
  2. Validate error normalization and user-facing messages.
  3. Verify token refresh against live backend behavior.
  4. Write integration tests for end-to-end network flows.

## Stage 9: Testing
- REQ-IDs: REQ-029, REQ-038, REQ-051, REQ-052, REQ-055, REQ-058, REQ-059
- TEST-IDs: UT-029-POS, UT-038-POS, UT-051-POS, UT-052-POS, UT-055-POS, UT-058-POS, UT-059-POS
- Tasks:
  1. Expand unit tests to cover backend error shapes and validation failures.
  2. Run tests and confirm negative cases fail before implementation.
  3. Implement bug fixes and re-run all test suites.
  4. Refactor error handling and backend integration code.

## Stage 10: Deployment
- REQ-IDs: REQ-028, REQ-030, REQ-040, REQ-050
- TEST-IDs: UT-028-POS, UT-030-POS, UT-040-POS, UT-050-POS
- Tasks:
  1. Validate final Expo EAS build configuration.
  2. Run production build checks and confirm target compatibility.
  3. Prepare release notes and system documentation.
  4. Write deployment stage tests for build config and compatibility.
