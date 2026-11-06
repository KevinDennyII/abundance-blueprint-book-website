# Abundance Blueprint — Book Website

Marketing and tools site for **Long Money Concepts** and *Abundance Blueprint: A Journey to Financial Harmony* by La'Toya Ray, CPA.

| | |
|---|---|
| **Production** | [https://www.longmoneyconcepts.com](https://www.longmoneyconcepts.com) |
| **Stack** | React 19 · Vite · TypeScript · Tailwind CSS v4 · Express 5 · Postgres (Drizzle) |
| **Package manager** | pnpm (required) |
| **Deployment** | See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |

---

## Table of contents

1. [Overview](#overview)
2. [Features](#features)
3. [Repository structure](#repository-structure)
4. [Architecture](#architecture)
5. [Prerequisites](#prerequisites)
6. [Local development](#local-development)
7. [Configuration](#configuration)
8. [Application surface](#application-surface)
9. [Weekly Money Pulse](#weekly-money-pulse)
10. [Admin CMS](#admin-cms)
11. [Database](#database)
12. [Verification](#verification)
13. [Related documentation](#related-documentation)
14. [License](#license)

---

## Overview

This monorepo ships a public SPA and a companion API. The public site covers the book, library, community, live events, and service funnels. Unlisted tools (`/pulse`, `/okayinaire`) are shared by URL or email automation rather than the main nav. Content and events are managed through an admin UI backed by Postgres; email capture goes through Kit (ConvertKit).

---

## Features

| Area | Description |
|------|-------------|
| Marketing pages | Home, About, Book, Library, Circle, Live, Work With Me, Contact, legal |
| Long Money Library | Crisis PDFs, guides, Shopify buy embeds, Kit commerce links |
| Live events | Upcoming events from Postgres; past dates drop off automatically |
| Email capture | Kit forms (Chapter 1, Circle, Okayinaire, Live waitlist) via `/api/kit/subscribe` |
| Readiness assessment | Quiz + lead notify (Web3Forms) |
| Okayinaire | Unlisted landing + Kit signup |
| **Weekly Money Pulse** | Unlisted `/pulse` weekly money check-in (client-side; see below) |
| Letter / articles | `/blog` and `/articles` redirect to `letter.longmoneyconcepts.com` |
| Admin CMS | Posts, comments, events, podcast appearances, page SEO, passkeys, account |
| Analytics | Google Analytics on production hostnames only |

---

## Repository structure

```
abundance-blueprint-book-website/
├── artifacts/
│   ├── abundance-blueprint/   # Public SPA (Vite + React)
│   ├── api-server/            # Express API (/api)
│   └── mockup-sandbox/        # Design experiments (optional)
├── lib/
│   ├── db/                    # Drizzle schema, ensure-schema, seeds
│   ├── api-client-react/      # Shared API client helpers
│   ├── api-spec/              # OpenAPI / Orval codegen
│   └── api-zod/               # Shared Zod types
├── docs/                      # Operational docs (deployment, etc.)
├── netlify/                   # Optional Netlify functions
├── scripts/                   # Maintenance scripts
├── docker-compose.yml         # Local Postgres
└── package.json               # Workspace root scripts
```

---

## Architecture

```
Browser (SPA)
    │  pages, localStorage (Pulse)
    ▼
Vite frontend  ──proxy──►  Express API (/api)
                              │
                              ├── Kit (ConvertKit)
                              ├── Web3Forms
                              └── Postgres (Drizzle)
```

- **Frontend:** wouter routing, Tailwind v4, shadcn/ui, Framer Motion. Brand fonts: Cormorant Garamond + DM Sans (Pulse uses Crimson Pro + Lato on `/pulse` only).
- **API:** session cookie for admin; public Kit/readiness/live/podcast/seo endpoints as needed.
- **No visitor accounts** in v1. Pulse history is device-local; admin is the only authenticated surface.

---

## Prerequisites

- Node.js 20+ (Replit uses Node 24)
- [pnpm](https://pnpm.io/) 9+
- Docker (optional, for local Postgres via `docker-compose.yml`)

---

## Local development

```bash
pnpm install

# API env (names only in .env.example — fill secrets locally or via Infisical)
cp artifacts/api-server/.env.example artifacts/api-server/.env

# Optional frontend env (contact form)
cp artifacts/abundance-blueprint/.env.example artifacts/abundance-blueprint/.env

# Local Postgres (port 5434)
docker compose up -d

# Terminal 1 — API (default PORT=5050 in .env.example; avoids macOS AirPlay on 5000)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — site (proxies /api when API_PORT matches)
API_PORT=5050 pnpm run dev:local
```

Open **http://localhost:5173**.

| Script | Purpose |
|--------|---------|
| `pnpm run dev:local` | Frontend on port 5173 |
| `pnpm --filter @workspace/api-server run dev` | API server |
| `pnpm run typecheck` | Full TypeScript check |
| `pnpm run build` | Typecheck + build all packages |
| `pnpm run build:site` | Frontend build only |

On first API boot with an empty database, tables are created, page SEO defaults are seeded, and an admin may be created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` when configured.

---

## Configuration

Copy from `.env.example` files. **Never commit secret values.** Prefer Infisical or the host secret store for real keys.

### Frontend (`artifacts/abundance-blueprint/.env`)

| Variable | Purpose |
|----------|---------|
| `VITE_WEB3FORMS_ACCESS_KEY` | Contact form (Web3Forms) |

### API (`artifacts/api-server/.env`)

| Variable | Purpose |
|----------|---------|
| `PORT` | API listen port (use `5050` locally on macOS) |
| `KIT_API_KEY` | Kit account API key |
| `KIT_*_FORM_ID` | Numeric Kit form IDs (Chapter 1, Circle, Okayinaire, Live) |
| `KIT_LIVE_TAG_ID` | Optional Live waitlist tag ID |
| `WEB3FORMS_ACCESS_KEY` | Readiness lead notify |
| `DATABASE_URL` | Postgres connection string |
| `SESSION_SECRET` | Admin session signing (≥ 16 chars) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Bootstrap first admin |
| `WEBAUTHN_*` | Passkey RP id, name, and allowed origins |

Public Kit form / product URLs used by the SPA live in [`artifacts/abundance-blueprint/src/lib/social.ts`](artifacts/abundance-blueprint/src/lib/social.ts) (not secrets).

---

## Application surface

### Public routes (nav)

`/`, `/about`, `/book`, `/library`, `/circle`, `/live`, `/work-with-me` — plus About-linked services under Work With Me.

### Public routes (linked, not primary nav)

`/contact`, `/crisis`, `/financial-wellness-reset`, `/readiness-assessment`, `/privacy`, `/terms`

### Unlisted (share URL only)

| Path | Role |
|------|------|
| `/okayinaire` | Word / newsletter landing + Kit signup |
| `/pulse` | Weekly Money Pulse web app |

### Redirects

| Path | Target |
|------|--------|
| `/shop` | `/library` |
| `/services` | `/work-with-me` |
| `/blog`, `/articles` (+ slugs) | Letter site (`letter.longmoneyconcepts.com`) |

### API (selected)

| Method | Path | Role |
|--------|------|------|
| `GET` | `/api/healthz` | Health |
| `POST` | `/api/kit/subscribe` | Kit signup |
| `GET` | `/api/live/events` | Public events |
| `GET` | `/api/podcast-appearances` | Public appearances |
| `POST` | `/api/readiness-lead` | Assessment lead |
| `GET` | `/api/seo` | Public page meta |
| `*` | `/api/auth/*`, `/api/admin/*` | Admin session + CMS |

---

## Weekly Money Pulse

**Path:** `/pulse` (unlisted, `noindex`)

A phone-first weekly money check-in ported from the Long Money Concepts Pulse prototype. Soft Kit gate: Library and Live link to Kit Business/Personal signup forms; after signup, Kit automation should email the app URL.

| Concern | Behavior (v1) |
|---------|----------------|
| Modes | Business (full), Books elsewhere, Personal only |
| Views | Business pulse, Personal pulse, Money Map (personal), 13-week pattern |
| Persistence | `localStorage` key `lmc-money-pulse-v1` (same browser / device) |
| Export | CSV download via browser |
| Auth | None — cross-device sync is deferred |
| Code | [`artifacts/abundance-blueprint/src/pages/pulse/`](artifacts/abundance-blueprint/src/pages/pulse/) |

**Client setup:** point Kit confirmation / automation for the Weekly Pulse forms to `https://www.longmoneyconcepts.com/pulse`.

---

## Admin CMS

Sign-in: `/admin/login` (password and optional WebAuthn passkeys). Not linked in the public nav.

| Section | Path | Manages |
|---------|------|---------|
| Dashboard | `/admin` | Counts and shortcuts |
| Posts | `/admin/posts` | Draft / publish (legacy on-site blog API; public letter is external) |
| Events | `/admin/events` | Long Money Live |
| Podcast appearances | `/admin/podcast-appearances` | Appearances on `/live` |
| Comments | `/admin/comments` | Moderation |
| Page SEO | `/admin/seo` | Titles and descriptions for fixed public pages |
| Passkeys | `/admin/passkeys` | Passwordless login |
| Account | `/admin/account` | Password change |

---

## Database

Package: `@workspace/db` ([`lib/db`](lib/db)).

**Tables (ensure-schema):** `admins`, `posts`, `comments`, `passkeys`, `page_meta`, `live_events`, `podcast_appearances`.

```bash
# Push schema (when models change)
DATABASE_URL="postgres://..." pnpm --filter @workspace/db run push

# Seed admin / SEO / sample live event (see package scripts)
pnpm --filter @workspace/db run seed
pnpm --filter @workspace/db run seed-seo
pnpm --filter @workspace/db run seed-live-events
```

---

## Verification

```bash
pnpm run typecheck
pnpm run build:site
```

Manual smoke (local): home, `/library`, `/live`, `/pulse` (demo → start own → save reload), `/admin/login`, Kit signup if `KIT_API_KEY` is set.

---

## Related documentation

| Document | Contents |
|----------|----------|
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Replit / Netlify publish, secrets, Pulse Kit link |
| [replit.md](replit.md) | Replit-oriented run notes and brand pointers |
| [artifacts/abundance-blueprint/README.md](artifacts/abundance-blueprint/README.md) | Pointer to this README |
| `.env.example` files under `artifacts/*` | Env key names |

---

## License

MIT (see root `package.json`). Site content and brand assets remain property of Long Money Concepts LLC / the author.
