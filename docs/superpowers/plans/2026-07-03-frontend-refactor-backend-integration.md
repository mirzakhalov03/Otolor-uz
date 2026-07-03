# Frontend Refactor + Backend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the JWT-broken admin panel, harden the public booking flow against the new backend error contract, and land the safe cleanups/perf/i18n fixes plus two behavior-preserving refactors.

**Architecture:** A single normalized error type (`ApiError`) produced by an axios response interceptor is the shared spine. A request interceptor attaches the Bearer token; a conditional response interceptor redirects to login on session-expiry 401 (skipping login + public booking). Auth, booking, and admin all consume the normalized shape. Everything else (dead-code removal, perf, i18n, refactors) hangs off that spine.

**Tech Stack:** React 19, Vite 7, TypeScript, Ant Design 6, TanStack React Query 5, axios, i18next, dayjs.

## Global Constraints

- **No test runner exists on the frontend.** Verification per task = `npm run lint` (ESLint) + `npm run build` (tsc) + the manual steps written in the task. Do NOT add a test framework.
- **localStorage token key is `access_token`** — reuse it verbatim; the route guards read it.
- **Backend runs on `:5050`.** Response envelope is `{ success, message, data, pagination? }`; services unwrap `data`.
- **Uzbek (`uz`) is the default/fallback language.** New user-facing strings are translation keys added to all three of `public/locales/{uz,ru,en}/translation.json`. Do not introduce English inline defaults.
- **Dates are `YYYY-MM-DD` strings in clinic tz (Asia/Tashkent).** Never round-trip through browser-local `new Date()`/`dayjs()` in a way that shifts the day.
- **Availability window is 7 days**, not 30.
- **Import alias:** `@` → `src`.
- **Commit after every task.** Run from `Otolor-uz-front-simple/` (its own git repo).

---

## File Structure

**New files:**
- `src/api/errors.ts` — `ApiError` class + `normalizeAxiosError()`.
- `src/api/authEvents.ts` — module-level unauthorized-event bridge (decouples axios from React).
- `src/api/services/authService.ts` — `loginRequest()`.
- `src/utils/clinicTime.ts` — Asia/Tashkent date helpers.
- `src/components/languageSelector/LanguageSwitcher.tsx` — unified selector (Task 19).
- `src/pages/appointments/components/appointmentForm/BookingConfirmationModal.tsx` (Task 17).
- `src/pages/appointments/components/appointmentForm/validateBookingForm.ts` (Task 17).
- `src/pages/admin/doctors/useDoctorSchedule.ts` + `ScheduleEditor.tsx` (Task 18).

**Modified (major):** `src/api/services/api.ts`, `src/context/AuthContext.tsx`, `src/pages/admin/login/AdminLogin.tsx`, `src/pages/appointments/components/appointmentForm/AppointmentsForm.tsx`, `src/pages/appointments/components/appointmentForm/WeeklyCalendar.tsx`, `src/pages/admin/doctors/DoctorsPage.tsx`, `src/languages/i18next.ts`, `src/main.tsx`, `src/components/layout/Layout.tsx`.

**Deleted:** `src/mocks/`, `src/utils/debounce.ts`, `src/components/langSelector/`, dead `utils` helpers, `lenis` + `react-icons` + `framer-motion` deps.

---

# PHASE 0 — The shared axios spine

### Task 1: `ApiError` type + normalizer

**Files:**
- Create: `src/api/errors.ts`

**Interfaces:**
- Produces: `class ApiError extends Error { status: number; code: ApiErrorCode; fieldErrors?: FieldError[] }`, `type ApiErrorCode`, `function normalizeAxiosError(error: unknown): ApiError`, `interface FieldError { field: string; message: string }`.

- [ ] **Step 1: Create `src/api/errors.ts`**

```ts
import axios, { type AxiosError } from 'axios';

export type ApiErrorCode =
  | 'validation'   // 400 with a field-level errors[] array
  | 'business'     // 400 business rule (off-grid slot, past date, schedule conflict)
  | 'conflict'     // 409 double-booking
  | 'auth'         // 401
  | 'rate_limit'   // 429
  | 'network'      // no response (offline / timeout)
  | 'unknown';

export interface FieldError {
  field: string;
  message: string;
}

interface BackendErrorBody {
  success?: boolean;
  message?: string;
  errors?: FieldError[];
}

/** One normalized error shape the whole app reads. */
export class ApiError extends Error {
  status: number;
  code: ApiErrorCode;
  fieldErrors?: FieldError[];

  constructor(args: { status: number; code: ApiErrorCode; message: string; fieldErrors?: FieldError[] }) {
    super(args.message);
    this.name = 'ApiError';
    this.status = args.status;
    this.code = args.code;
    this.fieldErrors = args.fieldErrors;
  }
}

/** Convert any thrown axios error into an ApiError. */
export function normalizeAxiosError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return new ApiError({ status: 0, code: 'unknown', message: 'Unexpected error.' });
  }

  const err = error as AxiosError<BackendErrorBody>;

  if (!err.response) {
    return new ApiError({
      status: 0,
      code: 'network',
      message: 'Network error. Please check your connection and try again.',
    });
  }

  const { status, data } = err.response;
  const message = data?.message || 'Something went wrong. Please try again.';
  const fieldErrors = Array.isArray(data?.errors) ? data.errors : undefined;

  let code: ApiErrorCode = 'unknown';
  if (status === 400) code = fieldErrors ? 'validation' : 'business';
  else if (status === 409) code = 'conflict';
  else if (status === 401) code = 'auth';
  else if (status === 429) code = 'rate_limit';

  return new ApiError({ status, code, message, fieldErrors });
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors referencing `src/api/errors.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/api/errors.ts
git commit -m "feat(api): add normalized ApiError type + normalizer"
```

---

### Task 2: Wire the three interceptors + auth-event bridge

**Files:**
- Create: `src/api/authEvents.ts`
- Modify: `src/api/services/api.ts`

**Interfaces:**
- Consumes: `normalizeAxiosError`, `ApiError` (Task 1).
- Produces: `setUnauthorizedHandler(fn: (() => void) | null)`, `emitUnauthorized()`. The default axios instance now **rejects with `ApiError`** (not raw AxiosError) for every failed request.

- [ ] **Step 1: Create `src/api/authEvents.ts`**

```ts
// Decouples the axios module from React: the interceptor emits, AuthProvider handles.
type UnauthorizedHandler = () => void;

