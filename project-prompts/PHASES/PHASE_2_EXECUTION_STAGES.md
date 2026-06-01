# Phase 2 — Execution Stages

This plan defines execution stages for the financial management expansion phase.
All stages are concrete and reference requirements and tests.

## Stage 1: Setup
- REQ-IDs: REQ-029, REQ-030, REQ-039
- TEST-IDs: UT-029-POS, UT-030-POS, UT-039-POS
- Tasks:
  1. Verify environment and package compatibility for feature expansion.
  2. Confirm existing app baseline tests still pass.
  3. Write tests for new service contracts and screen scaffolding.

## Stage 2: Architecture
- REQ-IDs: REQ-008, REQ-009, REQ-010, REQ-011, REQ-012, REQ-013
- TEST-IDs: UT-008-POS, UT-009-POS, UT-010-POS, UT-011-POS, UT-012-POS, UT-013-POS
- Tasks:
  1. Define data flow for income, budget, category, and analytics.
  2. Extend contexts and services for additional domain objects.
  3. Write tests for service interaction contracts and data models.

## Stage 3: Database
- REQ-IDs: REQ-034, REQ-043, REQ-064
- TEST-IDs: UT-034-POS, UT-043-POS, UT-064-POS
- Tasks:
  1. Expand local storage schema for incomes, budgets, categories.
  2. Add seeded default categories if not present.
  3. Write tests verifying local database persistence for new entities.

## Stage 4: Backend
- REQ-IDs: REQ-044, REQ-049, REQ-059, REQ-060
- TEST-IDs: UT-044-POS, UT-049-POS, UT-059-POS, UT-060-POS
- Tasks:
  1. Enhance Axios and service contracts for income/budget/category/analytics.
  2. Add response handling for analytics endpoints.
  3. Write tests for API contract consistency and unexpected payload handling.

## Stage 5: Frontend
- REQ-IDs: REQ-009, REQ-010, REQ-011, REQ-012, REQ-013, REQ-016, REQ-017, REQ-018, REQ-019
- TEST-IDs: UT-009-POS, UT-010-POS, UT-011-POS, UT-012-POS, UT-013-POS, UT-016-POS, UT-017-POS, UT-018-POS, UT-019-POS
- Tasks:
  1. Build Income screen flow and AddIncome UI.
  2. Build Budget and Category management screens.
  3. Build Dashboard and analytics screens.
  4. Add theme selection controls and apply persistent theme.
  5. Write UI tests for new screens and theme interactions.

## Stage 6: State
- REQ-IDs: REQ-032, REQ-034, REQ-037
- TEST-IDs: UT-032-POS, UT-034-POS, UT-037-POS
- Tasks:
  1. Extend context providers for income, budgets, and categories.
  2. Maintain persistent preferences and theme state.
  3. Write state tests for data propagation and theme consistency.

## Stage 7: Auth
- REQ-IDs: REQ-004, REQ-005, REQ-024, REQ-054
- TEST-IDs: UT-004-EDGE, UT-005-EDGE, UT-024-POS, UT-054-POS
- Tasks:
  1. Ensure forgot password flow remains functional with expanded app state.
  2. Verify auth persistence in presence of new data entities.
  3. Write tests for failed refresh handling and auth cleanup.

## Stage 8: Integration
- REQ-IDs: REQ-008, REQ-009, REQ-010, REQ-011, REQ-012, REQ-013, REQ-053
- TEST-IDs: IT-006, IT-007, IT-008, IT-009, IT-016
- Tasks:
  1. Integrate income and budget flows into main navigation.
  2. Validate category creation and transaction selection.
  3. Verify dashboard/analytics reflect new finance data.
  4. Write integration tests covering these combined flows.

## Stage 9: Testing
- REQ-IDs: REQ-038, REQ-051, REQ-052, REQ-055, REQ-058
- TEST-IDs: UT-038-POS, UT-051-POS, UT-052-POS, UT-055-POS, UT-058-POS
- Tasks:
  1. Write tests for validation, network error handling, and theme fallback.
  2. Run tests and confirm failures before implementation.
  3. Implement fixes and rerun tests until pass.
  4. Refactor newly added services and screens.

## Stage 10: Deployment
- REQ-IDs: REQ-028, REQ-030, REQ-040, REQ-050
- TEST-IDs: UT-028-POS, UT-030-POS, UT-040-POS, UT-050-POS
- Tasks:
  1. Revalidate Expo build configuration after adding new app sections.
  2. Confirm the app still launches on supported platforms.
  3. Write deployment checks for updated navigation and theming.
