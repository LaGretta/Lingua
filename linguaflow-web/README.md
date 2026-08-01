# LinguaFlow — Web (learner frontend)

A calm, premium, iOS-grade language-learning web app for the **existing LinguaFlow .NET
API**. React + TypeScript + Vite. It’s a standalone frontend that only *consumes* the
API over HTTP — the backend was left untouched (except one small dev-only CORS addition,
called out below).

> **Nothing in this repository was committed.** All changes are left in the working tree
> for you to review and commit yourself.

---

## What it does

- **Auth** — register / sign in; the JWT is used as a Bearer token for the session.
- **Home** — greeting, a “continue learning” course card, and a live “words to review” entry.
- **Courses** — the course list from `GET /api/courses`.
- **Course detail** — course info + open a lesson (see “Known API gaps” for why lessons
  can’t be listed).
- **Lesson player** — steps through generated exercises one at a time:
  - **Flashcard** — shows the word; “Reveal answer” shows the translation.
  - **MultipleChoice** — pick a translation → checks it → correct/incorrect feedback sheet,
    accumulating XP. At the end it records completion and shows an XP summary.
- **Review** — spaced-repetition cards; reveal, then grade **Again / Hard / Good / Easy**.
  Calm “all done for today” empty state.
- **Profile** — account info; stats are shown as placeholders (see “Known API gaps”).
- **Admin** *(admin only)* — a small helper to create one ready-to-play sample lesson using
  the existing admin endpoints, so the app is testable end-to-end on a fresh database.

Loading, empty, error and 401 states are all handled — no blank white screens.

---

## Running it

Prerequisites: the LinguaFlow API running on **http://localhost:5215** (its default `http`
launch profile), and Node 18+.

```bash
cd linguaflow-web
npm install
npm run dev
```

Open http://localhost:5173.

1. Start the API with the **http** profile:
   ```bash
   dotnet run --project LinguaFlow.API --launch-profile http
   ```
   (Use the `http` profile so the API listens on plain `http://localhost:5215`. With that
   profile `UseHttpsRedirection` is a no-op — there’s no HTTPS port to redirect to — so the
   browser can call it directly without certificate issues.)
2. `npm run dev`, then register a new account, or sign in.

### Sample content (important on a fresh DB)

The database seeder only creates an **admin** account and **no learning content**, and the
API has no way to list a course’s lessons (see gaps below). So on a fresh database there’s
nothing to actually learn until content exists. Two options:

- **Easiest:** sign in as the seeded admin and open **Profile → Admin · manage content →
  “Create a sample lesson.”** It creates a course, six words and a lesson, then gives you a
  **“Play lesson #N”** button. Seeded admin credentials (from `DbSeeder`):
  - email `admin@linguaflow.local`, password `admin123`
- Or create content yourself via the API’s admin endpoints (`POST /api/courses`,
  `POST /api/words`, `POST /api/lessons`, `POST /api/lessons/{id}/words`).

Once a lesson exists, open it from **Course detail → “Open a lesson” → its id**, or use the
admin page’s “Play lesson #N” link.

---

## Configuration

The API base URL is read from `VITE_API_URL` (see `.env` / `.env.example`):

```
VITE_API_URL=http://localhost:5215
```

It is read only in the API client, never hardcoded in components.

---

## Auth & token handling

The JWT is stored in **`localStorage`** (key `linguaflow.auth`) so the login **persists
across browser restarts**, not just page reloads. It’s cleared on explicit sign-out or on
any `401` from the API. The token is attached as `Authorization: Bearer <token>` on every
protected request; a `401` clears the stored session and returns you to sign-in.

Note: the token is applied to the API client **synchronously during render** (not in an
effect), so the first authenticated request right after login already carries the token —
otherwise a child data-fetch could fire before the token was set, 401, and log you out.

---

## Installable (PWA)

The app is a Progressive Web App: it can be added to a phone’s home screen and launches
fullscreen/standalone like a native app, with the device’s own status bar (there is no
fake in-app status bar).

What’s included:

- **`public/manifest.webmanifest`** — name “LinguaFlow”, `display: standalone`,
  `theme_color #2F6B4E`, `background_color #FBFAF7`, portrait, and icons.
- **`public/icons/`** — `pwa-192.png`, `pwa-512.png` (any), `maskable-512.png` (maskable,
  safe-zone padded for Android’s adaptive shapes), and `apple-touch-icon-180.png` (iOS).
- **`public/sw.js`** — a small dependency-free service worker registered from
  [`src/lib/registerSW.ts`](src/lib/registerSW.ts). It’s network-first (so it never serves
  stale content while online, and `npm run dev`/HMR is unaffected), caches the app shell for
  offline launch, and **never** touches the API or any cross-origin/non-GET request.
- PWA/iOS meta tags + `apple-touch-icon` in `index.html`; content respects the safe-area
  insets (notch / home indicator) via CSS `env(safe-area-inset-*)`.

Service workers require a secure context. `http://localhost` counts as secure, and any
`https://` origin works; plain `http://` on a LAN IP does **not**, so to install from your
phone use one of the options below.

### Install it on your phone

Your phone needs to reach the dev server, which is why the tunnel/HTTPS options exist
(installing over a bare `http://<LAN-IP>` won’t register the service worker).

**Easiest — a temporary HTTPS tunnel (works on iOS and Android):**

1. Start it locally:
   ```bash
   cd linguaflow-web
   npm run build && npm run preview   # or: npm run dev
   ```