let handler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(fn: UnauthorizedHandler | null): void {
  handler = fn;
}

export function emitUnauthorized(): void {
  handler?.();
}
```

- [ ] **Step 2: Replace `src/api/services/api.ts` with the interceptor-wired version**

```ts
import axios from 'axios';
import { normalizeAxiosError } from '../errors';
import { emitUnauthorized } from '../authEvents';

const TOKEN_KEY = 'access_token';

// Paths where a 401 is surfaced inline (bad password / patient error), NOT a session expiry.
// Exact-match on request `url` (params travel separately, so availability url is exact).
const AUTH_EXEMPT_PATHS = ['/auth/login', '/appointments', '/appointments/availability'];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// 2a. Attach Bearer token when present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2b + 2c. Normalize every error; on session-expiry 401, clear token + emit redirect.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = normalizeAxiosError(error);
    const url: string = error?.config?.url ?? '';
    const isExempt = AUTH_EXEMPT_PATHS.includes(url);

    if (apiError.code === 'auth' && !isExempt) {
      localStorage.removeItem(TOKEN_KEY);
      emitUnauthorized();
    }

    return Promise.reject(apiError);
  },
);

export default api;
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean (no references to the removed raw-axios shape break, since services only read `data`).

- [ ] **Step 4: Manual smoke — public reads still work**

Start backend (`:5050`) + `npm run dev`. Load the public site; confirm doctors/services render (request interceptor is harmless without a token; normalizer doesn't touch success responses).

- [ ] **Step 5: Commit**

```bash
git add src/api/authEvents.ts src/api/services/api.ts
git commit -m "feat(api): request/response/401 interceptors on the axios instance"
```

---

# PHASE A — Restore + integrate

### Task 3: `authService.loginRequest`

**Files:**
- Create: `src/api/services/authService.ts`

**Interfaces:**
- Consumes: default `api` instance (rejects with `ApiError`).
- Produces: `async function loginRequest(username: string, password: string): Promise<{ token: string; expiresIn: string }>`.

- [ ] **Step 1: Create `src/api/services/authService.ts`**

```ts
import api from './api';

interface LoginData {
  token: string;
  expiresIn: string; // e.g. "7d" — string, not a number
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/** POST /api/auth/login — throws ApiError (code 'auth') on bad credentials. */
export async function loginRequest(username: string, password: string): Promise<LoginData> {
  const { data } = await api.post<ApiEnvelope<LoginData>>('/auth/login', { username, password });
  return data.data;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/api/services/authService.ts
git commit -m "feat(auth): add authService.loginRequest"
```

---

### Task 4: Real `AuthContext` (async login + 401 handler)

**Files:**
- Modify: `src/context/AuthContext.tsx`

**Interfaces:**
- Consumes: `loginRequest` (Task 3), `ApiError` (Task 1), `setUnauthorizedHandler` (Task 2), `useNavigate` (AuthProvider sits inside `BrowserRouter`).
- Produces: `login(username, password): Promise<{ success: boolean; message?: string }>` (now **async**), `logout()`, `isAuthenticated`.

- [ ] **Step 1: Replace `src/context/AuthContext.tsx`**

```tsx
/**
 * Auth Context Provider
 * Real JWT auth against POST /api/auth/login. Token stored in localStorage['access_token'].
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '@/api/services/authService';
import { setUnauthorizedHandler } from '@/api/authEvents';
import { ApiError } from '@/api/errors';

const TOKEN_KEY = 'access_token';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/** A token existing is treated as "logged in". A stale token is caught by the 401 interceptor. */
const hasToken = (): boolean => {
  try {
    return !!localStorage.getItem(TOKEN_KEY);
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(hasToken);
  const navigate = useNavigate();

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { token } = await loginRequest(username, password);
      localStorage.setItem(TOKEN_KEY, token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : undefined;
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  }, []);

  // Bridge: the axios 401 interceptor calls this to log out + redirect.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setIsAuthenticated(false);
      navigate('/admins-otolor/login', { replace: true });
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  const value: AuthContextType = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: one expected error in `AdminLogin.tsx` — `login(...)` now returns a Promise and `result.messageKey` no longer exists. Fixed in Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/context/AuthContext.tsx
git commit -m "feat(auth): real JWT login in AuthContext + 401 redirect bridge"
```

---

### Task 5: `AdminLogin` awaits async login

**Files:**
- Modify: `src/pages/admin/login/AdminLogin.tsx:31-49`

**Interfaces:**
- Consumes: async `login` from Task 4.

- [ ] **Step 1: Replace the `onFinish` handler**

Replace lines 31-49 (the `onFinish` function) with:

```tsx
  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    const result = await login(values.username, values.password);

    if (result.success) {
      message.success(t('adminLogin.toasts.welcomeBack'));
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admins-otolor';
      navigate(from, { replace: true });
    } else {
      setError(result.message || t('auth.invalidCredentials'));
    }

    setLoading(false);
  };
```

(The fake 500ms `await new Promise(...)` delay is removed; the real network round-trip provides the latency.)

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean.

- [ ] **Step 3: Manual — login flow**

Set backend `.env` `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `JWT_SECRET`. With backend + `npm run dev`:
- Wrong password → red `Alert` with the server message, URL stays on `/admins-otolor/login` (no redirect loop).
- Correct password → toast + navigate to `/admins-otolor`; `localStorage.access_token` holds a real JWT (check DevTools).
- In DevTools Application, delete the token, then trigger any admin write → single redirect back to login.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/login/AdminLogin.tsx
git commit -m "feat(auth): AdminLogin awaits async login, shows server error"
```

---

### Task 6: Booking form error handling via `ApiError` + 409 refetch

**Files:**
- Modify: `src/pages/appointments/components/appointmentForm/AppointmentsForm.tsx`
- Modify: `public/locales/{uz,ru,en}/translation.json`

**Interfaces:**
- Consumes: `ApiError` (Task 1), React Query `useQueryClient`.

- [ ] **Step 1: Add the slot-taken translation key to all three locale files**

Under the existing `appointments` object in each file, add:
- `public/locales/uz/translation.json`: `"errorSlotTaken": "Bu vaqt allaqachon band qilindi. Iltimos, boshqa vaqtni tanlang."`
- `public/locales/ru/translation.json`: `"errorSlotTaken": "Это время уже занято. Пожалуйста, выберите другое."`
- `public/locales/en/translation.json`: `"errorSlotTaken": "This time slot was just booked. Please choose another."`

- [ ] **Step 2: Swap the axios import for ApiError + queryClient**

In `AppointmentsForm.tsx`, delete `import axios from 'axios';` (line 9). Add near the other imports:

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/errors';
```

Inside the component, after `const bookMutation = useBookAppointment();` add:

```tsx
  const queryClient = useQueryClient();
```

- [ ] **Step 3: Replace the `onError` handler (lines 142-157)**

```tsx
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.code === 'validation' && error.fieldErrors) {
              setFieldErrors(error.fieldErrors);
            } else if (error.code === 'conflict') {
              // Slot was taken between load and submit: message + drop stale slot + refetch.
              setApiError(t('appointments.errorSlotTaken'));
              setSelectedTime(null);
              queryClient.invalidateQueries({
                queryKey: ['availableTimeSlots', doctorId, selectedDate],
              });
            } else {
              // business (off-grid/past), rate_limit (429), network, unknown
              setApiError(error.message);
            }
          } else {
            setApiError(t('appointments.error'));
          }
        },
