# SYSTEM DESIGN

This document defines the ExpenseTrackingApp system design aligned to the requirements in `REQUIREMENTS.md`.

## Architecture

### 1. Client-First Mobile Application

- **Platform:** Expo-managed React Native app targeting Android, iOS, and web.
- **Entry point:** `App.tsx`
- **UI framework:** React Native Paper + custom components.
- **Navigation:** React Navigation v6 with a root stack that conditionally renders auth or main flows.
- **State management:** React Context API for global state.
  - `AuthContext` handles authentication state.
  - `ExpenseContext`, `IncomeContext`, `BudgetContext`, `CategoryContext` manage domain data state.
  - `ThemeContext` handles theme selection and persistence.
- **Services layer:** Encapsulates domain operations and abstracts storage/API access.
  - `authService.ts`, `expenseService.ts`, `incomeService.ts`, `categoryService.ts`, `budgetService.ts`, `analyticsService.ts`
- **Storage layer:** Local fallback storage through `LocalDatabase` using `AsyncStorage`.
- **Security:** Secure token/user storage via `expo-secure-store`.
- **Error handling:** Centralized API error normalization and toast notifications for user feedback.

### 2. Navigation Flow

- `RootNavigator` decides between:
  - `AuthNavigator` for unauthenticated users
  - `MainNavigator` for authenticated users
- `MainNavigator` uses a bottom tab navigator to switch between dashboard, expenses, income, budget, categories, and profile.
- Separate nested stacks for expense, income, category, and budget flows.

### 3. Backend Design (Planned)

- **Backend type:** RESTful API service.
- **Database:** MySQL database with a schema defined in `database/schema.sql`.
- **Auth model:** JWT-based auth with access and refresh tokens.
- **API contract:** Endpoints defined in `src/constants/index.ts`.
- **Fallback mode:** Client currently operates offline/local-only using `LocalDatabase` when backend is absent.

### 4. Data Flow

1. User interacts with UI screen.
2. Screen dispatches actions to a context provider or service.
3. Service either calls backend APIs through `api.ts` or local storage methods in `LocalDatabase`.
4. API client attaches auth token from secure storage and handles 401 refresh transparently.
5. Responses are normalized and propagated back to context/UI.

## Tech Stack

### Frontend

- `expo` ~51.0.28
- `react-native` 0.74.5
- `react` 18.2.0
- `typescript` ~5.3.3
- `react-native-paper` 5.x
- `react-navigation` v6
- `axios` 1.x
- `react-hook-form` 7.x
- `expo-splash-screen`
- `expo-secure-store`
- `@react-native-async-storage/async-storage`
- `react-native-toast-message`
- `react-native-vector-icons`, `@expo/vector-icons`

### Backend (Planned)

- `Node.js`
- `Express`
- `MySQL`
- `JWT` for access/refresh tokens
- `bcrypt` or equivalent for password hashing
- `express-validator` or similar for request validation
- `axios` on frontend for HTTP requests

### Database

- MySQL with UTF8MB4 charset
- Schema includes users, tokens, categories, expenses, income, budgets, analytics derived from transactions

### Infrastructure

- Expo EAS build configuration for Android APK preview and production
- Local development with `expo start`
- Environment-specific API base URL handling via `__DEV__` flag in `src/services/api.ts`

## Database Schema

The MySQL schema is defined in `database/schema.sql` and includes the following entities.

### Users

- `id` INT PK
- `name` VARCHAR(100)
- `email` VARCHAR(150) UNIQUE
- `password_hash` VARCHAR(255)
- `avatar` VARCHAR(500)
- `currency` CHAR(3) DEFAULT 'INR'
- `is_active` TINYINT(1)
- `created_at`, `updated_at`

### Password Reset Tokens

- `id` INT PK
- `user_id` FK -> users(id)
- `token` VARCHAR(255) UNIQUE
- `expires_at` TIMESTAMP
- `used_at` TIMESTAMP
- `created_at`

### Refresh Tokens

- `id` INT PK
- `user_id` FK -> users(id)
- `token` VARCHAR(500) UNIQUE
- `expires_at` TIMESTAMP
- `revoked_at` TIMESTAMP
- `created_at`

### Categories

- `id` INT PK
- `user_id` INT NULL for global default categories
- `name` VARCHAR(100)
- `icon` VARCHAR(80)
- `color` CHAR(7)
- `type` ENUM('expense','income','both')
- `is_default` TINYINT(1)
- `is_active` TINYINT(1)
- `created_at`, `updated_at`

### Expenses

- `id` INT PK
- `user_id` INT FK
- `category_id` INT FK NULLABLE
- `amount` DECIMAL(15,2)
- `description` VARCHAR(255)
- `date` DATE
- `payment_method` ENUM('cash','card','upi','bank_transfer','other')
- `notes` TEXT
- `created_at`, `updated_at`

### Income

- `id` INT PK
- `user_id` INT FK
- `amount` DECIMAL(15,2)
- `source` VARCHAR(150)
- `date` DATE
- `notes` TEXT
- `created_at`, `updated_at`

### Budgets

- `id` INT PK
- `user_id` INT FK
- `category_id` INT FK NULLABLE
- `amount` DECIMAL(15,2)
- `month` TINYINT
- `year` SMALLINT
- `alert_at` TINYINT DEFAULT 80
- `created_at`, `updated_at`
- Unique constraint on `(user_id, category_id, month, year)`

