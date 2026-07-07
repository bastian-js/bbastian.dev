# CLAUDE.md

Guidance for Claude Code when working in this repository. Read this first — it
is meant to save you from re-exploring the codebase on every session.

## What this is

Personal portfolio + playground website for **bbastian.dev** (owner: Bastian,
GitHub `bastian-js`, developer/student, Austria). A React SPA frontend plus a
small Express API. The site hosts the portfolio, some mini-apps (PiggyTrack,
DropNote, ProPerform), landing pages for side projects (Noury), Spotify stats
pages, hidden easter-egg games, and interactive features like **Leave a Word**.

- **Live frontend:** https://bbastian.dev
- **Live API:** https://api.bbastian.dev (referenced in code as `const API = "https://api.bbastian.dev"`)
- Design tone: dark, minimal, "developer aesthetic", emerald accent.

## Tech stack

**Frontend** (repo root)
- React 19 + TypeScript, Vite 7, React Router v7 (`react-router-dom`)
- Tailwind CSS v4 (via `@tailwindcss/vite`) — utility classes **plus** heavy use of inline `style={{}}` objects for colors/borders/animations
- `lucide-react` for icons, `chart.js` + `react-chartjs-2` for charts, `canvas-confetti`, `react-snowfall`
- Dev server runs on Vite (port 5173). Preview build on 3030.

**Backend** (`server/`)
- Node ESM (`"type": "module"`), Express 4, `mysql2/promise` connection pool
- `zod` for input validation, `express-rate-limit` for rate limiting
- `resend` + `nodemailer` for the contact form, Spotify Web API integration
- Runs on `process.env.PORT`. DB config via `DB_HOST/DB_USER/DB_PASS/DB_NAME/DB_PORT` (see `server/.env.example`).

## Commands

Frontend (from repo root):
- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (typecheck THEN build)
- `npm run lint` — ESLint
- `npx tsc -b` — typecheck only (fast; use this to verify TS changes)

Backend (from `server/`):
- `node index.js` — start the API (needs `server/.env`)
- No test suite exists in either package.

There are **no automated tests**. Verify frontend changes with `npx tsc -b`
(and `npm run lint` for anything non-trivial). Verify server changes by reading
the affected route carefully — there is no test harness.

## Project layout

```
/                     Frontend (Vite root)
  index.html
  src/
    App.tsx           Router shell + global keyboard shortcuts + easter eggs
    routes.tsx        Central route table — add new pages here
    main.tsx          Entry
    globals.css / index.css
    components/       Shared UI (NavBar, Footer, FadeIn, games, overlays, AnnouncementBanner, SplashScreen…)
    pages/            One file per route (Home, Projects, About, Contact, Now, LeaveAWord, PiggyTrack…)
      noury/          Noury side-project landing + legal pages
      spotify/        Spotify stats / hall-of-fame / OAuth callback pages
  public/
  dist/               Build output (committed)
server/
  index.js            ALL API routes live here (one big file, ~1050 lines)
  db.js               mysql2 pool export (`db`)
  bad-words.json      Banned-words list ({ "words": [...] }) for content filtering
  get-spotify-token.mjs   One-off script to mint a Spotify refresh token
  .env / .env.example
```

## Conventions & patterns (match these)

- **Styling:** Tailwind utilities for layout; inline `style={{}}` for colors,
  borders, and hover transitions. Hover effects are done with
  `onMouseEnter`/`onMouseLeave` mutating `e.currentTarget.style`, not CSS
  `:hover`. Follow the existing component you're editing.
- **Color palette:** background `#0a0a0a` / cards `#111`; emerald accent
  `#34d399` (tints used a lot: `#34d39918`, `#34d39930`); text white with
  `rgba(255,255,255,α)` for muted greys; hairline borders
  `1px solid rgba(255,255,255,0.05–0.09)`; cards are `rounded-xl`.
- **Fonts:** Inter for UI, monospace (`Courier New`) for accents/labels/counters.
- **Animations:** `FadeIn` component wraps content with a `delay` prop
  (`delay={index * 40}`) for staggered entrance. Keyframes are injected via
  inline `<style>` tags inside components (see Footer, SplashScreen).
- **Adding a page:** create `src/pages/Foo.tsx`, import + register it in
  `src/routes.tsx`. If it should appear in nav, add to `NAV_LINKS` in
  `src/components/Footer.tsx` (and NavBar if relevant).
- **Keyboard shortcuts & easter eggs** live in `App.tsx`: single-key nav
  (h/p/s/a/c/n/l/g), Ctrl/Cmd+K & `/` search, `?` shortcuts overlay, Konami
  code → hacker terminal, typed `mine`/`snake`/`matrix` → games.