```

- [ ] **Step 4: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean; no remaining `axios.isAxiosError` reference in the file (`grep -n "axios" src/pages/appointments/components/appointmentForm/AppointmentsForm.tsx` → no matches).

- [ ] **Step 5: Manual — double-booking**

Open the booking page in two tabs, select the same doctor/date/slot, submit both. Second submit → the slot-taken message appears, the selected time clears, and the time-slot grid refetches (the taken slot disappears). Submit a valid booking → confirmation modal with order number.

- [ ] **Step 6: Commit**

```bash
git add src/pages/appointments/components/appointmentForm/AppointmentsForm.tsx public/locales
git commit -m "feat(booking): handle 400/409/429 via ApiError + refetch on conflict"
```

---

### Task 7: Clinic-time helper + WeeklyCalendar (Tashkent dates + i18n day/month)

Covers spec A3 (past-date/Tashkent alignment) **and** B7 part 1 (day/month i18n) — one file, one task.

**Files:**
- Create: `src/utils/clinicTime.ts`
- Modify: `src/pages/appointments/components/appointmentForm/WeeklyCalendar.tsx`
- Modify: `public/locales/{uz,ru,en}/translation.json`

**Interfaces:**
- Produces: `clinicToday(): dayjs.Dayjs`, `clinicNext7(): dayjs.Dayjs[]`, `CLINIC_TZ`.

- [ ] **Step 1: Create `src/utils/clinicTime.ts`**

```ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const CLINIC_TZ = 'Asia/Tashkent';

/** Start-of-day "today" anchored to the clinic timezone (not the browser's). */
export function clinicToday(): dayjs.Dayjs {
  return dayjs().tz(CLINIC_TZ).startOf('day');
}

/** The next 7 clinic-local days [today, today+6] as dayjs values. */
export function clinicNext7(): dayjs.Dayjs[] {
  const start = clinicToday();
  return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
}
```

- [ ] **Step 2: Add day/month name arrays to all three locale files**

Add a top-level `weeklyCalendar` object to each `translation.json`:
- uz: `"weeklyCalendar": { "days": ["Yak","Dush","Sesh","Chor","Pay","Jum","Shan"], "months": ["Yan","Fev","Mar","Apr","May","Iyun","Iyul","Avg","Sen","Okt","Noy","Dek"] }`
- ru: `"weeklyCalendar": { "days": ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"], "months": ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"] }`
- en: `"weeklyCalendar": { "days": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], "months": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] }`

- [ ] **Step 3: Rewrite the date logic + name lookups in `WeeklyCalendar.tsx`**

At the top, add imports and translation:

```tsx
import { useTranslation } from 'react-i18next';
import { clinicNext7, clinicToday } from '@/utils/clinicTime';
```

Inside the component add `const { t } = useTranslation();`. Replace `getNextWeek` + `weekDays` (lines 13-25) with:

```tsx
    const weekDays = clinicNext7();
