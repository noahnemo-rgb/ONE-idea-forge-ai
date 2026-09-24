# Donator sequencer — Partner Gift cashier

Status: draft law-as-files for Idea Forge heat. Not a HASEOS-IDAO amendment.
Edition: P013 · 2026-09-24
Method: A (collar). Shop UI stays B.
Halt still on: visitor Puter sign-in, steward puter.init(authToken) in the browser, silent Church-paid hop.

Idea Forge may wear ONE and HASEOS seals. Seals assert guest heat is sheathed and compute is not a surprise bill.

The donator sequencer is the cashier. It is not a person. A coat (API key / later Puter session) is plumbing.

Scope of P013: named slots, daily sip cap in OUR code, try next coat with room then STOP, stub when empty, Vercel Hobby stays stamp-only (api/ ignored), one product one key set.

Out of scope: live vendor calls, publishing the ten names, un-ignoring api/, visitor-pays Puter, treating Puter as the shop's self.

Planes:

- A Partner strike: named Partner uses own coat on own machine. Allowed later local.
- B Gift sip: stranger spark drinks next Partner coat that still has room, under cap. Law now; runtime later.
- Visitor Puter: FORGE_VISITOR_PUTER=0. Halted.
- Steward token in browser: halted.

Sequence (keep this short):

1. Read ordered coat list (OpenRouter first).
2. Skip coats exhausted for this UTC day or already at PARTNER_DAILY_SIP_CAP.
3. Attempt one coat.
4. On 401/402/429/hard fail: mark that coat exhausted for the day, go to the next coat once. Do not recurse the whole list inside one click.
5. If the list is dry: return { ok: false, stub: "gift-spent" }. Do not charge a hidden eleventh key, Noah's card, or the Church purse.

Caps (HITL may retune): 10 slots OPENROUTER_DONOR_01..10; PARTNER_DAILY_SIP_CAP default 3; one Generate click = one sip in P013; no fan-out; no auto top-up.

Sheath copy when stub: Guest intelligence here is a named helper on a dated window. Partner Gift heat is spent for today. The shop is still the shop. Bring your own coat, or return tomorrow.
Do not say "the AI is down." Do not say "we switched to the house account."

Promotion: local may test. Public paid generate path is HITL only.
