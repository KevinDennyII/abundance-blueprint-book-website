# Abundance Blueprint — Book Website

A book website for La'Toya Ray, CPA's "Abundance Blueprint: A Journey to Financial Harmony" — a memoir-driven guide to healing the emotional story beneath financial behavior, building a practical foundation, and creating a life of financial harmony.

## Run & Operate

- `pnpm --filter @workspace/abundance-blueprint run dev` — run the book website (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, shadcn/ui
- Routing: wouter
- Animations: Framer Motion
- Fonts: Cormorant Garamond (serif headings) + DM Sans (body)
- API: Express 5 (api-server artifact, /api prefix)

## Where things live

- `artifacts/abundance-blueprint/` — the book website (React + Vite, served at `/`)
- `artifacts/api-server/` — Express API server (served at `/api`)
- `attached_assets/` — book cover images and author brief documents
- `artifacts/abundance-blueprint/public/` — static assets (favicon, etc.)

## Architecture decisions

- Blog posts, comments, and the admin account use Postgres via `@workspace/db` (Drizzle). Kit email signup still goes through `/api/kit/subscribe` (Replit: API Server artifact; Netlify: serverless function; local: api-server).
- Cover images are imported via the `@assets` alias (pointing to `attached_assets/`), not served from `public/`, because Vite handles bundling.
- All approved copy is used verbatim from the designer brief provided by the author.
- No dark mode — the brand palette (purple/gold/cream) is the single consistent theme.

## Product

- **Home** (`/`): Book hook, email list signup (primary CTA), author intro, HEALS™ framework teaser, scroll animations.
- **About** (`/about`): Full author bio, philosophy statement, HEALS™ framework (all 5 pillars), five core beliefs, credentials.
- **Book** (`/book`): Cover art, full description, formats/pricing, pre-order CTA, "In These Pages" list.
- **Circle** (`/circle`): The Long Money Circle community page with Kit signup form.
- **Work With Me** (`/work-with-me`): Contact and future services inquiry form.
- **Blog** (`/blog`): Published posts with moderated guest comments. Author publishes via `/admin` (email + password session).
- **Contact** (`/contact`): Redirects to `/work-with-me`.

## User preferences

- React (Josh Comeau's Joy of React guidance)
- CSS following Josh Comeau's CSS for JS Devs approach
- No Replit favicon — use the book cover as the favicon
- GitHub repo: https://github.com/KevinDennyII/abundance-blueprint-book-website
- Include a README.md in the artifact with tech stack and credits
- Email signup forms submit to Kit via `/api/kit/subscribe` (API Server on Replit, Netlify Function when migrated)
- Author photo is the AI placeholder from the back cover until professional photos are taken
- ISBN on the back cover is not the real one (not yet ordered)
- Timeline: live by late July/early August 2026 before September/October book launch

## Gotchas

- Google Fonts @import must be the FIRST line in index.css before @import "tailwindcss"
- All CSS variables in :root were initialized to "red" and must be replaced with the purple/gold/cream palette
- Cover images are accessed via `import img from "@assets/AB_Front_Cover_1779852599997.png"` not public URLs
- `artifacts/abundance-blueprint/.replit-artifact/artifact.toml` must define explicit `services.production.build` and `services.production.run` commands. Replit Publishing needs a valid run command for the website artifact; Kit signups still use the API Server artifact at `/api`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Brand colors: deep purple #2d1b4e, gold #c9a84c, cream #f5e6cc
- Brand fonts: Cormorant Garamond (serif), DM Sans (sans)
- HEALS™ is pronounced H·E·A·L·S — the healing double meaning is intentional