```

Replace `getDayName` / `getMonthName` (lines 42-50) with:

```tsx
    const days = t('weeklyCalendar.days', { returnObjects: true }) as string[];
    const months = t('weeklyCalendar.months', { returnObjects: true }) as string[];

    const getDayName = (date: Dayjs): string => days[date.day()];
    const getMonthName = (date: Dayjs): string => months[date.month()];
```

Replace the `isToday` comparison (line 71) to use clinic today:

```tsx
                const isToday = day.isSame(clinicToday(), 'day');
```

Remove the now-unused `import 'dayjs/locale/uz-latn';` (line 2).

- [ ] **Step 4: Typecheck + lint + build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 5: Manual — locale + tz**

`npm run dev`, open booking. Switch language UZ→RU→EN and confirm the calendar day/month labels change. Confirm "today" highlight and available dates match Tashkent (relevant if your machine is in another tz — no off-by-one day).

- [ ] **Step 6: Commit**

```bash
git add src/utils/clinicTime.ts src/pages/appointments/components/appointmentForm/WeeklyCalendar.tsx public/locales
git commit -m "feat(booking): anchor calendar to Asia/Tashkent + i18n day/month names"
```

---

### Task 8: DoctorsPage — Tashkent schedule keys + surface conflict message + copy fix

**Files:**
- Modify: `src/pages/admin/doctors/DoctorsPage.tsx:55-80`
- Modify: `src/api/services/appointmentService.ts` (docstring copy)

**Interfaces:**
- Consumes: `clinicToday` (Task 7), `ApiError.message` flows through the existing `getErrorMessage` fallback.

- [ ] **Step 1: Anchor `getNext7Days` to clinic tz**

In `DoctorsPage.tsx`, add import:

```tsx
import { clinicToday } from '@/utils/clinicTime';
```

Replace the body of `getNext7Days` (lines 70-77 loop) so day 0 is clinic today:

```tsx
  const start = clinicToday();
  for (let i = 0; i < 7; i++) {
    const d = start.add(i, 'day');
    days.push({
      dateStr: d.format('YYYY-MM-DD'),
      dayIndex: d.day(),
      isSunday: d.day() === 0,
    });
  }
```

- [ ] **Step 2: Simplify `getErrorMessage` to read `ApiError.message`**

Replace `getErrorMessage` (lines 55-61) with:

```tsx
import { ApiError } from '@/api/errors';

const getErrorMessage = (error: unknown, fallback: string): string => {
  return error instanceof ApiError ? error.message : fallback;
};
```

This surfaces the backend's schedule-conflict 400 message verbatim (it already flows to `message.error(getErrorMessage(error, ...))` at lines 173 and 245).

- [ ] **Step 3: Fix stale "30 days" copy in `appointmentService.ts`**

Change the `getAvailableDates` docstring "next 30 days where they work" → "next 7 days where they work".

- [ ] **Step 4: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean.

- [ ] **Step 5: Manual — schedule save + conflict**

Log in as admin. Create a doctor with a next-7-days schedule → saves (no 400). Book a pending appointment against that doctor, then edit the doctor to remove that date / shorten hours → the backend 400 conflict message shows verbatim in an AntD error toast.

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/doctors/DoctorsPage.tsx src/api/services/appointmentService.ts
git commit -m "feat(admin): Tashkent-anchored schedule keys + surface conflict message"
```

---

### Task 9: Config alignment (:3000 → :5050)

**Files:**
- Modify: `.env.example`
- Modify: `vite.config.ts:server.proxy`

- [ ] **Step 1: Fix `.env.example`**

Change `VITE_API_BASE_URL=http://localhost:3000/api/v1` → `VITE_API_BASE_URL=http://localhost:5050/api`.

- [ ] **Step 2: Fix the dev proxy target in `vite.config.ts`**

Change the proxy `target: 'http://localhost:3000'` → `target: 'http://localhost:5050'`.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: clean. (Config-only; no runtime import of these.)

- [ ] **Step 4: Commit**

```bash
git add .env.example vite.config.ts
git commit -m "chore(config): point API base URL + dev proxy at :5050"
```

---

# PHASE B — Cleanups, perf, i18n (low risk)

### Task 10: Remove dead dependencies

**Files:** Modify `package.json` / `package-lock.json`

- [ ] **Step 1: Confirm zero imports**

Run: `grep -rn "from 'lenis'\|from \"lenis\"\|react-icons" src`
Expected: no matches.

- [ ] **Step 2: Remove**

Run: `npm remove lenis react-icons`

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): remove unused lenis + react-icons"
```

---

### Task 11: Fix i18n language persistence

**Files:** Modify `src/languages/i18next.ts:15`

- [ ] **Step 1: Remove the forced `lng`**

Delete the line `lng: 'uz', // Force Uzbek as initial language`. Keep `fallbackLng: 'uz'`, `supportedLngs`, and the whole `detection` block.

- [ ] **Step 2: Manual — persistence**

`npm run dev`. Switch to RU, reload the page → stays RU. Clear `localStorage` + cookies, reload → defaults to UZ (via fallback).

- [ ] **Step 3: Commit**

```bash
git add src/languages/i18next.ts
git commit -m "fix(i18n): stop forcing lng so language choice persists"
```

---

### Task 12: React Query `staleTime`

**Files:** Modify `src/main.tsx:10-17`, `src/api/query/useAppointments.ts`

- [ ] **Step 1: Add default `staleTime`**

