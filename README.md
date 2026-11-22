# Blindify

A music blind test built from your Spotify playlists.

Sign in with Spotify, pick a playlist, choose how many samples you want and how long they last, then start playing: a sample plays, you guess, the answer is revealed, and the game moves on to the next one.

## Table of contents

- [Blindify](#blindify)
	- [Table of contents](#table-of-contents)
	- [How it works](#how-it-works)
	- [Tech stack](#tech-stack)
	- [Repository structure](#repository-structure)
	- [Prerequisites](#prerequisites)
	- [Installation](#installation)
	- [Configuration](#configuration)
		- [Backend (`apps/app-backend/.env`)](#backend-appsapp-backendenv)
		- [Frontend (`apps/app-frontend/.env`)](#frontend-appsapp-frontendenv)
	- [Running locally](#running-locally)
	- [Useful scripts](#useful-scripts)
	- [API](#api)
	- [Tests and quality](#tests-and-quality)
	- [Deployment](#deployment)
	- [Releases](#releases)

## How it works

1. **Login**: the user authenticates through Spotify OAuth2. The backend creates a session (stored in the database) and ties it to the user with a cookie.
2. **Playlist selection**: the frontend lists the user's playlists and lets them search public ones.
3. **Game creation**: pick 10, 20 or 30 samples, each lasting 10 or 20 seconds.
4. **Sample preparation**: Spotify does not provide usable audio, so the backend fetches the playlist tracks, shuffles them, and looks up a 30-second preview of each one on Deezer. A similarity score (title, artist, album) filters out wrong matches. Tracks without a match are skipped.
5. **Audio processing**: each sample is trimmed and gets a fade-in and fade-out through FFmpeg, then is stored in Redis.
6. **Game flow**: a game goes through the `loading`, `ready`, `listening`, `revealing` and `finished` states. A scheduled job moves games forward, and the frontend follows them in real time with Server-Sent Events.
7. **Cleanup**: finished games are purged automatically.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, TanStack Router, TanStack Query, Tailwind CSS 4, `class-variance-authority`, Lucide |
| Backend | Node.js, Fastify 5, Zod, `fastify-type-provider-zod`, Scalar (OpenAPI docs) |
| Data | PostgreSQL (sessions, through Prisma), Redis (cache, games, audio samples) |
| Audio | FFmpeg (`fluent-ffmpeg`) |
| Music sources | Spotify API (authentication, playlists), Deezer API (audio previews) |
| Tooling | pnpm workspaces, TypeScript, tsup, Vitest, ESLint, `@hey-api/openapi-ts` |
| Deployment | Docker, Docker Compose, Traefik (Let's Encrypt HTTPS), GitHub Actions |

## Repository structure

pnpm monorepo: applications live in `apps/`, shared code in `libs/`.

```
.
├── apps/
│   ├── app-backend/            Fastify API
│   └── app-frontend/           React application
├── libs/
│   ├── lib-audio/              Audio download and transformation (FFmpeg)
│   ├── lib-auto-loader/        Fastify plugin: routes and jobs loaded from the folder tree
│   ├── lib-cache/              Typed Redis cache
│   ├── lib-clip/               Audio sample lookup on Deezer
│   ├── lib-database/           Prisma schema and client
│   ├── lib-env/                Environment variable validation
│   ├── lib-logger/             Logger
│   ├── lib-pagination/         Pagination helpers
│   ├── lib-platform-connector/ Spotify and Deezer connectors
│   ├── lib-session/            Session creation, retrieval and revocation
│   └── lib-utils/              Miscellaneous helpers
├── deploy/                     Docker Compose and deployment scripts
├── release-notes/              Release notes
```

Several libs ship their own `README.md` with a detailed API (`lib-auto-loader`, `lib-cache`, `lib-env`, `lib-logger`, `lib-pagination`, `lib-session`, `lib-utils`).

Backend routes are defined by the folder tree of `apps/app-backend/src/routes`: the file path gives the URL and the file name gives the HTTP method. For example, `routes/games/:gameId/get.ts` exposes `GET /games/{gameId}`. Scheduled tasks live in `apps/app-backend/src/jobs`.

## Prerequisites

- [Node.js](https://nodejs.org/) 22 (the version used by the CI)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [FFmpeg](https://ffmpeg.org/) installed and available in your `PATH`
- A PostgreSQL 15 instance and a Redis 7 instance
- A Spotify app created on the [developer dashboard](https://developer.spotify.com/dashboard)
  - redirect URI to register: `http://127.0.0.1:8000/auth/callback` (adjust to your `APP_URL`)

You can spin up Postgres and Redis quickly with Docker:

```bash
docker run -d --name blindify-db -e POSTGRES_USER=default -e POSTGRES_PASSWORD=password -e POSTGRES_DB=blindify -p 5432:5432 postgres:15-alpine
docker run -d --name blindify-redis -p 6379:6379 redis:7-alpine
```

## Installation

```bash
git clone git@github.com:maxencebonamy/blindify.git
cd blindify
pnpm install
```

Generate the Prisma client and the API clients (Spotify, Deezer, backend), and build the libs:

```bash
pnpm --filter lib-database run db:generate
pnpm -r --filter "./libs/*" run gen
pnpm -r --filter "./libs/*" run build
pnpm --filter app-backend run gen
pnpm --filter app-frontend run gen
```

> The frontend client is generated from `apps/app-backend/openapi-backend.yaml`. After changing a backend route, run `gen` again in the frontend.

## Configuration

Copy the example files and fill in the values.

```bash
cp apps/app-backend/.env.example apps/app-backend/.env
cp apps/app-frontend/.env.example apps/app-frontend/.env
```

### Backend (`apps/app-backend/.env`)

| Variable | Description | Example |
| --- | --- | --- |
| `APP_HOST` | Public host of the backend | `http://127.0.0.1` |
| `APP_PORT` | Listening port | `8000` |
| `APP_URL` | Full public URL, used for the OAuth callback | `http://127.0.0.1:8000` |
| `APP_ENV` | `development` or `production` | `development` |
| `ALLOWED_ORIGINS` | Allowed CORS origins, comma-separated | `http://127.0.0.1:3000` |
| `SPOTIFY_CLIENT_ID` | Spotify app client ID | |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret | |
| `LOG_LEVEL` | Log level | `INFO` |
| `CACHE_TTL` | Default cache TTL, in seconds | `3600` |
| `REDIS_URL` | Redis connection URL | `redis://default:password@localhost:6379` |
| `POSTGRES_URL` | PostgreSQL connection URL | `postgres://default:password@localhost:5432/blindify` |
| `CLIP_PROVIDERS` | Audio sample providers | `deezer` |

### Frontend (`apps/app-frontend/.env`)

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_APP_REDIRECT_URL` | Frontend URL the backend redirects to after login | `http://127.0.0.1:3000` |
| `VITE_BACKEND_URL` | Backend URL | `http://127.0.0.1:8000` |

## Running locally

Apply the migrations, then start both applications in two terminals.

```bash
pnpm --filter lib-database run db:migrate
```

```bash
pnpm --filter app-backend run dev
```

```bash
pnpm --filter app-frontend run dev
```

- Frontend: <http://127.0.0.1:3000>
- Backend: <http://127.0.0.1:8000>
- Health check: `GET /health`

To work on a lib at the same time, run `pnpm --filter <lib> run dev`: tsup rebuilds on every change.

## Useful scripts

| Command | Effect |
| --- | --- |
| `pnpm lint` | Lint the whole repository with auto-fix |
| `pnpm -r run lint` | Lint each package |
| `pnpm -r run test` | Run all tests |
| `pnpm --filter <package> run <script>` | Run a script in a single package |
| `pnpm --filter lib-database run db:migrate` | Create and apply a Prisma migration |
| `pnpm --filter lib-database run db:generate` | Regenerate the Prisma client |

## API

The backend embeds Scalar to document the API, and the OpenAPI specification is versioned in [`apps/app-backend/openapi-backend.yaml`](apps/app-backend/openapi-backend.yaml).

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/health` | Service status |
| `GET` | `/auth/login` | Redirects to Spotify |
| `GET` | `/auth/callback` | OAuth2 callback |
| `GET` | `/auth/me` | Current user |
| `POST` | `/auth/logout` | Log out |
| `GET` | `/playlists` | Search and list playlists |
| `GET` | `/playlists/{playlistId}` | Playlist details |
| `POST` | `/games` | Create a game |
| `GET` | `/games/{gameId}` | Game state |
| `GET` | `/games/{gameId}/events` | SSE stream of updates |
| `GET` | `/games/{gameId}/sample` | Current sample |
| `GET` | `/games/{gameId}/track` | Track of the current sample |
| `GET` | `/audio/{audioId}` | Audio file of a sample |

Most routes require a valid session.

## Tests and quality

```bash
pnpm -r run test
pnpm -r run lint
```

Tests use Vitest. `lib-clip` also ships a dataset (`libs/lib-clip/tests/data`) used to check how well a Spotify track matches its Deezer preview.

## Deployment

The CI (`.github/workflows/pipeline.yaml`) runs on every push to `main`, every pull request and every `vX.Y.Z` tag. It installs dependencies, generates the clients, runs lint and tests, builds the packages, then builds and pushes the frontend and backend Docker images to GitHub Container Registry.

Production is deployed with Docker Compose:

```bash
cp deploy/.env.example deploy/.env
# fill in the values
./deploy/deploy.sh
```

[`deploy/docker-compose.yml`](deploy/docker-compose.yml) starts:

- the backend and the frontend, in both production and test flavors,
- one PostgreSQL and one Redis per environment,
- Traefik, which serves everything over HTTPS with Let's Encrypt certificates.

The backend container applies Prisma migrations on startup. To update an existing deployment, use `deploy/update.sh`.

## Releases

Changes for each version are listed in [`release-notes/v1.md`](release-notes/v1.md).
