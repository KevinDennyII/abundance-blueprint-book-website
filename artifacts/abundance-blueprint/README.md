# Abundance Blueprint: A Journey to Financial Harmony

This is the author website for La'Toya Ray, CPA, for her book "Abundance Blueprint: A Journey to Financial Harmony". 

## Tech Stack
- React
- Vite
- Tailwind CSS
- shadcn/ui
- wouter
- Framer Motion
- TypeScript

## Contact Form Setup

The contact form sends messages via [Web3Forms](https://web3forms.com).

1. Create a free access key at https://web3forms.com (use your email for now).
2. Copy `.env.example` to `.env` in this directory.
3. Set `VITE_WEB3FORMS_ACCESS_KEY` to your access key.
4. When the client's email is ready, update the recipient in the Web3Forms dashboard — no code changes needed.

## Kit Email Signup Setup

Chapter 1 and Long Money Circle forms submit to Kit via a server-side proxy (`/api/kit/subscribe`). The purple signup design is preserved — Kit's embed script is not used.

### Environment variables

Set these as **runtime** secrets (Replit Secrets or Netlify environment variables). Do not prefix with `VITE_`.

| Variable | Description |
|----------|-------------|
| `KIT_API_KEY` | Kit V4 API key (Kit → Settings → Developer) |
| `KIT_CHAPTER1_FORM_ID` | Numeric form ID for the Chapter 1 incentive form (embed UID reference: `e30afd8248`) |
| `KIT_CIRCLE_FORM_ID` | Numeric form ID for The Long Money Circle form (embed UID reference: `87ce6821c1`) |

The embed UIDs are not the API form IDs. In Kit, open each form and copy the numeric ID from the dashboard or API.

### Local development

Run the API server alongside the Vite dev server so `/api` requests are proxied:

```bash
# Terminal 1
PORT=5000 KIT_API_KEY=... KIT_CHAPTER1_FORM_ID=... KIT_CIRCLE_FORM_ID=... \
  pnpm --filter @workspace/api-server run dev

# Terminal 2
pnpm run dev:local
```

### Replit (current production)

Production uses Replit's static artifact config (`publicDir` + `serve = "static"`). Add `KIT_API_KEY`, `KIT_CHAPTER1_FORM_ID`, and `KIT_CIRCLE_FORM_ID` to **Replit Secrets** on the API Server artifact (runtime — not build-time). Do not modify `.replit-artifact/artifact.toml` unless required by Replit's publish flow.

### Netlify (future)

A Netlify Function at `netlify/functions/kit-subscribe.ts` handles the same endpoint. Add the three Kit env vars in Netlify site settings.

## Deployment (GitHub + Netlify)

This site is static — no database or backend required. Production hosting is configured via `netlify.toml` at the repo root.

### One-time Netlify setup

1. Push this repo to GitHub.
2. In [Netlify](https://app.netlify.com), create a new site from the GitHub repo.
3. Netlify should auto-detect settings from `netlify.toml` (no manual build config needed).
4. Under **Site configuration → Environment variables**, add:
   - `VITE_WEB3FORMS_ACCESS_KEY` — your Web3Forms access key
   - `KIT_API_KEY` — Kit V4 API key
   - `KIT_CHAPTER1_FORM_ID` — numeric Kit form ID for Chapter 1
   - `KIT_CIRCLE_FORM_ID` — numeric Kit form ID for The Long Money Circle
5. Deploy. Future pushes to the connected branch auto-deploy.

### Custom domain (Squarespace DNS)

In Squarespace → **Settings → Domains → DNS Settings**, point the domain to Netlify:

- **A record** for `@` → Netlify load balancer IP (shown in Netlify domain settings)
- **CNAME** for `www` → your `*.netlify.app` subdomain

Netlify provisions SSL automatically once DNS propagates.

## Deployment (Replit — current production)

Replit is configured via `artifacts/abundance-blueprint/.replit-artifact/artifact.toml`. Production serves the static Vite build from `dist/public`.

**Important:** Do not modify `.replit-artifact/artifact.toml` unless Replit's publish flow requires it. Replit uses `publicDir` + `serve = "static"` for the website artifact. Kit email signups are handled by the separate **API Server** artifact at `/api` (see `artifacts/api-server/.replit-artifact/artifact.toml`).

### Deploy checklist

1. **Push latest code to GitHub** (Replit syncs from the connected repo).
2. **Replit Secrets** — confirm `VITE_WEB3FORMS_ACCESS_KEY` is set (required at **build** time for Vite).
3. **Replit Secrets** — set `KIT_API_KEY`, `KIT_CHAPTER1_FORM_ID`, and `KIT_CIRCLE_FORM_ID` on the **API Server** artifact (required at **runtime** for email signups).
4. In Replit, open **Deployments** and publish a new deployment.
5. After deploy, test `/contact` and the Chapter 1 / Circle signup forms on the live URL.
6. If Web3Forms blocks the Replit domain, approve it in the [Web3Forms dashboard](https://web3forms.com) or contact their support with your deployment URL.

`PORT` and `BASE_PATH` for production builds are set in the artifact config. The website artifact is static-only; `/api/kit/subscribe` is served by the API Server artifact.

### Local commands

```bash
pnpm install
pnpm run dev:local    # http://localhost:5173
pnpm run build:site   # production build (same as Netlify)
```

## Credits
This site was developed using Replit AI.
