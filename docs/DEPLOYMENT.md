# Deployment Guide

Operational notes for publishing the Long Money Concepts / Abundance Blueprint website. For product overview and local development, see the root [README.md](../README.md).

**Primary host:** Replit (autoscale). Preview and republish via Replit after changes land on `main`. Do not treat GitHub or Netlify PR deploy previews as the client review path.

---

## Architecture on Replit

| Artifact | Role |
|----------|------|
| Website (`@workspace/abundance-blueprint`) | Vite build + `pnpm serve` (static SPA) |
| API Server (`@workspace/api-server`) | Express app at `/api` (Kit, admin, events, SEO, etc.) |
| Replit Database | Provides `DATABASE_URL` for Postgres |

Website artifact config: [`artifacts/abundance-blueprint/.replit-artifact/artifact.toml`](../artifacts/abundance-blueprint/.replit-artifact/artifact.toml) — explicit `services.production.build` and `services.production.run` so Publishing detects a valid run command.

---

## Deploy checklist (Replit)

1. Merge or push to `main` (Replit syncs from the connected GitHub repo).
2. **Website secrets (build time):** `VITE_WEB3FORMS_ACCESS_KEY` for `/contact`.
3. **API secrets (runtime):**
   - `WEB3FORMS_ACCESS_KEY` — readiness assessment lead notify (falls back to `VITE_WEB3FORMS_ACCESS_KEY` if only that is set workspace-wide)
   - `KIT_API_KEY`, `KIT_CHAPTER1_FORM_ID`, `KIT_CIRCLE_FORM_ID`, `KIT_OKAYINAIRE_FORM_ID`, `KIT_LIVE_FORM_ID`
   - Optional: `KIT_LIVE_TAG_ID` for the `long-money-live` tag
   - `SESSION_SECRET`, `ADMIN_PASSWORD`
   - Configurations: `ADMIN_EMAIL`
   - Passkeys: `WEBAUTHN_RP_ID`, `WEBAUTHN_RP_NAME`, `WEBAUTHN_ORIGIN` (HTTPS + real domain in production)
4. **Database:** Replit Database supplies `DATABASE_URL`. On API start the server creates missing tables, seeds page SEO defaults, and creates the first admin if `admins` is empty.
5. Publish a new deployment (API Server + website).
6. Smoke-test: `/contact`, `/readiness-assessment`, Chapter 1 signup, `/circle`, `/live`, `/pulse` (unlisted), `/admin/login`, Account password change, Admin → Page SEO.

### Weekly Money Pulse after deploy

Configure Kit form confirmation / automation emails for the Weekly Pulse Business and Personal forms to send:

`https://www.longmoneyconcepts.com/pulse`

Library and Live already link to the Kit forms; `/pulse` itself is unlisted (`noindex`).

---

## Netlify (alternate / future)

Configured in [`netlify.toml`](../netlify.toml):

- Build `@workspace/abundance-blueprint`, publish `artifacts/abundance-blueprint/dist/public`
- SPA fallback `/* → index.html`
- Proxies for `/api/kit/subscribe` and `/api/readiness-lead` to `netlify/functions/`

Set the same env vars in Netlify site settings. Security headers for production preview live in `artifacts/abundance-blueprint/vite.config.ts` (not in `netlify.toml`).

Custom domain (e.g. Squarespace DNS): point `@` A record and `www` CNAME per Netlify’s domain settings.

---

## Secrets hygiene

Secrets must not live in the repo or agent chat. Prefer Infisical (`https://secrets.thatdeveloper.dev`) or the host’s secret store. Use `.env.example` files for key **names** only; never commit filled `.env` files.