- **localStorage/sessionStorage:** always wrap access in a try/catch helper
  (private-mode / quota safety). See `safeLocalStorage` in `LeaveAWord.tsx` and
  `AnnouncementBanner.tsx`, and `SESSION_KEY` guard in `SplashScreen.tsx`.
- **Windows environment:** default shell is PowerShell; a Bash tool is also
  available. Prefer forward-slash paths.

## Server / API notes

Base URL `https://api.bbastian.dev`. All routes are defined in `server/index.js`.
CORS allows `bbastian.dev` + any `*.bbastian.dev` subdomain + localhost. Key
endpoints:

- `GET  /github-stats` — GitHub profile/repo/language stats. Wrapped in a
  10-min in-memory cache (`ghCache`); on GitHub failure it serves stale data
  instead of 500. (Uncached it fires N+2 GitHub requests — one per repo.)
- Spotify: `GET /spotify/{auth,exchange,now-playing,top-tracks,hall-of-fame,artist-hall-of-fame}`
- `POST /contact` (rate-limited) — sends email via Resend/nodemailer, zod-validated
- `POST /noury/waitlist`, `GET /noury/waitlist/count`
- Leaderboards: `GET|POST /leaderboard/{minesweeper,snake}` (POST rate-limited)
- **Leave a Word:** `POST /leave-a-word` (rate-limited, cookie `visitor_id`),
  `GET /leave-a-word/all?page=&sort=newest|oldest`
- Visitors: `POST /visitors/ping`, `GET /visitors/count`
- **Live cursors (WebSocket):** `wss://api.bbastian.dev/cursors`. Client sends
  `{x,y}` (normalized 0–1); server assigns a random color per connection
  and broadcasts `{type:"state",cursors:[{id,x,y,color}]}` at ~20fps
  (each client gets everyone *except* itself) plus `{type:"leave",id}`. The
  Express `app` is wrapped in an `http.createServer` so `ws` can share the port
  (`server.listen`, upgrade handler filters path `/cursors` + origin).

**Logging:** use `logError(context, err)` / `logInfo(msg)` (top of
`server/index.js`) — they prefix an ISO timestamp for readable pm2 logs. A
global Express error middleware (after all routes) + `uncaughtException` /
`unhandledRejection` handlers catch everything else. The CORS `origin` callback
denies with `callback(null, false)` (never throws) so origin-less requests
don't spam error stacks.

**Content filtering:** `normalizeWord()` folds leetspeak, German umlauts,
spacing and accents down to `[a-z0-9]` before comparing against
`bad-words.json`. `isBannedWord()` uses it for both submitted words and names.

**Leave a Word validation rules** (`validateSubmittedWord` + `leaveAWordNameSchema`):
- Word: 2–51 chars, **exactly one word** (no whitespace), not banned.
- Name: 2–30 chars, no leading/trailing space, no line breaks/tabs, **≤ 3
  words** (a name, not a sentence), not banned.
- The frontend (`src/pages/LeaveAWord.tsx`) mirrors these: name input
  `maxLength=30`, word input strips whitespace on change (`maxLength=51`).

## Features added / gotchas

- **AnnouncementBanner** (`src/components/AnnouncementBanner.tsx`, rendered in
  `App.tsx`): bottom-**right** "cookie-style" nudge for Leave a Word. Stores no
  cookie — dismissal is persisted in `localStorage["law_banner_dismissed"]="1"`
  (permanent). Hidden on the `/leave-a-word` page itself. Slide-in/out via
  transform+opacity.
- **SplashScreen** (`src/components/SplashScreen.tsx`): split-panel intro shown
  once per session (`sessionStorage["bbastian_splash_shown"]`). A module-level
  `_started` guard prevents React StrictMode double-init. Timers intentionally
  have no cleanup so they survive StrictMode remount. Total run ≈ 1.65s.
- **LiveCursors** (`src/components/LiveCursors.tsx`, mounted in `App.tsx`):
  Figma-style multiplayer cursors on a click-through `<canvas>`. Two config
  consts at the top of the file: `TEST` (bool) and `TEST_CURSOR_COUNT` (0–1000).
  `TEST=true` simulates wandering fake cursors (no backend). `TEST=false`
  connects to the `/cursors` WebSocket — colors come from the server, the
  client only broadcasts its own `{x,y}`. Colored arrow only, no name labels.
  Canvas-rendered so it scales to 1000.
- `dist/` is committed — rebuild it if the frontend needs to be deployed from
  the repo.

## Working agreements

- Commit or push only when explicitly asked. Default branch is `main`.
- The owner communicates in German; code, comments, and identifiers stay in
  English (existing inline comments are a mix of German/English — match the file
  you're editing).
- Keep this file up to date when you add features, routes, or conventions so
  future sessions stay cheap.
