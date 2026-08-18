# Abundance Blueprint: A Journey to Financial Harmony

Author website for La'Toya Ray, CPA — *Abundance Blueprint: A Journey to Financial Harmony*.

## Tech Stack

- React, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, wouter, Framer Motion

## Environment Variables

Copy `.env.example` to `.env` for local development.

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_WEB3FORMS_ACCESS_KEY` | Build time (Vite) | Contact form via [Web3Forms](https://web3forms.com) |
| `KIT_API_KEY` | Runtime (API server) | Kit account API key (Settings → Advanced → API) |
| `KIT_CHAPTER1_FORM_ID` | Runtime (API server) | `9557935` — Chapter 1 incentive form |
| `KIT_CIRCLE_FORM_ID` | Runtime (API server) | `9564646` — Long Money Circle form |
| `DATABASE_URL` | Runtime (API server + db package) | Postgres connection string for blog posts/comments |
| `SESSION_SECRET` | Runtime (API server) | Signs the admin session cookie (min 16 chars) |
| `ADMIN_EMAIL` | Bootstrap / seed | Creates the first admin if none exists; also used by `pnpm --filter @workspace/db run seed` |
| `ADMIN_PASSWORD` | Bootstrap / seed | Temporary first-login password. Changing it in Admin → Account does not require updating this secret. |
| `WEBAUTHN_RP_ID` | Runtime (API server) | Passkey relying party ID (e.g. `localhost` or `yourdomain.com`) |
| `WEBAUTHN_RP_NAME` | Runtime (API server) | Display name shown in passkey prompts |
| `WEBAUTHN_ORIGIN` | Runtime (API server) | Allowed origin(s), comma-separated (e.g. `http://localhost:5174`) |

Embed UIDs are not API form IDs. The numeric IDs above are configured in Replit/Netlify secrets.

## Blog setup

1. Provision a Postgres database (e.g. Neon) and set `DATABASE_URL` in `artifacts/api-server/.env`.
2. Push the schema:

```bash
DATABASE_URL="postgres://..." pnpm --filter @workspace/db run push
```

3. Seed the admin account (La'Toya's login):

```bash
DATABASE_URL="postgres://..." \
ADMIN_EMAIL="her@email.com" \
ADMIN_PASSWORD="a-strong-password" \
pnpm --filter @workspace/db run seed
```

4. Seed default page SEO (safe to re-run; only inserts missing paths, never overwrites edits):

```bash
DATABASE_URL="postgres://..." pnpm --filter @workspace/db run seed-seo
```

5. Set `SESSION_SECRET` (and the same `DATABASE_URL`) in `artifacts/api-server/.env`.
6. Start the API server and site. Admin UI: `/admin/login` (not linked in the public nav).

> Whenever the database schema changes (e.g. this SEO update added `page_meta`
> plus `posts.meta_title` / `posts.meta_description`), re-run
> `pnpm --filter @workspace/db run push` before starting the server.

Public blog: `/blog`. Comments are moderated — approve them under `/admin/comments`.

## Admin dashboard (client guide)

La'Toya signs in at `/admin/login` (password, or a registered passkey). The
sidebar has everything she can manage:

- **Dashboard** (`/admin`) — counts for published posts, drafts, and comments
  awaiting review, plus recent posts and quick actions.
- **Posts** (`/admin/posts`) — write, edit, publish, or delete blog posts. Each
  post has optional **SEO** fields (meta title + meta description); leave them
  blank to fall back to the post title and excerpt.
- **Comments** — approve or reject reader comments before they appear. The
  sidebar shows a badge with the number still awaiting review.
- **Page SEO** — set a unique title and meta description for every fixed public
  page (Home, About, The Book, Work With Me, The Long Money Circle, Blog,
  Privacy, Terms). Changes are live immediately and control the browser tab,
  Google search snippets, and social link previews.
- **Passkeys** — register or remove passkeys for passwordless login.

Titles and descriptions are applied on the public site as the visitor navigates.
Admin and login pages are marked `noindex` so search engines skip them.

## Local Development

```bash
pnpm install

# Copy API server env (Kit secrets are runtime-only, not in the frontend .env)
cp artifacts/api-server/.env.example artifacts/api-server/.env
# Add KIT_API_KEY from Kit → Settings → Advanced → API
# Add DATABASE_URL / SESSION_SECRET (see Blog setup below)

# Optional: local Postgres via Docker
docker compose up -d

# Terminal 1 — API server (Kit + blog + health check)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — frontend (proxies /api to port 5050 if API_PORT=5050)
API_PORT=5050 pnpm run dev:local
```

On macOS, port 5000 is often taken by AirPlay — use `PORT=5050` in `artifacts/api-server/.env` and `API_PORT=5050` when starting the frontend.

## Deployment

### Replit (current production)

The website artifact builds with Vite and runs via `pnpm --filter @workspace/abundance-blueprint run serve`. Kit signups and other `/api` routes are handled by the **API Server** artifact.

`artifacts/abundance-blueprint/.replit-artifact/artifact.toml` uses explicit `services.production.build` and `services.production.run` commands so Replit Publishing can detect a valid run command.

**Deploy checklist:**

1. Push to GitHub (Replit syncs from the connected repo).
2. **Replit Secrets** — `VITE_WEB3FORMS_ACCESS_KEY` (build time, website artifact).
3. **Replit Secrets** — `KIT_API_KEY`, `KIT_CHAPTER1_FORM_ID`, `KIT_CIRCLE_FORM_ID` (runtime, API Server artifact).
4. **Replit Database** provides `DATABASE_URL` automatically. **Secrets:** `SESSION_SECRET`, `ADMIN_PASSWORD`. **Configurations:** `ADMIN_EMAIL`. On API start the server creates missing tables, seeds page SEO defaults, and creates the first admin if the `admins` table is empty.
5. Publish a new deployment in Replit (API Server + website).
6. Test `/contact`, Chapter 1 signup (home + footer), `/circle` signup, `/blog`, `/admin/login`, **Account** (change password), and the admin **Page SEO** screen.

### Netlify (future)

Configured via `netlify.toml` at the repo root. Add all env vars above in Netlify site settings. Kit is handled by `netlify/functions/kit-subscribe.ts`.

For custom domain (Squarespace DNS): point `@` A record and `www` CNAME to Netlify per their domain settings.

## Credits

Developed using Replit AI.