In `main.tsx`, update the `QueryClient` defaults:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 min — doctors/services/categories are near-static
    },
  },
})
```

- [ ] **Step 2: Keep availability fresh (override to 0)**

In `useAppointments.ts`, add `staleTime: 0` to both `useAvailableDates` and `useAvailableTimeSlots` query configs (slots change as people book):

```tsx
  return useQuery({
    queryKey: ['availableTimeSlots', doctorId, date],
    queryFn: () => getAvailableTimeSlots(doctorId!, date!),
    enabled: !!doctorId && !!date,
    staleTime: 0,
  });
```

(Apply the same `staleTime: 0` to `useAvailableDates`.)

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx src/api/query/useAppointments.ts
git commit -m "perf(query): 5min default staleTime, keep availability at 0"
```

---

### Task 13: Replace `framer-motion` with CSS transition

**Files:** Modify `src/components/layout/Layout.tsx`; create `src/components/layout/layout.scss`; remove dep

- [ ] **Step 1: Rewrite `Layout.tsx` without framer-motion**

```tsx
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Footer } from '../footer';
import './layout.scss';

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      {/* key re-mounts on route change to retrigger the CSS fade */}
      <div key={location.pathname} className="page-transition">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
```

- [ ] **Step 2: Create `src/components/layout/layout.scss`**

```scss
.page-transition {
  animation: pageFadeIn 0.2s ease-in;
}

@keyframes pageFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .page-transition {
    animation: none;
  }
}
```

- [ ] **Step 3: Remove the dependency**

Run: `grep -rn "framer-motion" src` → expect no matches, then `npm remove framer-motion`.

- [ ] **Step 4: Build + manual**

Run: `npm run build`. Then `npm run dev`, navigate between public pages → 0.2s fade still plays; with OS "reduce motion" on, no animation.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Layout.tsx src/components/layout/layout.scss package.json package-lock.json
git commit -m "perf(layout): CSS page fade, drop framer-motion"
```

---

### Task 14: Delete dead code

**Files:** Delete `src/mocks/`, `src/utils/debounce.ts`, `src/pages/servicesPage/data/`; trim `src/utils/index.ts`; remove commented blocks in `Home.tsx` + `Courses.tsx`

- [ ] **Step 1: Confirm nothing imports the mocks or dead helpers**

Run: `grep -rn "mocks/\|debounce\|throttle\|deepClone\|formatCurrency\|from '@/utils'\|capitalize" src | grep -v "src/utils/index.ts\|src/utils/debounce.ts\|src/mocks/"`
Expected: only `getInitials` call sites (2). If any dead helper shows a real consumer, STOP and keep it.

- [ ] **Step 2: Delete dead files/dirs**

Run:
```bash
rm -rf src/mocks
rm src/utils/debounce.ts
rm -rf src/pages/servicesPage/data
```

- [ ] **Step 3: Trim `src/utils/index.ts` to just `getInitials`**

Replace the whole file with:

```ts
/**
 * Utility Functions
 */

/** Generates initials from a name. */
export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
}
```

- [ ] **Step 4: Remove commented-out imports/blocks**

- `src/pages/home/Home.tsx:1-18` — delete the commented `AboutUs`/`Features`/`Services` imports and their commented usages.
- `src/pages/academy/courses/Courses.tsx:69-98` — delete the commented `otherCourses` block.

- [ ] **Step 5: Build**

Run: `npx tsc --noEmit && npm run build`
Expected: clean (proves nothing referenced the deleted code).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: delete unused mocks, dead utils helpers, commented code"
```

---

### Task 15: Optimize the hero background image

**Files:** Add WebP asset; update its import/reference

- [ ] **Step 1: Find where the hero PNG is referenced**

Run: `grep -rn "otolor-hero-bg" src`
Note the importing file(s).

- [ ] **Step 2: Generate a WebP variant**

Run: `npx @squoosh/cli --webp '{"quality":80}' -d src/assets/images src/assets/images/otolor-hero-bg.png`
Expected: `src/assets/images/otolor-hero-bg.webp` created, materially smaller than 792 KB.

- [ ] **Step 3: Point the import at the `.webp`**

In each file found in Step 1, change the import extension `otolor-hero-bg.png` → `otolor-hero-bg.webp`. (Vite handles `.webp` imports natively.) Delete the `.png` once no reference remains (`grep -rn "otolor-hero-bg.png" src` → no matches).

- [ ] **Step 4: Build + manual**

Run: `npm run build`. `npm run dev` → hero renders identically; Network tab shows the smaller WebP.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "perf(assets): serve hero background as WebP"
```

---

### Task 16: Drop English inline defaults in the booking flow

**Files:** Modify `src/pages/appointments/components/appointmentForm/AppointmentsForm.tsx`; ensure keys in `public/locales/{uz,ru,en}/translation.json`

Scope: only the booking flow (already touched in Task 6/7), per spec §B7 — not an app-wide sweep.

- [ ] **Step 1: List the inline-default keys in the form**

Run: `grep -n "t('appointments" src/pages/appointments/components/appointmentForm/AppointmentsForm.tsx`
For each `t('appointments.x', 'English default')`, confirm key `appointments.x` exists in all three locale files. Add any missing key with proper UZ/RU/EN translations (use the existing English default as the EN value and translate for UZ/RU).

- [ ] **Step 2: Remove the English second argument**

Change each `t('appointments.x', 'English default')` → `t('appointments.x')` in `AppointmentsForm.tsx`. (Now a missing key falls back to UZ per `fallbackLng`, not English.)

- [ ] **Step 3: Typecheck + manual**

Run: `npx tsc --noEmit`. `npm run dev` → open booking in UZ/RU/EN; all form labels/messages localized, no raw key strings visible.

- [ ] **Step 4: Commit**

```bash
git add src/pages/appointments/components/appointmentForm/AppointmentsForm.tsx public/locales
git commit -m "i18n(booking): drop English inline defaults, rely on locale files"
```

---

# PHASE C — Refactors (behavior-preserving)

### Task 17: Extract `validateBookingForm` + `BookingConfirmationModal`

**Files:**
- Create: `src/pages/appointments/components/appointmentForm/validateBookingForm.ts`
- Create: `src/pages/appointments/components/appointmentForm/BookingConfirmationModal.tsx`
- Modify: `src/pages/appointments/components/appointmentForm/AppointmentsForm.tsx`

**Interfaces:**
- Produces: `validateBookingForm(input): { apiError?: string; fieldErrors?: FieldError[] } | null` (null = valid); `<BookingConfirmationModal open confirmation onClose />`.

- [ ] **Step 1: Create `validateBookingForm.ts`**

```ts
import type { TFunction } from 'i18next';
import type { FieldError } from '@/api/errors';

