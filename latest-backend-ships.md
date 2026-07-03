# Latest Backend Ships → Frontend Impact

**Backend commit:** `origin/main @ 1605a63` (repo: `otolor-uz-backend`)
**Date:** 2026-07-03
**Scope:** Backend "optimization round 1" — auth, booking correctness, timezone, security.

This document lists **only** the backend changes that change what the frontend must do. Response envelope is unchanged: every response is still `{ success, message, data, pagination? }` and services should keep unwrapping `data`.

---

## 🔴 HEADLINE: auth is now real — the admin panel is currently broken

The backend previously had **no auth**. It now requires a **JWT Bearer token** on every admin/mutation/upload route. The frontend still fakes auth (hardcoded credentials + a static token in `AuthContext`, and axios sends **no** `Authorization` header). So right now:

- Every admin write (create/edit/delete doctors, services, categories, appointment status, uploads) → **401**.
- The admin appointments list (`GET /api/admin/appointments`) → **401**.

**Public patient flows still work** (booking, availability, public reads) — those are intentionally unauthenticated.

---

## 1. Authentication — what to build

### Endpoints

**`POST /api/auth/login`** — public.
Request body:
```json
{ "username": "otoloruzadmin", "password": "your-password" }
```
Success (200):
```json
{ "success": true, "message": "Logged in successfully",
  "data": { "token": "<JWT>", "expiresIn": "7d" } }
```
Bad credentials (401):
```json
{ "success": false, "message": "Invalid username or password" }
```
> `expiresIn` is the string `"7d"` (not a number). The JWT itself carries the real expiry.

**`GET /api/auth/me`** — requires `Authorization: Bearer <token>`.
Success (200): `{ "success": true, "message": "Authenticated", "data": { "role": "admin" } }`
Use this to validate a stored token on app load. Missing/invalid token → 401.

### Credentials moved server-side
The admin username/password are **no longer in the frontend**. They live in backend env vars (`ADMIN_USERNAME` / `ADMIN_PASSWORD`). For local dev, set those in the backend `.env` to whatever you'll type in the login form (the committed `.env.example` uses `otoloruzadmin` / `change-me` as placeholders).

### Frontend changes required
1. **`src/context/AuthContext.tsx`** — replace the hardcoded credential check. `login(username, password)` should `POST /api/auth/login`, store `data.token` in `localStorage`, and set authenticated state. `logout()` clears it. `checkAuth()` should just check a token exists (optionally verify via `/api/auth/me`) instead of comparing against the old static `ACCESS_TOKEN` constant.
2. **`src/api/services/api.ts`** — add an axios **request interceptor** that attaches `Authorization: Bearer ${localStorage.getItem('access_token')}` when a token is present. This is the cleanest single place — every protected call then works automatically (admin appointments, doctor/service/category writes, uploads).
3. Add an axios **response interceptor**: on `401`, clear the token and redirect to `/admins-otolor/login` (token expired or invalid). Don't do this for the public `POST /api/appointments` path if you want patient errors to surface normally.
4. Login errors: show a message on **401** from `/api/auth/login` (`data`-less, read `message`).

> Keep using the existing `localStorage` key (`access_token`) to avoid touching the guards — just store the real JWT there now instead of the static string.

---

## 2. Protected vs public route map

Attach the Bearer token to **PROTECTED**; leave **PUBLIC** alone (a token doesn't hurt, but these don't need one). A single request interceptor covers all protected calls.

| PUBLIC (no token) | PROTECTED (Bearer required) |
|---|---|
| `POST /api/auth/login` | `GET /api/auth/me` |
| `GET /api/doctors`, `GET /api/doctors/:id` | `POST/PATCH/DELETE /api/doctors` |
| `GET /api/appointments/availability` | `GET/PATCH/DELETE /api/admin/appointments` |
| `POST /api/appointments` (patient booking) | `POST /api/categories` |
| `GET /api/categories` | `POST/PUT/DELETE /api/services` |
| `GET /api/services`, `GET /api/services/:id` | `POST /api/uploads/image` |

---

## 3. Booking behavior changes (affect appointment-form UX + error handling)

