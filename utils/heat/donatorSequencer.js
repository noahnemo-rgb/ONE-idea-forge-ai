import { PARTNER_DAILY_SIP_CAP } from "./flags.js";

export function utcDay(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function emptyState(day) {
  return { day, sips: {}, exhausted: {} };
}

export function rollState(state, day) {
  if (!state || state.day !== day) return emptyState(day);
  return state;
}

function capOf(cap) {
  return cap == null ? PARTNER_DAILY_SIP_CAP : cap;
}

function usable(state, coat, cap) {
  if (!coat?.id) return false;
  if (state.exhausted?.[coat.id] === true) return false;
  return (state.sips?.[coat.id] || 0) < cap;
}

export function planAttempt(state, coats, cap) {
  const limit = capOf(cap);
  const current = state?.sips && state?.exhausted ? state : emptyState(state?.day);
  for (const coat of coats || []) {
    if (usable(current, coat, limit)) return { ok: true, slot: coat };
  }
  return { ok: false, stub: "gift-spent" };
}

export function applyResult(state, slotId, result) {
  const next = {
    day: state?.day,
    sips: { ...(state?.sips || {}) },
    exhausted: { ...(state?.exhausted || {}) },
  };
  if (result === "sip") {
    next.sips[slotId] = (next.sips[slotId] || 0) + 1;
    if (next.sips[slotId] >= PARTNER_DAILY_SIP_CAP) next.exhausted[slotId] = true;
  } else if (result === "exhaust") {
    next.exhausted[slotId] = true;
  }
  return next;
}
