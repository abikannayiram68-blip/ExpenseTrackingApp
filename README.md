# ExpenseTrackingApp

A production-ready Expo + React Native expense tracking app with JWT auth, full CRUD, analytics, and APK build support.

## Tech Stack

**Frontend:** React Native · Expo SDK 51 · TypeScript · React Navigation v6 · React Native Paper · Context API · Axios · SecureStore

**Backend (Phase 3):** Node.js · Express · JWT · MySQL

---

## Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (for builds): `npm install -g eas-cli`

### Install & Run

```bash
cd ExpenseTrackingApp
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your Android device.

### Build APK (Preview)

```bash
eas login
eas build:configure   # first time only
eas build -p android --profile preview
```

---

## Project Structure

```
ExpenseTrackingApp/
├── App.tsx                    # Root entry point
├── app.json                   # Expo config
├── eas.json                   # EAS Build profiles
├── babel.config.js            # Path aliases
├── tsconfig.json
├── database/
│   └── schema.sql             # MySQL schema
└── src/
    ├── assets/
    ├── components/
    │   ├── cards/             # GradientHeader, SummaryCard, EmptyState
    │   ├── common/            # AppButton, AppInput
    │   └── forms/
    ├── constants/
    │   ├── index.ts           # API endpoints, categories, payment methods
    │   ├── theme.ts           # Colors, typography, spacing, shadows
    │   └── types.ts           # All TypeScript interfaces
    ├── context/
    │   ├── AuthContext.tsx    # JWT auth state + auto-login
    │   ├── ExpenseContext.tsx # CRUD + pagination + filters
    │   └── ThemeContext.tsx   # Dark/light mode
    ├── hooks/                 # Custom hooks (Phase 2+)
    ├── navigation/
    │   ├── RootNavigator.tsx  # Auth-gated root
    │   ├── AuthNavigator.tsx  # Login/Register/ForgotPassword
    │   ├── MainNavigator.tsx  # Bottom tab bar
    │   └── stacks/            # Expense / Income / Budget stacks
    ├── screens/               # All 14 screens (Phase 2: full UI)
    ├── services/
    │   ├── api.ts             # Axios instance + interceptors + token refresh
    │   ├── authService.ts     # Login/Register/Logout/SecureStore
    │   └── expenseService.ts  # Expense, Income, Budget, Analytics APIs
    └── utils/
        └── index.ts           # Currency, date, validation helpers
```

---

## Environment Setup

Update the `BASE_URL` in `src/services/api.ts`:

```ts
const BASE_URL = __DEV__
  ? 'http://YOUR_LOCAL_IP:3000/api/v1'
  : 'https://api.yourapp.com/api/v1';
```

---

## Build Phases

| Phase | Status | Contents |
|-------|--------|----------|
| **Phase 1** | ✅ Complete | Setup, structure, navigation, context, services |
| **Phase 2** | Pending approval | Full screen UI (Auth, Dashboard, CRUD screens) |
| **Phase 3** | Pending approval | Node.js/Express backend + MySQL |

---

## Key Features

- **Auto-login** via SecureStore token persistence
- **JWT refresh** with queued retry on 401
- **Protected routes** (no login = Auth stack)
- **Dark mode** system/manual toggle
- **Custom tab bar** with active indicators
- **Path aliases** (`@components/`, `@screens/`, etc.)
- **Full TypeScript** coverage
- **APK-ready** EAS build config
