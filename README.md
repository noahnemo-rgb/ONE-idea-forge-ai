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

`/community` lists public ideas. Signed-in partners can publish, vote, and comment. Owner keys stay in the server environment so a person viewing the page cannot copy them out of the JavaScript. `/chat` still tries browser Puter first, because Puter sign-in is not an API key. Any other guest goes through `server/forge/ai-proxy.js`, which checks the page `Origin` and an allowlist of providers and models before it reads `OPENROUTER_API_KEY`, `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN`, `GEMINI_API_KEY`, `NVIDIA_API_KEY`, or `LLM_API_KEY`. The browser stores only the provider id and the model id (`ai-buffer.active_provider`, `ai-buffer.model.*`). `package.json` installs [ai-buffer](https://github.com/noahnemo-rgb/ai-buffer-template) from the public git tag `v0.4.0` (`git+https`, commit `b62ba5050643a7bf6e1e7da72b74f8bcbfc028a6`) so Vercel can install it without a private deploy key.

`npm test` covers the account, credit, community, chat, and Stripe-off paths without calling a model or a database.
