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

## Deployment (GitHub + Netlify)

This site is static — no database or backend required. Production hosting is configured via `netlify.toml` at the repo root.

### One-time Netlify setup

1. Push this repo to GitHub.
2. In [Netlify](https://app.netlify.com), create a new site from the GitHub repo.
3. Netlify should auto-detect settings from `netlify.toml` (no manual build config needed).
4. Under **Site configuration → Environment variables**, add:
   - `VITE_WEB3FORMS_ACCESS_KEY` — your Web3Forms access key
5. Deploy. Future pushes to the connected branch auto-deploy.

### Custom domain (Squarespace DNS)

In Squarespace → **Settings → Domains → DNS Settings**, point the domain to Netlify:

- **A record** for `@` → Netlify load balancer IP (shown in Netlify domain settings)
- **CNAME** for `www` → your `*.netlify.app` subdomain

Netlify provisions SSL automatically once DNS propagates.

## Deployment (Replit — current production)

Replit is configured via `artifacts/abundance-blueprint/.replit-artifact/artifact.toml`. Production serves the static Vite build from `dist/public`.

### Deploy checklist

1. **Push latest code to GitHub** (Replit syncs from the connected repo).
2. **Replit Secrets** — confirm `VITE_WEB3FORMS_ACCESS_KEY` is set (required at **build** time for Vite).
3. In Replit, open **Deployments** and publish a new deployment.
4. After deploy, test `/contact` on the live URL — submit a test message.
5. If Web3Forms blocks the Replit domain, approve it in the [Web3Forms dashboard](https://web3forms.com) or contact their support with your deployment URL.

`PORT` and `BASE_PATH` for production builds are set in the artifact config. No database or API server is needed for this site.

### Local commands

```bash
pnpm install
pnpm run dev:local    # http://localhost:5173
pnpm run build:site   # production build (same as Netlify)
```

## Credits
This site was developed using Replit AI.
