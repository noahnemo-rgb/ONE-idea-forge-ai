# P011 — tidy before a Vercel preview

**Repo:** https://github.com/noahnemo-rgb/ONE-idea-forge-ai  
**Head seen:** `ea09cf8` G003 Niche Scout robe copy  
**This slice:** preview hygiene only. No guest invite. No Stripe live keys. No IDAO.

## What this app actually is

Not a static brochure. It is React Router 7 (Vite) with a **Node + Hono** server (`server/index.ts`) that:

- opens a Neon pool from `DATABASE_URL` at boot
- uses `argon2` (native)
- keeps a Stripe webhook scaffold
- still carries Expo/`patches/` residue from the Anything export

`package.json` on `main` only had `dev` and `typecheck`. Vercel has nothing to build.

## What “tidy” means in this slice

1. Name the product in `package.json` (`idea-forge`, not `web`).
2. Add `build` / `start` scripts React Router expects.
3. Add `vercel.json` + `.vercelignore` so the first import does not upload `patches/` and Expo junk as the app.
4. Add `.env.example` so preview env is visible and empty of secrets.
5. Leave `client-integrations/` and `patches/` on disk (P003–P010 choice). Ignore them on Vercel upload.

## What the first preview can show

Safe to look at if the build completes:

- `/` home
- `/trust` `/privacy` `/terms` (stamp pages; P010 made them survive a missing session)

Likely to 500 or no-op until env exists:

- `/api/*` generate, research, ideas
- sign-in / account
- Stripe checkout

That is acceptable for a **preview**. It is not a launch.

## Vercel import (HITL)

1. vercel.com → Add New → Project → `noahnemo-rgb/ONE-idea-forge-ai`
2. Framework preset: Other (do not pick Next.js)
3. Build command: `npm run build`
4. Output: leave default unless the build log names `build/client`
5. Env for preview (optional, no secrets in git):
   - `DATABASE_URL` — omit on first try; expect API 500s
   - do **not** paste live Stripe keys into Preview
6. Root directory: repository root

If build fails on `argon2` / native compile, stop and bring the log here. Do not `--force` a mobile lockfile.

## Local check before you import

On AX-18, after this slice is committed:

```bash
cd ~/ONE-idea-forge-ai   # or wherever you clone it
npm install
npm run build
```

If `build` dies, Vercel will die the same way. Fix local first.
