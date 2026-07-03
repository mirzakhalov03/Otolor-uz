# Frontend Refactor + Backend Integration — Design Spec

**Date:** 2026-07-03
**Project:** `Otolor-uz-front-simple/`
**Inputs:** `docs/frontend-optimization-analysis.md` (Jul 2 audit) + `latest-backend-ships.md` (Jul 3 backend round 1)
**Scope decision:** All three tiers, phased (A restore + integrate, B safe cleanups, C refactors).
**Telegram (analysis #1):** Out of scope this cycle — direct client-side call stays. Accepted risk (see §6).

---

## 1. Problem framing

Two forces converge on this codebase:

1. **The backend became real overnight.** It now requires a JWT Bearer token on every admin/mutation/upload route. The frontend still fakes auth (hardcoded credentials, a static token, no `Authorization` header). **Consequence: the entire admin panel currently 401s** — every write, and the admin appointments list. Public patient flows (booking, availability, reads) still work. This is the headline and the reason tier A comes first.

2. **The frontend accumulated debt** (dead deps, an i18n persistence bug, no `staleTime`, duplicated error parsing, two oversized components). The Jul 2 analysis catalogued 15 items.

These aren't independent lists. The backend's new **multi-shape error contract** (400-with-`errors`, 400-message-only, 409, 401, 429) and **real auth** turn several "nice-to-have" analysis items (axios interceptors #3) into **load-bearing** work. So the plan's spine is the shared axios layer; everything else hangs off it.

### Goals
- Admin panel works again against real JWT auth.
- Booking form correctly handles the new backend behaviors (on-grid slots, past-date rejection, 409 double-book, 429).
- One shared, typed error-handling path — no duplicated parsing.
- Ship the safe cleanups/perf/i18n fixes.
- Extract the two oversized components without behavior change.

### Non-goals
- Telegram proxy (deferred; token stays public — accepted risk, tracked).
- Real per-role RBAC (`hasMenuAccess` stays `true`; "valid token" = "is admin").
- Any backend work. This spec is frontend-only. It consumes the Jul 3 contract as-is.

---

## 2. Architecture: the shared axios spine

The single `axios` instance (`src/api/services/api.ts`) gains **three distinct, independently-reasonable interceptors**. Keeping them separate (not one mega-handler) is deliberate: token attachment, error normalization, and session-expiry redirect are three concerns that merely share a file.

### 2a. Request interceptor — attach token
```
if localStorage['access_token'] exists → set Authorization: Bearer <token>
```
Applies to all requests. Harmless on public routes; required on protected ones. This single line makes every admin write, the admin appointments list, and uploads work automatically.

### 2b. Response interceptor — normalize to typed `ApiError`
Every rejected response is converted into ONE shape so no component re-parses axios internals:
```ts
class ApiError extends Error {
  status: number;                 // HTTP status (0 if network/timeout)
  message: string;                // human-facing; from backend `message` or a fallback
  fieldErrors?: { field: string; message: string }[]; // from backend `errors[]`
  code: 'validation' | 'business' | 'conflict' | 'auth' | 'rate_limit' | 'network' | 'unknown';
}
```
Mapping from the Jul 3 contract:
| Backend | → `ApiError` |
|---|---|
| 400 `{ message, errors:[…] }` (express-validator) | `code:'validation'`, `fieldErrors` populated |
| 400 `{ message }` (business rule: off-grid/past-date/schedule-conflict) | `code:'business'`, no `fieldErrors` |
| 409 `{ message }` | `code:'conflict'` |
| 401 `{ message }` | `code:'auth'` |
| 429 `{ message }` | `code:'rate_limit'` |
| no response (network/timeout) | `code:'network'`, generic message |

Components then read `err.message` and `err.fieldErrors` uniformly. This **replaces** the duplicated parsing in `AppointmentsForm.tsx:143-157` and the `getErrorMessage()` in `DoctorsPage.tsx`.

### 2c. Response interceptor — 401 session-expiry redirect (conditional)
On `code:'auth'` (401): clear `access_token`, set unauthenticated, redirect to `/admins-otolor/login`.
**Critical exclusions** — the redirect must NOT fire for:
- `POST /api/auth/login` — a 401 there means "wrong password," surfaced inline on the login form, not a session expiry.
- Public patient paths (`POST /api/appointments`, availability, public reads) — a stray 401 there shouldn't yank a patient to admin login.

Implemented as an allowlist check on `error.config.url` before the redirect side-effect. Normalization (2b) still runs for these; only the redirect is skipped.

> **Design note:** the interceptor needs to trigger navigation + auth-state reset from outside React. Use a small module-level auth event (e.g. an `onUnauthorized` callback registered by `AuthProvider` on mount, or dispatch a `window` event the provider listens for). Avoid importing the router/context into the axios module (circular deps). This wiring is decided at plan time; the interface is: "interceptor calls `handleUnauthorized()`; AuthProvider owns what that does."

---

## 3. Tier A — Restore + integrate (critical path)

### A1. Real authentication (`AuthContext.tsx` + `AdminLogin.tsx`)
- **`AuthContext`**: drop `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ACCESS_TOKEN` constants.
  - `login(username, password)` → `POST /api/auth/login` via a new `authService`. On 200, store `data.token` in `localStorage['access_token']` (keep the existing key so guards are untouched), set authenticated. Return `{ success:true }`. On 401, return `{ success:false, message }` (server's message). **Now async** — returns a `Promise`.
  - `logout()` → clear token, set unauthenticated (unchanged behavior).
  - `checkAuth()` (init) → simple token-exists check instead of comparing to the old static constant. (No `/api/auth/me` round-trip on load — a stale token that slips through gets caught by the 401 interceptor (§2c) on the first protected call, which redirects to login. Cheaper, one fewer boot request.)
  - Register `handleUnauthorized` with the axios layer (§2c) on mount.
- **`AdminLogin.tsx`**: `onFinish` is already `async` — change `const result = login(...)` to `await login(...)`, drop the fake 500ms delay. Show `result.message` (server 401 text) or the existing i18n key when no server message. Everything else (Ant `Alert`, form) stays.
- **`authService.ts`** (new): `login()` calling `POST /api/auth/login` and unwrapping `data`.

### A2. Booking form correctness (`AppointmentsForm.tsx`)
The form already only offers slots from the availability endpoint (good — satisfies "on-grid only"). Remaining work is **error UX against the new contract**, now simplified by §2b:
- Replace the inline `axios.isAxiosError` block (`:143-157`) with reads off the normalized `ApiError`:
  - `code:'validation'` → `setFieldErrors(err.fieldErrors)`.
  - `code:'conflict'` (409, slot just taken) → friendly "slot was just booked, pick another" message **and invalidate/refetch `availableTimeSlots`** so the taken slot disappears.
  - `code:'business'` (off-grid/past-date) → show `err.message`.
  - `code:'rate_limit'` (429) → "too many requests, try again shortly."
  - `code:'network'` → generic retry message.
- **Past dates:** `WeeklyCalendar` should not offer past dates relative to **Tashkent "today"**. Availability already excludes them, but the picker copy/logic should align (7-day window, not 30).

### A3. Doctor schedule form (`DoctorsPage.tsx`) — mostly verification
The builder **already** uses `getNext7Days()` and emits date-keyed `"HH:mm-HH:mm"` — the analysis overstated this. Actual work:
- **Verify `getNext7Days()` anchors to Asia/Tashkent** (not the browser's local midnight). If it uses `new Date()` local time, a user in another tz could generate off-window keys → backend 400. Fix to derive "today" in clinic tz.
- **Surface the schedule-conflict 400 message** verbatim to the admin (editing hours that strand a pending appointment returns 400 with a conflict list). Route it through the normalized `ApiError.message`.
- Confirm the availability window copy says 7 days, not 30 (also in `appointmentService.ts` docstring: "next 30 days" → 7).

### A4. Config alignment
- `.env.example` and `vite.config.ts` dev proxy point at `:3000`; backend is `:5050`. Fix both (or remove the proxy if unused) so proxy-based dev doesn't silently miss.

---

## 4. Tier B — Safe cleanups, perf, i18n (no behavior risk)

- **B1. Dead deps:** `npm remove lenis react-icons` (confirmed imported nowhere).
- **B2. i18n persistence bug (`i18next.ts:15`):** remove the `lng: 'uz'` line. Keep `fallbackLng:'uz'` + `supportedLngs` + the detection block. Returning users keep their language; first-timers still get Uzbek via fallback.
- **B3. React Query `staleTime`:** add `staleTime: 5 * 60 * 1000` default on the `QueryClient` (`main.tsx`). Override per-query where freshness matters — **availability slots keep a low/zero staleTime** (they change as people book).
- **B4. Hero image:** convert `otolor-hero-bg.png` (792 KB) to WebP; serve responsive variants (mobile jpg already exists). Improves LCP.
- **B5. `framer-motion` → CSS:** `Layout.tsx` uses it only for a 0.2s opacity fade (`AnimatePresence`/`motion`/`useReducedMotion`). Replace with a CSS transition honoring `prefers-reduced-motion`, then `npm remove framer-motion`. Removes a heavy dep from the critical path.
- **B6. Delete dead code:** `src/mocks/` folder (parallel unused data layer — a footgun); unused `utils/` helpers (`throttle`, `deepClone`, `formatCurrency`, `capitalize`, `debounce` + the `debounce.ts` re-export) keeping only `getInitials`; commented sections in `Home.tsx:1-18` and `Courses.tsx:69-98`; empty `servicesPage/data/` dir.
- **B7. i18n — targeted, not a blanket sweep.** Two sub-parts, scoped to real breakage:
  - **Fix the genuine bug:** `WeeklyCalendar.tsx:43-49` hardcodes Uzbek day/month arrays, so the calendar shows Uzbek even in RU/EN. Replace with translation keys (or `dayjs` with the active locale). This is the one that actually breaks localization — must fix.
  - **Inline English defaults — narrow, not global.** Mechanically stripping every `t('key','English default')` across the app is a wide, low-value diff. Instead: only for the **appointment booking flow** we're already rewriting in A2, drop the English inline defaults and confirm the corresponding keys exist in all three `translation.json` files (so `fallbackLng:'uz'` actually resolves). Leave defaults elsewhere untouched this cycle — they're not breaking anything today. Going forward, new code uses keys without English defaults.

---

## 5. Tier C — Refactors (behavior-preserving, do last)

- **C1. `AppointmentsForm.tsx` (365 lines):** extract `validateBookingForm()` (the imperative checks at `:90-108`) and `<BookingConfirmationModal>` (`:311-361`). Error mapping already moved to the interceptor (§2b) in tier A, so this is the remaining slimming. Pure extraction — same behavior.
- **C2. `DoctorsPage.tsx` (595 lines):** extract a `useDoctorSchedule(doctor?)` hook owning the `enabledDates` (`Set`) + `dateTimeRanges` (`Record`) dual-state and the build/parse of `weeklySchedule` strings, exposing `{ next7Days, enabledDates, toggleDate, updateTimeRange, buildWeeklySchedule }`; plus a presentational `<ScheduleEditor>`. Shrinks the page, makes the schedule logic unit-reasonable.
- **C3. Consolidate the two language selectors.** `langSelector/` (plain `<select>`, public navbar) and `languageSelector/` (AntD `Dropdown`, admin login) duplicate one concern with two UIs. Merge into a single configurable `<LanguageSelector variant="plain" | "dropdown" …>` (props to cover both current looks: the plain public one and the AntD admin one with `type`/`showLabel`). **Then delete the redundant folder and update both call sites** (public `Navbar` + `AdminLogin.tsx:12,54`). Verify language switching still works in *both* places — public site and admin login — and that persistence (B2) holds across them. This removes the "which one is rendered?" gotcha for good.

---

## 6. Accepted risks / deferrals

- **Telegram token public (analysis #1, Critical):** `Courses.tsx` still calls `api.telegram.org` directly with a `VITE_`-inlined token. Deferred pending a backend `POST /api/contact` proxy that does not yet exist. **Tracked as the top item for the next cycle.** If the token is live in production, it should be rotated regardless.
- **RBAC not enforced:** single `role:'admin'`; `hasMenuAccess` returns `true`. Out of scope.

---

## 7. Phasing & sequencing rationale

1. **§2 axios spine first** — everything in tier A depends on it. Build interceptors + `ApiError` before touching AuthContext/booking so both consume the normalized shape.
2. **Tier A** — restores the app. A1 (auth) unblocks the admin panel; A2 (booking) hardens the public flow; A3 (schedule) is mostly verification; A4 (config) prevents dev confusion.
3. **Tier B** — independent, low-risk, parallelizable. Can land anytime after the spine but grouped here to keep tier A's diff focused.
4. **Tier C** — last, because refactoring `AppointmentsForm`/`DoctorsPage` is easiest once their error-handling (A2/A3) already routes through the interceptor.

## 8. Verification strategy

No test runner is configured on the frontend, so verification is manual + `npm run lint` (ESLint) + `npm run build` (tsc):
- **Auth:** login with correct creds → token stored, admin loads; wrong creds → inline 401 message, no redirect loop; expired/absent token hitting a protected route → single redirect to login.
- **Booking:** book a slot → success modal with order number; book a taken slot (two tabs) → 409 friendly message + slot vanishes on refetch; confirm past dates aren't offered.
- **Schedule:** create/edit a doctor's next-7-days schedule → saves; edit hours to strand a pending appointment → backend 400 message shown verbatim.
- **i18n:** switch to RU, reload → stays RU (persistence bug fixed).
- **Build:** `npm run lint` + `npm run build` clean after each tier. Confirm removed deps aren't referenced.
