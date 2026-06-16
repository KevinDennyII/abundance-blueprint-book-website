# Abundance Blueprint: A Journey to Financial Harmony

Author website for La'Toya Ray, CPA — *Abundance Blueprint: A Journey to Financial Harmony*.

## Tech Stack

- React, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, wouter, Framer Motion

## Environment Variables

Copy `.env.example` to `.env` for local development.

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_WEB3FORMS_ACCESS_KEY` | Build time (Vite) | Contact form via [Web3Forms](https://web3forms.com) |
| `KIT_API_KEY` | Runtime (API server) | Kit V4 API key |
| `KIT_CHAPTER1_FORM_ID` | Runtime (API server) | Numeric Kit form ID — Chapter 1 (embed UID ref: `e30afd8248`) |
| `KIT_CIRCLE_FORM_ID` | Runtime (API server) | Numeric Kit form ID — Long Money Circle (embed UID ref: `87ce6821c1`) |

Embed UIDs are not API form IDs. Copy the numeric IDs from the Kit dashboard.

## Local Development

```bash
pnpm install

# Terminal 1 — API server (Kit + health check)
PORT=5000 KIT_API_KEY=... KIT_CHAPTER1_FORM_ID=... KIT_CIRCLE_FORM_ID=... \
  pnpm --filter @workspace/api-server run dev

# Terminal 2 — frontend (proxies /api to port 5000)
pnpm run dev:local
```

## Deployment

### Replit (current production)

The website artifact serves a static Vite build. Kit signups and other `/api` routes are handled by the **API Server** artifact.

**Do not modify** `artifacts/abundance-blueprint/.replit-artifact/artifact.toml` unless Replit's publish flow requires it. Replit expects `publicDir` + `serve = "static"` for the website artifact.

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