interface ValidateInput {
  hasDoctor: boolean;
  selectedDate: string | null;
  selectedTime: string | null;
  fullName: string;
  phoneNumber: string;
  age: string;
}

export interface ValidationResult {
  apiError?: string;
  fieldErrors?: FieldError[];
}

/** Returns null when valid, otherwise the first error to show. Mirrors the old inline checks. */
export function validateBookingForm(input: ValidateInput, t: TFunction): ValidationResult | null {
  if (!input.hasDoctor || !input.selectedDate || !input.selectedTime) {
    return { apiError: t('appointments.errorSelectAll') };
  }
  if (!input.fullName.trim()) {
    return { fieldErrors: [{ field: 'fullName', message: t('appointments.errorFullName') }] };
  }
  if (!input.phoneNumber.trim()) {
    return { fieldErrors: [{ field: 'phoneNumber', message: t('appointments.errorPhone') }] };
  }
  if (!input.age.trim()) {
    return { fieldErrors: [{ field: 'age', message: t('appointments.errorAge') }] };
  }
  return null;
}
```

- [ ] **Step 2: Create `BookingConfirmationModal.tsx`**

Move the JSX from `AppointmentsForm.tsx:311-361` into a presentational component:

```tsx
import { Modal, Button } from 'antd';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface BookingConfirmation {
  orderNumber: string;
  fullName: string;
  doctorName: string;
  date: string;
  time: string;
}

interface Props {
  open: boolean;
  confirmation: BookingConfirmation | null;
  onClose: () => void;
}

