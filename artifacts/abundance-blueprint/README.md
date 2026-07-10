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

Embed UIDs are not API form IDs. The numeric IDs above are configured in Replit/Netlify secrets.

## Local Development

```bash
pnpm install

# Copy API server env (Kit secrets are runtime-only, not in the frontend .env)
cp artifacts/api-server/.env.example artifacts/api-server/.env
# Add KIT_API_KEY from Kit → Settings → Advanced → API

# Terminal 1 — API server (Kit + health check)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — frontend (proxies /api to port 5000, or API_PORT if set)
pnpm run dev:local
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
4. Publish a new deployment in Replit.
5. Test `/contact`, Chapter 1 signup (home + footer), and `/circle` signup.

### Netlify (future)

Configured via `netlify.toml` at the repo root. Add all env vars above in Netlify site settings. Kit is handled by `netlify/functions/kit-subscribe.ts`.

For custom domain (Squarespace DNS): point `@` A record and `www` CNAME to Netlify per their domain settings.

## Credits

Developed using Replit AI.
