# Phase 10: State and Services

Phase 10 builds shared state and service layers for app data.

## Goals
- Add centralized state using Context API.
- Create services for API calls and local helpers.
- Organize data logic away from screens.

## Tasks
- Create `AuthContext.tsx`, `ExpenseContext.tsx`, `IncomeContext.tsx`, `BudgetContext.tsx`, and `CategoryContext.tsx`.
- Add state providers for auth, expenses, income, budgets, and categories.
- Create `src/services/api.ts` with Axios instance and token support.
- Add `authService.ts`, `expenseService.ts`, `incomeService.ts`, `budgetService.ts`, `categoryService.ts`, and `analyticsService.ts`.
- Create helper functions in `src/utils/index.ts` for currency, date formatting, and validation.

## Expected Results
- Screens use context data instead of local state only.
- Service files handle network and backend interaction.
- The app code is easier to maintain.

## Notes
- Keep service methods simple and predictable.
- Use contexts to pass data and actions to screens.