const BookingConfirmationModal = ({ open, confirmation, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose} size="large">
          {t('common.close')}
        </Button>,
      ]}
      centered
      className="booking-confirmation-modal"
      width={480}
    >
      {confirmation && (
        <div className="confirmation-content">
          <div className="confirmation-icon"><CheckCircle size={64} /></div>
          <h2 className="confirmation-title">{t('appointments.modal.title')}</h2>
          <div className="order-number">
            <span className="order-label">{t('appointments.modal.orderNumber')}</span>
            <span className="order-value">{confirmation.orderNumber}</span>
          </div>
          <div className="patient-info">
            <p className="patient-name"><strong>{t('appointments.modal.patient')}:</strong> {confirmation.fullName}</p>
            <p className="doctor-info"><strong>{t('appointments.modal.doctor')}:</strong> {confirmation.doctorName}</p>
            <p className="appointment-datetime"><strong>{t('appointments.modal.datetime')}:</strong> {confirmation.date} | {confirmation.time}</p>
          </div>
          <div className="rules-section">
            <h3 className="rules-title">{t('appointments.modal.rulesTitle')}</h3>
            <ul className="rules-list">
              <li>{t('appointments.modal.rule1')}</li>
              <li>{t('appointments.modal.rule2')}</li>
              <li>{t('appointments.modal.rule3')}</li>
              <li>{t('appointments.modal.rule4')}</li>
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookingConfirmationModal;
```

(These modal keys already exist in the locale files — the old code used them.)

- [ ] **Step 3: Wire both into `AppointmentsForm.tsx`**

- Import `validateBookingForm` and `BookingConfirmationModal` (and its `BookingConfirmation` type — replace the local interface at lines 15-21 with the imported one).
- Replace the imperative checks (lines 90-108) with:

```tsx
    const validation = validateBookingForm(
      { hasDoctor: !!selectedDoctor, selectedDate, selectedTime, fullName, phoneNumber, age },
      t,
    );
    if (validation) {
      if (validation.apiError) setApiError(validation.apiError);
      if (validation.fieldErrors) setFieldErrors(validation.fieldErrors);
      return;
    }
```

- Replace the inline `<Modal>…</Modal>` (lines 311-361) with:

```tsx
      <BookingConfirmationModal open={showModal} confirmation={bookingConfirmation} onClose={handleModalClose} />
```

- Remove the now-unused `Modal`, `CheckCircle` imports if no longer referenced.

- [ ] **Step 4: Typecheck + lint + build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 5: Manual — behavior unchanged**

`npm run dev` → submit with missing fields (each field error shows as before); complete a booking (confirmation modal identical).

- [ ] **Step 6: Commit**

```bash
git add src/pages/appointments/components/appointmentForm/
git commit -m "refactor(booking): extract validateBookingForm + BookingConfirmationModal"
```

---

### Task 18: Extract `useDoctorSchedule` + `ScheduleEditor` from DoctorsPage

**Files:**
- Create: `src/pages/admin/doctors/useDoctorSchedule.ts`
- Create: `src/pages/admin/doctors/ScheduleEditor.tsx`
- Modify: `src/pages/admin/doctors/DoctorsPage.tsx`

**Interfaces:**
- Produces: `useDoctorSchedule(doctor?: Doctor | null)` → `{ next7Days, enabledDates, dateTimeRanges, toggleDate, updateTimeRange, resetFrom, buildWeeklySchedule }`.

- [ ] **Step 1: Create `useDoctorSchedule.ts`**

Move the schedule state + build/parse logic out of DoctorsPage (currently `enabledDates`/`dateTimeRanges` state at lines 96-98, the `next7Days` memo at 100, the load-from-doctor effect around 152, and the build loop at 210-216):

```ts
import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import type { Doctor } from '@/pages/appointments/types/appointment.types';
import { clinicToday } from '@/utils/clinicTime';

export interface ScheduleDay {
  dateStr: string;
  dayIndex: number;
  isSunday: boolean;
}

function getNext7Days(): ScheduleDay[] {
  const start = clinicToday();
  return Array.from({ length: 7 }, (_, i) => {
    const d = start.add(i, 'day');
    return { dateStr: d.format('YYYY-MM-DD'), dayIndex: d.day(), isSunday: d.day() === 0 };
  });
}

type Ranges = Record<string, [dayjs.Dayjs, dayjs.Dayjs] | null>;

export function useDoctorSchedule() {
  const next7Days = useMemo(() => getNext7Days(), []);
  const [enabledDates, setEnabledDates] = useState<Set<string>>(new Set());
  const [dateTimeRanges, setDateTimeRanges] = useState<Ranges>({});

  /** Populate state from an existing doctor's weeklySchedule (or clear for "create"). */
  const resetFrom = useCallback((doctor?: Doctor | null) => {
    const enabled = new Set<string>();
    const ranges: Ranges = {};
    for (const day of next7Days) {
      const value = doctor?.weeklySchedule?.[day.dateStr];
      if (value) {
        const [from, to] = value.split('-');
        enabled.add(day.dateStr);
        ranges[day.dateStr] = [dayjs(from, 'HH:mm'), dayjs(to, 'HH:mm')];
      }
    }
    setEnabledDates(enabled);
    setDateTimeRanges(ranges);
  }, [next7Days]);

  const toggleDate = useCallback((dateStr: string) => {
    setEnabledDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
  }, []);

  const updateTimeRange = useCallback((dateStr: string, range: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    setDateTimeRanges((prev) => ({ ...prev, [dateStr]: range }));
  }, []);

  /** Build the date-keyed { "YYYY-MM-DD": "HH:mm-HH:mm" } payload. */
  const buildWeeklySchedule = useCallback((): Record<string, string> => {
    const schedule: Record<string, string> = {};
    for (const dateStr of enabledDates) {
      const range = dateTimeRanges[dateStr];
      if (range) {
        schedule[dateStr] = `${range[0].format('HH:mm')}-${range[1].format('HH:mm')}`;
      }
    }
    return schedule;
  }, [enabledDates, dateTimeRanges]);

  return { next7Days, enabledDates, dateTimeRanges, toggleDate, updateTimeRange, resetFrom, buildWeeklySchedule };
}
```

> Note: verify the exact parse/build format against the current DoctorsPage code (lines ~152 and ~210-216) while extracting — keep the existing `HH:mm` format and load-effect timing identical.

- [ ] **Step 2: Create `ScheduleEditor.tsx`**

Move the schedule JSX (the `next7Days.map(...)` checkbox + `TimePicker` block, DoctorsPage ~549-575) into a presentational component driven by the hook's values + callbacks:

```tsx
import { Checkbox, TimePicker, Space } from 'antd';
import dayjs from 'dayjs';
import type { ScheduleDay } from './useDoctorSchedule';

interface Props {
  days: ScheduleDay[];
  enabledDates: Set<string>;
  dateTimeRanges: Record<string, [dayjs.Dayjs, dayjs.Dayjs] | null>;
  onToggle: (dateStr: string) => void;
  onRangeChange: (dateStr: string, range: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
}

const ScheduleEditor = ({ days, enabledDates, dateTimeRanges, onToggle, onRangeChange }: Props) => (
  <div className="schedule-editor">
    {days.map((day) => {
      const isEnabled = enabledDates.has(day.dateStr);
      const range = dateTimeRanges[day.dateStr] ?? null;
      return (
        <div key={day.dateStr} className="schedule-editor__row">
          <Checkbox checked={isEnabled} onChange={() => onToggle(day.dateStr)}>
            {day.dateStr}
          </Checkbox>
          {isEnabled && (
            <Space>
              <TimePicker.RangePicker
                format="HH:mm"
                minuteStep={30}
                value={range}
                onChange={(v) => onRangeChange(day.dateStr, v as [dayjs.Dayjs, dayjs.Dayjs] | null)}
              />
            </Space>
          )}
        </div>
      );
    })}
  </div>
);

export default ScheduleEditor;
```

> Preserve the exact AntD props the original used (check `TimePicker`/`minuteStep={30}` usage at DoctorsPage ~571). Match the original markup/classNames so existing SCSS still applies.

- [ ] **Step 3: Rewire `DoctorsPage.tsx`**

- Delete the local `getNext7Days`, `enabledDates`/`dateTimeRanges` state, the `next7Days` memo, the load-from-doctor effect, and the inline schedule JSX.
- Add `const schedule = useDoctorSchedule();` and use `schedule.next7Days`, `schedule.enabledDates`, etc.
- In the effect that opens the modal for a doctor, call `schedule.resetFrom(editingDoctor)`.
- In submit, replace the inline build loop with `const weeklySchedule = schedule.buildWeeklySchedule();`.
- Render `<ScheduleEditor days={schedule.next7Days} enabledDates={schedule.enabledDates} dateTimeRanges={schedule.dateTimeRanges} onToggle={schedule.toggleDate} onRangeChange={schedule.updateTimeRange} />` where the inline block was.

- [ ] **Step 4: Typecheck + lint + build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 5: Manual — CRUD parity**

Admin → doctors: create with a schedule → saves; edit an existing doctor → checkboxes/time ranges pre-fill from `weeklySchedule`; toggle a day + change hours → saves the new date-keyed payload. Behavior identical to before, page is shorter.

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/doctors/
git commit -m "refactor(admin): extract useDoctorSchedule hook + ScheduleEditor"
```

---

### Task 19: Consolidate the two language selectors

**Files:**
- Create: `src/components/languageSelector/LanguageSwitcher.tsx`
- Modify: `src/components/navbar/Navbar.tsx`, `src/pages/admin/login/AdminLogin.tsx`
- Delete: `src/components/langSelector/`, `src/components/languageSelector/LanguageSelector.tsx`

**Interfaces:**
- Produces: `<LanguageSwitcher variant="plain" | "dropdown" type? showLabel? />` covering both current looks.

- [ ] **Step 1: Create the unified `LanguageSwitcher.tsx`**

```tsx
import React from 'react';
import { Dropdown, Button, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.scss';

const LANGS = [
  { key: 'uz', label: "O'zbekcha", short: 'UZ', flag: '🇺🇿' },
  { key: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
  { key: 'en', label: 'English', short: 'ENG', flag: '🇬🇧' },
];

interface Props {
  variant?: 'plain' | 'dropdown';
  type?: 'default' | 'text';
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<Props> = ({ variant = 'plain', type = 'text', showLabel = false }) => {
  const { i18n } = useTranslation();
  const current = LANGS.find((l) => l.key === i18n.language) || LANGS[0];
  const change = (key: string) => i18n.changeLanguage(key);

  if (variant === 'plain') {
    return (
      <select
        id="language-selector"
        value={current.key}
        onChange={(e) => change(e.target.value)}
        className={`outline-none language-selector ${current.key}`}
        aria-label="Select language"
      >
        {LANGS.map((l) => (
          <option key={l.key} value={l.key}>{l.short}</option>
        ))}
      </select>
    );
  }

  const items: MenuProps['items'] = LANGS.map((l) => ({
    key: l.key,
    label: (
      <Space>
        <span style={{ fontSize: 18 }}>{l.flag}</span>
        <span>{l.label}</span>
      </Space>
    ),
    onClick: () => change(l.key),
  }));

  return (
    <Dropdown menu={{ items, selectedKeys: [current.key] }} trigger={['click']} placement="bottomRight">
      <Button type={type} className="language-selector">
        <Space size="small">
          <GlobalOutlined style={{ fontSize: 18 }} />
          {showLabel && <span>{current.label}</span>}
          <span style={{ fontSize: 16 }}>{current.flag}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
```

- [ ] **Step 2: Update both call sites**

- `Navbar.tsx`: change `import LangSelector from "../langSelector/LangSelector"` → `import LanguageSwitcher from "@/components/languageSelector/LanguageSwitcher"`, and both `<LangSelector />` (lines 152, 249) → `<LanguageSwitcher variant="plain" />`.
- `AdminLogin.tsx:12,54`: change import to `LanguageSwitcher` and `<LanguageSelector type="text" showLabel />` → `<LanguageSwitcher variant="dropdown" type="text" showLabel />`.

- [ ] **Step 3: Delete the old components**

Run:
```bash
rm -rf src/components/langSelector
rm src/components/languageSelector/LanguageSelector.tsx
```
(Keep `src/components/languageSelector/LanguageSelector.scss` — the new component imports it. If a `langSelector/LangSelector.scss` had unique rules the plain `<select>` needs, fold them into `LanguageSelector.scss` first.)

- [ ] **Step 4: Typecheck + lint + build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean; `grep -rn "langSelector\|LanguageSelector'" src` shows only the new `LanguageSwitcher` references.

- [ ] **Step 5: Manual — both surfaces**

`npm run dev`. Public navbar: plain `<select>` switches language and it **persists** across reload (Task 11). Admin login (`/admins-otolor/login`): AntD dropdown switches language. Both styled as before.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(i18n): unify the two language selectors into LanguageSwitcher"
```

---

## Self-Review

**Spec coverage:**
- §2 spine → Tasks 1-2. §2c exempt-list → Task 2. ✅
- A1 auth → Tasks 3-5. A2 booking → Task 6. A3 schedule/tz → Tasks 7-8. A4 config → Task 9. ✅
- B1 deps → 10. B2 i18n persist → 11. B3 staleTime → 12. B4 hero → 15. B5 framer-motion → 13. B6 dead code → 14. B7 → Tasks 7 (day/month) + 16 (English defaults). ✅
- C1 → 17. C2 → 18. C3 → 19. ✅
- Telegram (§6): intentionally out of scope — no task. ✅

**Placeholder scan:** No TBD/TODO. Two "verify against current code while extracting" notes in Tasks 18 (schedule parse/build format, TimePicker props) are deliberate — the extraction must mirror existing behavior exactly and the surrounding DoctorsPage lines should be confirmed at edit time; the target code and interfaces are fully specified.

**Type consistency:** `ApiError`/`FieldError` from Task 1 are consumed unchanged in Tasks 4, 6, 8, 17. `access_token` key identical in Tasks 2 and 4. `clinicToday`/`clinicNext7` from Task 7 consumed in Tasks 7, 8, 18. `login` return `{ success, message? }` produced in Task 4, consumed in Task 5. `useDoctorSchedule` shape produced in Task 18 Step 1, consumed in Step 3. ✅
