import assert from "node:assert/strict";
import test from "node:test";
import example from "./coats.example.json" with { type: "json" };
import {
  applyResult,
  emptyState,
  planAttempt,
  rollState,
} from "./donatorSequencer.js";

const coats = example.order.map(({ id, label }) => ({ id, label }));
const day = "2026-09-24";

test("no coats → gift-spent", () => {
  assert.deepEqual(planAttempt(emptyState(day), []), {
    ok: false,
    stub: "gift-spent",
  });
});

test("first coat free → OPENROUTER_DONOR_01", () => {
  const plan = planAttempt(emptyState(day), coats);
  assert.equal(plan.ok, true);
  assert.equal(plan.slot.id, "OPENROUTER_DONOR_01");
});

test("coat-01 at cap 3 → OPENROUTER_DONOR_02", () => {
  const state = emptyState(day);
  state.sips.OPENROUTER_DONOR_01 = 3;
  const plan = planAttempt(state, coats, 3);
  assert.equal(plan.ok, true);
  assert.equal(plan.slot.id, "OPENROUTER_DONOR_02");
});

test("all ten at cap → gift-spent", () => {
  const state = emptyState(day);
  for (const coat of coats) state.sips[coat.id] = 3;
  assert.deepEqual(planAttempt(state, coats), {
    ok: false,
    stub: "gift-spent",
  });
});

test("exhaust 01 then planAttempt → 02", () => {
  const spent = applyResult(emptyState(day), "OPENROUTER_DONOR_01", "exhaust");
  const plan = planAttempt(spent, coats);
  assert.equal(plan.ok, true);
  assert.equal(plan.slot.id, "OPENROUTER_DONOR_02");
});

test("applyResult does not mutate the input", () => {
  const input = emptyState(day);
  const snapshot = structuredClone(input);
  const next = applyResult(input, "OPENROUTER_DONOR_01", "sip");
  assert.deepEqual(input, snapshot);
  assert.notEqual(next, input);
  assert.equal(next.sips.OPENROUTER_DONOR_01, 1);
});

test("rollState on a new utc day clears sips and exhausted", () => {
  const prior = {
    day: "2026-09-23",
    sips: { OPENROUTER_DONOR_01: 2 },
    exhausted: { OPENROUTER_DONOR_01: true },
  };
  assert.deepEqual(rollState(prior, "2026-09-24"), emptyState("2026-09-24"));
});
