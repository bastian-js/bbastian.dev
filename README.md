# bbastian.dev

Personal portfolio website and full-stack web application. Built with React, TypeScript, and a Node.js backend.

## Tech Stack

**Frontend**

- React 19 + TypeScript
- React Router 7
- Tailwind CSS 4
- Vite

**Backend**

- Node.js + Express
- MySQL
- Nodemailer
- Zod

## Features

- **Portfolio** — Projects overview with status indicators and live links
- **Timeline** — Milestone timeline from 2020 to present
- **Spotify integration** — Shows currently playing track in the navbar (live refresh every 5s)
- **GitHub stats** — Fetches live repo count, stars, and top languages via the GitHub API
- **Contact form** — Rate-limited form with server-side validation, delivered via SMTP
- **Noury waitlist** — Landing page + email waitlist backed by MySQL for the upcoming Noury app
- **About** — Developer philosophy and approach

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- Spotify Developer App (Client ID + Secret + Refresh Token)
- GitHub Personal Access Token

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
node index.js
```

### Environment Variables

**Frontend (`.env`)**

```env
VITE_API_URL=http://localhost:3001
```

**Backend (`server/.env`)**

Copy `server/.env.example` to `server/.env` and fill in the values.

```env
PORT=3001

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASS=
DB_NAME=

# GitHub
GITHUB_TOKEN=
GITHUB_USERNAME=

# Spotify
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

# Email (SMTP)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
MAIL_TO=
```

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | TypeScript check + production build  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

## Project Structure

```
├── src/
│   ├── components/       # Shared UI components (NavBar, Footer, …)
│   ├── pages/            # Route-level page components
│   ├── routes.tsx        # Route definitions
│   └── App.tsx           # Root layout
├── server/
│   ├── index.js          # Express server + all API endpoints
│   └── db.js             # MySQL connection
└── public/               # Static assets
```

## API Endpoints

| Method | Path                   | Description                                |
| ------ | ---------------------- | ------------------------------------------ |
| `GET`  | `/github-stats`        | Repo count, stars, top languages           |
| `GET`  | `/spotify/now-playing` | Current or last played Spotify track       |
| `POST` | `/contact`             | Contact form (rate-limited, Zod-validated) |
| `POST` | `/noury/waitlist`      | Add email to Noury waitlist                |
