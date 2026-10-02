# ONE-idea-forge-ai
An innovative ideation generator for business development with AIs prompting AIs for curent market researched blue ocean businesses within a wide variety of niches.

## Trust stamp

This product received ONE-trust-colophon on 2026-09-15. Law-as-files: https://github.com/noahnemo-rgb/HASEOS-IDAO (first formal draft, unratified). The guest roster is not submoduled.

`legal/` is the stamp copy. Existing `terms/` and `privacy/` remain until HITL merges with counsel.

Footer and /trust wired in P002. Living Seal still later HITL.

P003 stripped Anything preview hooks. Stripe webhook scaffold kept. Stamp kept.

## Accounts, community, chat, and Stripe

One Vercel function, `api/[...path].js`, serves the backend. Set `DATABASE_URL` to a Neon Postgres URL. The first request creates the account, idea, share, comment, vote, and chat tables.

Email and password live at `/api/account/signup` and `/api/account/signin`. The session cookie is `idea_forge_session`. It does not need `AUTH_SECRET`.

Free accounts start with 3 assays a day. Pro skips that counter. Checkout is `/api/stripe/checkout` once `STRIPE_SECRET_KEY` is set. Point Stripe's webhook at `/api/stripe/webhook` with `STRIPE_WEBHOOK_SECRET`.

`/community` lists public ideas. Signed-in partners can publish, vote, and comment. `/chat` tries browser Puter, then an OpenRouter key saved only in that browser, then `OPENROUTER_API_KEY` on the server. Model calls go through [ai-buffer](https://github.com/noahnemo-rgb/ai-buffer-template). The host key is optional. Puter and a visitor's own key stay the default heat.

`npm test` covers the account, credit, community, chat, and Stripe-off paths without calling a model or a database.