2. In another terminal, expose it over HTTPS (any tunneler works), e.g.:
   ```bash
   npx localtunnel --port 5173
   ```
   (or `cloudflared tunnel --url http://localhost:5173`). Open the resulting `https://…`
   URL on your phone. Note: the API at `http://localhost:5215` won’t be reachable through
   the tunnel unless you also expose it and point `VITE_API_URL` at it — the tunnel is
   mainly for confirming the install/standalone experience.

**On the same machine (desktop, to verify the install UX):** open `http://localhost:5173`
in Chrome/Edge → an **install icon** appears in the address bar (or ⋮ menu →
“Install LinguaFlow”).

**iPhone / iPad (Safari):** open the app’s URL → tap **Share** → **Add to Home Screen** →
**Add**. Launch it from the new icon; it opens fullscreen with no browser chrome.

**Android (Chrome):** open the app’s URL → **⋮** menu → **Install app** / **Add to Home
screen** → **Install**. You may also get an automatic install prompt.

---

## Project structure

```
public/          manifest.webmanifest, sw.js, icons/ (PWA assets)
src/
  api/           types (mirroring the real DTOs), fetch client, endpoint functions
  auth/          AuthContext (localStorage token, login/register/logout)
  components/    Screen, TabBar, Icons, Ring, Avatar, States (loading/empty/error)
  lib/           useAsync data-fetching hook, registerSW (service worker registration)
  pages/         Onboarding, Login, Register, Home, Courses, CourseDetail,
                 Lesson, Review, Profile, Admin
  styles/        design tokens + global CSS (transcribed from the design handoff)
```

Design tokens (colors, type scale, radii, shadows) come straight from the handoff
(`Linguaflow style guide` — cream `#FBFAF7`, deep green `#2F6B4E`, Hanken Grotesk). The app
renders as a centered phone-width column, matching the mobile-portrait reference screens.

---

## Known API gaps (frontend adapts; backend NOT changed)

While wiring the UI to the real API, three things differ from the original brief. Per the
project rules the backend was **not** modified to fix these — the frontend degrades
gracefully and flags them. Each is a small backend addition when you’re ready:

1. **`POST /api/lessons/complete` isn’t reachable.** `LessonService.CompleteLesson` exists
   but is **not mapped to any controller action**, so the route returns **405/404**. The
   lesson player still shows a completion screen, but notes that XP couldn’t be saved.
   *Fix:* add a `[HttpPost("complete")]` action on `LessonsController` that reads the user
   id from the token and calls `CompleteLesson` (the service is already there).

2. **A course’s lessons can’t be listed.** `GET /api/courses/{id}` returns a
   `CourseResponseDto` that does **not** include lessons, and there’s no
   `GET /api/courses/{id}/lessons`. *Interim workaround (no backend change):* Course detail
   now shows a real, tappable lesson list by **probing** `GET /api/lessons/{id}` (which does
   return each lesson’s `courseId`) and grouping by course — see
   [`src/lib/discoverLessons.ts`](src/lib/discoverLessons.ts). It early-stops once it has
   found `sum(lessonsCount)` lessons and caches for the session. This is a stopgap: it costs
   several requests and can’t scale to large catalogs. *Proper fix:* add
   `GET /api/courses/{id}/lessons` returning `LessonResponseDto[]` (ideally with a word/
   exercise count), then delete `discoverLessons.ts` and point Course detail at it.

3. **No profile / stats endpoint.** There’s no `GET /api/users/me` (or similar), and the
   auth response carries no streak/XP/words-learned. Home and Profile therefore can’t show
   those numbers — Profile shows placeholders and says so. *Fix:* add a profile endpoint
   returning the fields already on `UserResponseDto` (`currentStreakDays`, `totalXp`, …).

Minor wire-format notes the client already handles:

- Exercises serialize the type as **`type`** (from the C# `Type` property), not
  `exerciseType` as the brief said. The client reads `type` (with an `exerciseType`
  fallback).
- The generated `MultipleChoice` exercises are **word → translation** questions (the
  correct answer is intentionally absent from the payload), so the lesson UI asks
  “What does *word* mean?” rather than a fill-in-the-blank sentence. With fewer than 4
  words in a lesson, an MC question will have fewer than 4 options.
- Flashcards omit the answer by design, so “Reveal” fetches the translation via
  `POST /api/lessons/check-answer` (with a non-matching answer). No XP is awarded for that.

---

## The one backend change: CORS (dev only)

The API had **no CORS** configured, so the browser couldn’t call it cross-origin from the
Vite dev server. The minimal addition (in `LinguaFlow.API/Program.cs`) is a named policy
scoped to the Vite dev origin only, plus enabling it in the pipeline:

```csharp
// after AddSwaggerGen()
const string DevFrontendCors = "DevFrontend";
builder.Services.AddCors(options =>
    options.AddPolicy(DevFrontendCors, policy =>
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()));

// in the pipeline, after UseHttpsRedirection()
app.UseCors(DevFrontendCors);
```

No credentials/cookies are allowed (the app uses Bearer tokens), and it’s limited to the
dev origin. That is the **only** backend change. No business logic, entities, migrations,
the SM-2 algorithm, or existing endpoints were touched — and nothing was committed.

---

## Assumptions

- Registration creates a normal `User`; admin content endpoints require the seeded admin.
- “Learner first”: the admin page is intentionally minimal — just enough to make the app
  testable on an empty database.
- Enums arrive as strings (`"A1"`, `"Flashcard"`, `"Good"`, …) and are typed as string
  unions accordingly.