### Default Categories Seed

- A seeded set of global default categories for expense and income.

## API Design

The app uses a RESTful API contract with the following endpoints.

### Auth

- `POST /auth/register`
  - Request: `{ name, email, password, confirmPassword }`
  - Response: `{ success, data: { user, tokens }, message }`
- `POST /auth/login`
  - Request: `{ email, password }`
  - Response: `{ success, data: { user, tokens }, message }`
- `POST /auth/logout`
  - Request: bearer token auth
  - Response: `{ success, data: null, message }`
- `POST /auth/refresh`
  - Request: `{ refreshToken }`
  - Response: `{ success, data: { accessToken }, message }`
- `POST /auth/forgot-password`
  - Request: `{ email }`
  - Response: `{ success, data: null, message }`
- `POST /auth/reset-password`
  - Request: `{ token, password, confirmPassword }`
  - Response: `{ success, data: null, message }`

### User

- `GET /users/profile`
  - Request: bearer token auth
  - Response: `{ success, data: user }`
- `PUT /users/profile`
  - Request: bearer token auth, profile updates
  - Response: `{ success, data: updatedUser }`
- `POST /users/change-password`
  - Request: bearer token auth, `{ password }`
  - Response: `{ success, data: null }`

### Expenses

- `GET /expenses`
  - Query: pagination and filters
  - Response: `{ success, data: PaginatedResponse<Expense> }`
- `GET /expenses/:id`
  - Response: `{ success, data: Expense }`
- `POST /expenses`
  - Request: `CreateExpensePayload`
  - Response: `{ success, data: Expense }`
- `PUT /expenses/:id`
  - Request: partial expense updates
  - Response: `{ success, data: Expense }`
- `DELETE /expenses/:id`
  - Response: `{ success, data: null }`

### Income

- `GET /income`
  - Query: pagination and filters
  - Response: `{ success, data: PaginatedResponse<Income> }`
- `GET /income/:id`
  - Response: `{ success, data: Income }`
- `POST /income`
  - Request: `CreateIncomePayload`
  - Response: `{ success, data: Income }`
- `PUT /income/:id`
  - Request: partial income updates
  - Response: `{ success, data: Income }`
- `DELETE /income/:id`
  - Response: `{ success, data: null }`

### Categories

- `GET /categories`
  - Response: `{ success, data: Category[] }`
- `POST /categories`
  - Request: category payload
  - Response: `{ success, data: Category }`
- `PUT /categories/:id`
  - Request: partial category updates
  - Response: `{ success, data: Category }`
- `DELETE /categories/:id`
  - Response: `{ success, data: null }`

### Budgets

- `GET /budgets`
  - Response: `{ success, data: Budget[] }`
- `GET /budgets/:id`
  - Response: `{ success, data: Budget }`
- `POST /budgets`
  - Request: `CreateBudgetPayload`
  - Response: `{ success, data: Budget }`
- `PUT /budgets/:id`
  - Request: partial budget updates
  - Response: `{ success, data: Budget }`
- `DELETE /budgets/:id`
  - Response: `{ success, data: null }`

### Analytics

- `GET /analytics/dashboard`
  - Response: `{ success, data: DashboardSummary }`
- `GET /analytics/monthly`
  - Query: optional `months`
  - Response: `{ success, data: MonthlyStats[] }`
- `GET /analytics/categories`
  - Query: optional `type`, `month`, `year`
  - Response: `{ success, data: CategoryBreakdown[] }`

## Folder Structure

```
ExpenseTrackingApp/
├── App.tsx
├── app.json
├── babel.config.js
├── database/
│   └── schema.sql
├── eas.json
├── package.json
├── project-prompts/
│   ├── REQUIREMENTS.md
│   ├── SYSTEM_DESIGN.md
│   └── TESTS/
│       ├── E2E_TESTS.md
│       ├── INTEGRATION_TESTS.md
│       ├── REQUIREMENT_TEST_MAP.md
│       └── UNIT_TESTS.md
├── README.md
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── cards/
│   │   ├── common/
│   │   └── forms/
│   ├── constants/
│   │   ├── index.ts
│   │   ├── theme.ts
│   │   └── types.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── BudgetContext.tsx
│   │   ├── CategoryContext.tsx
│   │   ├── ExpenseContext.tsx
│   │   └── ThemeContext.tsx
│   ├── navigation/
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   ├── RootNavigator.tsx
│   │   └── stacks/
│   │       ├── BudgetStack.tsx
│   │       ├── CategoryStack.tsx
│   │       ├── ExpenseStack.tsx
│   │       └── IncomeStack.tsx
│   ├── screens/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── budget/
│   │   ├── categories/
│   │   ├── dashboard/
│   │   ├── expenses/
│   │   ├── income/
│   │   └── profile/
│   ├── services/
│   │   ├── api.ts
│   │   ├── analyticsService.ts
│   │   ├── authService.ts
│   │   ├── budgetService.ts
│   │   ├── categoryService.ts
│   │   ├── expenseService.ts
│   │   ├── incomeService.ts
│   │   ├── localDatabase.ts
│   │   └── secureStorage.ts
│   └── utils/
│       └── index.ts
└── tsconfig.json
```

## Notes

- The system design is fully aligned with the current requirements and supports both local fallback storage and future backend integration.
- Auth and analytics contracts are explicitly defined to support JWT refresh, request queuing, and data-driven dashboards.
