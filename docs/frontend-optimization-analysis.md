# Frontend Optimization Analysis — Otolor-uz-front-simple

**Date:** 2026-07-02
**Scope:** `Otolor-uz-front-simple/` (React 19, Vite 7, TypeScript, AntD 6, React Query, i18next)
**Author:** Analysis pass (no code changed yet)

This is a findings + remediation document. Nothing in the codebase was modified. Items
are ordered by severity, each with a file reference, the *why*, and a recommended fix.
A prioritized roadmap is at the bottom.

---

## 🔴 Critical

### 1. Telegram bot token is exposed in the public client bundle
**File:** `src/pages/academy/courses/Courses.tsx:111-153`

The academy contact form reads the bot token from env and calls the Telegram API directly
from the browser:

```ts
const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || import.meta.env.VITE_BOT_TOKEN
await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, ...)
```

**Why it's critical:** Every `VITE_`-prefixed variable is inlined into the production JS
bundle and is world-readable. The bot token is therefore public. Anyone can extract it and
fully control the bot — read every chat it's in, send messages as it, spam the destination
channel, or get it revoked by Telegram for abuse.

**Fix:** Move the send server-side. Add a backend endpoint (e.g. `POST /api/contact`) that
holds the token as a *server* secret and forwards the message to Telegram. The frontend
posts `{ fullName, phoneNumber, message }` to that endpoint. **Requires coordination with
the backend session.** Rotate the current token after the fix, since it may already be
compromised.

---

## 🟠 High

### 2. Language selection does not persist across reloads
**File:** `src/languages/i18next.ts:16`

```ts
lng: 'uz', // Force Uzbek as initial language
```

**Why:** When `lng` is set explicitly, i18next uses it and **overrides** `LanguageDetector`
and the `localStorage`/`cookie` caches configured immediately below. A returning user who
selected Russian is reset to Uzbek on every refresh, and the entire `detection` block is
effectively dead configuration.

**Fix:** Remove the `lng` line. Keep `fallbackLng: 'uz'` and `supportedLngs`. Detection then
resolves: cached choice → cookie → browser → fallback (Uzbek). First-time visitors still
default to Uzbek via fallback; returning users keep their choice.

### 3. Axios instance has no interceptors
**File:** `src/api/services/api.ts`

The instance sets only `baseURL`, headers, and timeout. Consequences:
- **No request interceptor:** when real auth is introduced, every service call must manually
  attach the token. A single interceptor reading `localStorage` would centralize it.
- **No response interceptor:** error-shape unwrapping is duplicated across the app —
  `getErrorMessage()` in `DoctorsPage.tsx:55-61` and the `axios.isAxiosError` branch in
  `AppointmentsForm.tsx:143-157` both re-implement "pull `.response.data.message` / `.errors`".

**Fix:** Add a response interceptor that normalizes the backend contract
(`{ success, message, data, errors? }`) into a consistent `ApiError` and rejects with it.
Components then read `error.message` / `error.fieldErrors` uniformly. Add a request
interceptor stub for the future auth token.

---

## 🟡 Medium — performance & bundle

### 4. Dead npm dependencies
- `lenis` — in `package.json`, **imported nowhere**.
- `react-icons` — in `package.json`, **imported nowhere** (the app uses `lucide-react`).

**Fix:** `npm remove lenis react-icons`.

### 5. `framer-motion` used only for a single opacity fade
**File:** `src/components/layout/Layout.tsx`

The only usage is a 0.2s `opacity: 0 → 1` page transition. `framer-motion` is a large
dependency to carry on the critical path for that. **Fix:** replace with a CSS transition (or
the native View Transitions API). Removes a heavy dep from the main bundle.

### 6. Unoptimized hero background image
**File:** `src/assets/images/otolor-hero-bg.png` — **792 KB**

A PNG this size on the landing page hurts LCP. **Fix:** convert to WebP/AVIF and size
appropriately; serve responsive variants for mobile (there is already an
`otolor-hero(mob).jpg`). Doctor images (`assets/images/doctors/`, ~552 KB total) are fine but
could also be WebP.

### 7. React Query has no `staleTime`
**File:** `src/main.tsx:10-17`

Default `staleTime: 0` means near-static data (doctors, services, categories) is considered
stale immediately and refetches on every mount/remount. **Fix:** set a sensible default
(e.g. `staleTime: 5 * 60 * 1000`) on the `QueryClient`, overriding per-query where freshness
matters (e.g. availability slots).

---

## 🟢 Low — dead code & cleanup

### 8. Entire `mocks/` folder is unused
**Files:** `src/mocks/uiApi.ts` (~324 lines), `src/mocks/uiData.ts`, `src/mocks/uiTypes.ts`

Not imported anywhere outside `mocks/`. It's a parallel "UI-only" data layer that mirrors the
real React Query hooks (`useDoctors`, `useCreateDoctor`, …). Beyond bloat, it's a trap: a
future dev could wire a component to the mock hooks by mistake. **Fix:** delete the folder.

