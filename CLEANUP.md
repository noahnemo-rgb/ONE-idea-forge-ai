# P003 cleanup

## Removed (Anything preview / parent-console)

- `__create/` at repo root (Hono host entry, create.xyz `/integrations` proxy, overlay, parent error HTML)
- `src/__create/` (`anything-menu*`, fetch wrapper, placeholder, polyfills)
- `accessibility/__create/` (host not-found, overlay, stripe/@auth shims)
- `api/__create/` (ssr-test)
- `plugins/console-to-parent.ts`, `plugins/addRenderIds.ts`
- Metro `__create` report-error / anything-menu / VIRTUAL_ROOT hooks
- Parent `postMessage` handshake, screenshot, sitemap, and status-bar color hooks from entries and polyfills

Product server pieces that lived under `__create/` were rehomed to `server/` (no create.xyz proxy). `@auth/create` shim rehomed to `src/auth/create.js`. Web 404 is `not-found.tsx`.

## Left on purpose

- Stamp: `brand/`, `legal/`, `STAMP.md`, `trust/`, `components/OneColophonFooter.jsx`, `.cursor/rules/one-voice.mdc`
- `terms/`, `privacy/`
- `api/stripe/webhook/` — product billing scaffold, not Anything menu
- `client-integrations/` — still look like host UI wrappers (re-export shims for shadcn/chakra/maps/pdf/markdown/recharts), not ideation product code. Imports still resolve; not deleted this slice.
- `patches/` — still look like Expo/RN/metro host `patch-package` files, not product routes. Imports still resolve; not deleted this slice.

P004: pinned `react-router-hono-server` to `2.21.0` (newest that still peers `@types/react` ^18) and replaced the Anything mobile `package-lock.json` so React 18 types stay coherent and `npm install` does not need `--force`.

P005 added .gitignore.