These are backend behavior changes on the **public booking** flow. Payload is unchanged:
`POST /api/appointments` with `{ doctorId, fullName, age, phoneNumber, selectedDate, selectedTime }`.

1. **Time must be an on-grid 30-min slot.** Booking a `selectedTime` that isn't one of the slots returned by the availability endpoint now returns **400** (`message` explains it). The time-slot picker should only offer values from `GET /api/appointments/availability?doctorId=…&date=…`. Don't allow free-typed times.
2. **Missed slots never reopen.** Availability now excludes **every** already-booked slot regardless of status. No frontend change — just know a "missed" appointment's slot won't come back as available.
3. **Past dates rejected (400).** Anchored to clinic timezone **Asia/Tashkent**. The date picker should not offer past dates (relative to Tashkent "today").
4. **Double-booking → 409** with `{ "message": "This time slot is already booked." }`. Handle 409 on the booking mutation with a friendly "slot just got taken, pick another" message and refetch availability.

### Error response shapes to handle
- **Validation (400) from express-validator:** `{ success:false, message:"Validation failed", errors:[{ field, message }] }` — has an `errors` array.
- **Business rule (400) e.g. off-grid/past date:** `{ success:false, message:"..." }` — **no** `errors` array, just `message`.
- **409 conflict:** `{ success:false, message:"This time slot is already booked." }`.
- **401 auth:** `{ success:false, message:"Authentication required" | "Invalid or expired token" | "Invalid username or password" }`.

---

## 4. Doctor schedule shape (admin doctor create/edit)

`weeklySchedule` is **date-keyed**, not weekday-keyed, and limited to the **next 7 days** (clinic tz):
```json
{ "2026-07-03": "09:00-17:00", "2026-07-04": "09:00-14:00" }
```
Backend rejects (400) any key that is a weekday name, a past date, or a date ≥ 7 days out, or a value not matching `HH:MM-HH:MM`. If the admin doctor form builds schedules, it must generate **concrete dates within `[today, today+6]` (Tashkent)** as keys. (Swagger at `/api/docs` now documents this correctly.)

Editing a schedule that would strand an existing pending appointment (date removed, or hours shortened) returns **400** with a message listing the conflicts — surface that message to the admin.

---

## 5. Misc / reminders

- **Availability window is 7 days, not 30.** Older docs/comments said "next 30 days" — the real window is 7. Adjust any copy or date-range assumptions.
- **All dates are `YYYY-MM-DD` strings in clinic time (Asia/Tashkent).** Keep comparing/displaying them as strings; don't round-trip through `new Date()` in a way that shifts the day.
- **API base URL:** the backend runs on **:5050**. `.env` already has `VITE_API_BASE_URL=http://localhost:5050/api` (correct). Note `.env.example` and the `vite.config.ts` dev proxy still point at `:3000` — fix those if you rely on the proxy.
- **Rate limiting** is now proxy-aware; under heavy load you may see **429** (`{ success:false, message:"Too many requests..." }`). Same shape as before, just now actually per-client behind a proxy.

---

## 6. Frontend TODO checklist (suggested order)

- [ ] `api.ts`: request interceptor → attach `Authorization: Bearer` from `localStorage`.
- [ ] `api.ts`: response interceptor → on 401, clear token + redirect to admin login.
- [ ] `AuthContext.tsx`: `login()` calls `POST /api/auth/login`, stores real JWT; `checkAuth()`/`logout()` updated; drop the hardcoded `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`ACCESS_TOKEN` constants.
- [ ] Login page: show server `message` on 401.
- [ ] (Optional) validate token on load via `GET /api/auth/me`; treat 401 as logged-out.
- [ ] Booking form: ensure time picker only uses availability slots; handle 400 (off-grid/past) and 409 (slot taken) with clear messages + availability refetch.
- [ ] Admin doctor form: build `weeklySchedule` with concrete date keys within the next 7 days (Tashkent); surface schedule-conflict 400 messages.
- [ ] Set backend `.env` `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`JWT_SECRET` locally so login works (backend won't boot without `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`).

> Note: the frontend's `rbac.config.ts` `hasMenuAccess` still returns `true` for everything and the token has a single `role: 'admin'`. Real per-role UI gating is not a backend concern yet — treat "has valid token" as "is admin" for now.