### 9. Most of `utils/` is dead
**File:** `src/utils/index.ts`, `src/utils/debounce.ts`

Usage counts across the app: `throttle` 0, `deepClone` 0, `formatCurrency` 0, `capitalize` 0,
`debounce` 0. Only `getInitials` is used (2×). `debounce.ts` merely re-exports from `index`.
**Fix:** keep `getInitials`, remove the unused helpers and the `debounce.ts` re-export file.

### 10. Two redundant language selectors
- `src/components/langSelector/LangSelector.tsx` — plain `<select>`, used in the public Navbar.
- `src/components/languageSelector/LanguageSelector.tsx` — AntD `Dropdown`, used only in
  `AdminLogin.tsx`.

Both are live, so neither is dead, but they duplicate the same concern with different UIs.
**Fix (optional):** consolidate into one configurable component, or at minimum document why
two exist. Low priority since both are actually rendered.

### 11. Commented-out / orphaned code
- `src/pages/home/Home.tsx:1-18` — three disabled sections (`AboutUs`, `Features`, `Services`)
  imported-then-commented. Decide: ship or delete.
- `src/pages/academy/courses/Courses.tsx:69-98` — commented `otherCourses` block.
- `src/pages/servicesPage/data/` — empty directory.

### 12. Hardcoded Uzbek strings bypass i18n
**File:** `src/pages/appointments/components/appointmentForm/WeeklyCalendar.tsx:43-49`

Day names (`'Yak', 'Dush', …`) and month names are hardcoded Uzbek arrays, while the rest of
the app is fully i18n'd. This breaks RU/EN localization for the calendar. **Fix:** use
translation keys, or derive from `dayjs` with the active locale.

### 13. Inline English fallbacks contradict the "Uzbek is default" rule
**File:** `src/pages/appointments/...` (many `t('key', 'English default')` calls)

Project convention is Uzbek as the fallback language, but many calls pass an English string as
the inline default. If a key is missing, users see English, not Uzbek. **Fix:** rely on
translation files + `fallbackLng: 'uz'`; drop inline English defaults (or make them Uzbek).

---

## 🔵 Refactor candidates (higher risk — do after the above)

### 14. `AppointmentsForm.tsx` (365 lines) does too much
**File:** `src/pages/appointments/components/appointmentForm/AppointmentsForm.tsx`

Mixes: manual field validation, the booking mutation, API error mapping, the time-slot grid,
and a large confirmation modal. **Suggested extraction:**
- `validateBookingForm()` helper (or a small schema) for the imperative checks at lines 90-108.
- `<BookingConfirmationModal>` component for lines 311-361.
- Move error mapping into the axios response interceptor (item #3).

### 15. `DoctorsPage.tsx` (595 lines) — schedule state is the complex core
**File:** `src/pages/admin/doctors/DoctorsPage.tsx`

The `enabledDates` (`Set`) + `dateTimeRanges` (`Record`) dual-state, plus the build/parse of
`weeklySchedule` strings (`"09:00-17:00"`), is the hardest part to reason about.
**Suggested extraction:** a `useDoctorSchedule(doctor?)` hook owning that state and exposing
`{ next7Days, enabledDates, toggleDate, updateTimeRange, buildWeeklySchedule() }`, plus a
`<ScheduleEditor>` presentational component. Shrinks the page and makes the schedule logic
unit-reasonable.

---

## Cross-cutting / needs backend coordination
The other session is optimizing the backend. These frontend symptoms have backend-side fixes:
- **#1 Telegram token** → needs a backend proxy endpoint (`POST /api/contact`).
- **Admin auth is not real** (`context/AuthContext.tsx` hardcodes credentials + a static token;
  `/api/admin/*` has no auth middleware per project notes). Real fix is JWT on the backend +
  a request interceptor here (item #3). Documented, not a frontend-only change.

---

## Suggested remediation order

**Phase 1 — safe, high value (no behavior risk):**
1. Remove dead deps `lenis`, `react-icons` (#4)
2. Delete `mocks/` folder (#8) and unused `utils` helpers (#9)
3. Fix i18n `lng` persistence bug (#2)
4. Add `staleTime` default to QueryClient (#7)
5. Optimize `otolor-hero-bg.png` → WebP (#6)
6. Remove commented/orphaned code + empty dir (#11)

**Phase 2 — coordinated / small features:**
7. Telegram token → backend proxy (#1, needs backend session)
8. Axios response + request interceptor; delete duplicated error handling (#3)
9. WeeklyCalendar i18n for day/month names (#12); audit inline English fallbacks (#13)
10. Replace `framer-motion` fade with CSS (#5)

**Phase 3 — refactors (optional, per appetite):**
11. Extract `AppointmentsForm` validation + confirmation modal (#14)
12. Extract `useDoctorSchedule` hook + `ScheduleEditor` from `DoctorsPage` (#15)
13. Consolidate the two language selectors (#10)
