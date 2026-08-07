# Shelf — Dev Guide

A book-tracking/social-recommendation app. React (Vite) frontend + Spring Boot backend, Google Sign-In auth.

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, react-router-dom 7, GSAP, motion |
| Backend  | Spring Boot 4.1 (Java 17), Spring Security, JJWT, Google API client |
| Auth     | Google Identity Services (ID token) → backend verifies → issues its own session JWT in an HttpOnly cookie |
| Data     | **No database yet.** Users live in an in-memory `ConcurrentHashMap` (`UserStore.java`) — wiped on every backend restart. Books/friends/inbox are hardcoded mock data in the frontend (`src/data/mock*.ts`) |

## Prerequisites

- **Node.js** (v22 confirmed installed) + npm
- **JDK 17+** — a stray Java 8 sits on your system `PATH`, but `JAVA_HOME` correctly points at JDK 25 (Eclipse Adoptium), and `mvnw` uses `JAVA_HOME`, not `PATH`. Always run the backend via `./mvnw`, not a bare `java`/`mvn` command, or you'll hit a version mismatch.

## First-time setup

**Frontend env** — `frontend/.env` already exists with a working `VITE_GOOGLE_CLIENT_ID`. If it's ever missing, copy `.env.example` and fill it from Google Cloud Console → APIs & Services → Credentials.

**Backend env** — `application-local.properties` (gitignored, not committed) already has `google.client-id` and `app.jwt-secret` filled in for local dev. For a from-scratch setup you'd instead set env vars:
```
GOOGLE_CLIENT_ID=<same client id as frontend>
JWT_SECRET=<32+ random bytes, base64>   # openssl rand -base64 32
```

## Running it

Two terminals, both services must be up — the frontend proxies `/api/*` to the backend.

**Backend** (port 8081):
```
cd backend
./mvnw spring-boot:run
```
This boots fine and `/api/health` responds, but Google sign-in won't work — `google.client-id`/`app.jwt-secret` are blank unless you activate the `local` profile (which has them filled in) or set `GOOGLE_CLIENT_ID`/`JWT_SECRET` env vars:
```
./mvnw "spring-boot:run" "-Dspring-boot.run.profiles=local"
```
> **PowerShell gotcha:** quote each argument as shown above. `mvnw.cmd` is a batch script under the hood, and cmd.exe splits unquoted arguments on `=` (not just spaces) — `-Dspring-boot.run.profiles=local` unquoted gets torn into `-Dspring-boot.run.profiles` and `local`, and Maven then tries to run `local` as a lifecycle phase and fails. Quoting keeps it as one token. (Also: `spring-boot:run` — no space around the colon, or Maven sees an empty goal.)

**Frontend** (port 5173):
```
cd frontend
npm install   # first time only
npm run dev
```

Then open **http://localhost:5173**.

Other frontend scripts: `npm run build` (typecheck + build), `npm run lint` (oxlint), `npm run preview`.

## How auth works

1. Frontend renders Google's Sign-In button (`GoogleSignInButton.tsx`), gets an ID token.
2. `POST /api/auth/google` with `{ credential }` → backend verifies the token against Google's public keys (`GoogleTokenVerifier`), upserts the user in-memory, issues a session JWT as an HttpOnly cookie.
3. `GET /api/auth/me` returns the current user from the cookie; `POST /api/auth/logout` clears it.
4. All state-changing requests need the `X-XSRF-TOKEN` header (read from the non-HttpOnly `XSRF-TOKEN` cookie) — handled automatically by `frontend/src/lib/api.ts`.
5. Restarting the backend logs everyone out (no persistence).

## Routes (frontend)

| Path | Page | Auth required |
|------|------|----------------|
| `/` | Landing | no |
| `/auth` | Sign in | no |
| `/shelf` | Your book shelf | yes |
| `/books/:id` | Book detail | yes |
| `/reading`, `/reading/:id` | Currently reading | yes |
| `/inbox` | Recommendation inbox | yes |
| `/friends`, `/friends/:friendId` | Friends | yes |
| `/add-book` | Add a book | yes |

## Backend endpoints

| Endpoint | Auth |
|----------|------|
| `GET /api/health` | no |
| `POST /api/auth/google` | no |
| `GET /api/auth/me` | yes |
| `POST /api/auth/logout` | no |

## Current state / known gaps

- **No database** — no book/friend/inbox persistence or API endpoints yet; frontend `LibraryContext` runs entirely on mock data (`src/data/mockBooks.ts`, `mockFriends.ts`, `mockInbox.ts`). Only auth is real, end-to-end.
- **Uncommitted local changes** (as of this doc): `gsap` added to `frontend/package.json` and a page-transition fade wired into `Layout.tsx`.
- `Shelf Book Recommendation Design/` at repo root holds design/prototype assets (`Shelf.dc.html`, images) — not part of the running app.
