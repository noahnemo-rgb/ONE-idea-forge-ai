import assert from "node:assert/strict";
import test from "node:test";
import { handleForge } from "./handle.js";
import { createMemoryStore } from "./memory-store.js";
import { readCookie } from "./session.js";

function cookieFrom(result) {
  const header = result.headers?.["Set-Cookie"] || "";
  const pair = header.split(";")[0];
  return pair;
}

async function call(store, options) {
  return handleForge({
    store,
    env: {},
    secure: false,
    headers: {},
    body: {},
    query: {},
    ...options,
  });
}

test("signup, signin, and session cookie", async () => {
  const store = createMemoryStore();
  const created = await call(store, {
    method: "POST",
    path: ["account", "signup"],
    body: { email: "Ada@Example.com", password: "long-enough", name: "Ada" },
  });
  assert.equal(created.status, 200);
  assert.equal(created.json.user.email, "ada@example.com");
  assert.equal(created.json.user.name, "Ada");
  const cookie = cookieFrom(created);
  assert.ok(readCookie(cookie));

  const session = await call(store, {
    method: "GET",
    path: ["account", "session"],
    headers: { cookie },
  });
  assert.equal(session.json.user.id, created.json.user.id);

  const signedOut = await call(store, {
    method: "POST",
    path: ["account", "signout"],
    headers: { cookie },
  });
  assert.equal(signedOut.json.ok, true);
  const again = await call(store, {
    method: "GET",
    path: ["account", "session"],
    headers: { cookie },
  });
  assert.equal(again.json.user, null);

  const bad = await call(store, {
    method: "POST",
    path: ["account", "signin"],
    body: { email: "ada@example.com", password: "wrong-password" },
  });
  assert.equal(bad.status, 401);

  const good = await call(store, {
    method: "POST",
    path: ["account", "signin"],
    body: { email: "ada@example.com", password: "long-enough" },
  });
  assert.equal(good.status, 200);
});

test("duplicate email is rejected", async () => {
  const store = createMemoryStore();
  await call(store, {
    method: "POST",
    path: ["account", "signup"],
    body: { email: "ada@example.com", password: "long-enough" },
  });
  const again = await call(store, {
    method: "POST",
    path: ["account", "signup"],
    body: { email: "ada@example.com", password: "long-enough" },
  });
  assert.equal(again.status, 409);
});

test("saving spends the daily credit and the fourth save stops", async () => {
  const store = createMemoryStore();
  const created = await call(store, {
    method: "POST",
    path: ["account", "signup"],
    body: { email: "ada@example.com", password: "long-enough" },
  });
  const cookie = cookieFrom(created);
  for (let index = 0; index < 3; index += 1) {
    const saved = await call(store, {
      method: "POST",
      path: ["ideas"],
      headers: { cookie },
      body: { action: "save", title: `Idea ${index}`, prompt: "seed" },
    });
    assert.equal(saved.status, 200);
    assert.equal(saved.json.remainingCredits, 2 - index);
  }
  const blocked = await call(store, {
    method: "POST",
    path: ["ideas"],
    headers: { cookie },
    body: { action: "save", title: "One more" },
  });
  assert.equal(blocked.status, 403);
  assert.equal(blocked.json.limitReached, true);
});

test("publish shows the idea in the community and comments require a session", async () => {
  const store = createMemoryStore();
  const created = await call(store, {
    method: "POST",
    path: ["account", "signup"],
    body: { email: "ada@example.com", password: "long-enough", name: "Ada" },
  });
  const cookie = cookieFrom(created);
  const saved = await call(store, {
    method: "POST",
    path: ["ideas"],
    headers: { cookie },
    body: { action: "save", title: "Public bench", description: "A shared assay" },
  });
  const published = await call(store, {
    method: "POST",
    path: ["ideas"],
    headers: { cookie },
    body: { action: "publish", ideaId: saved.json.idea.id },
  });
  assert.equal(published.status, 200);
  const community = await call(store, { method: "GET", path: ["community"] });
  assert.equal(community.json.ideas.length, 1);
  assert.equal(community.json.ideas[0].title, "Public bench");

  const denied = await call(store, {
    method: "POST",
    path: ["ideas", "comments"],
    body: { ideaId: saved.json.idea.id, content: "hello" },
  });
  assert.equal(denied.status, 401);
  const allowed = await call(store, {
    method: "POST",
    path: ["ideas", "comments"],
    headers: { cookie },
    body: { ideaId: saved.json.idea.id, content: "hello" },
  });
  assert.equal(allowed.status, 200);
  const listed = await call(store, {
    method: "GET",
    path: ["ideas", "comments"],
    query: { ideaId: saved.json.idea.id },
  });
  assert.equal(listed.json.comments.length, 1);
});

test("stripe checkout stays off without a secret key", async () => {
  const store = createMemoryStore();
  const created = await call(store, {
    method: "POST",
    path: ["account", "signup"],
    body: { email: "ada@example.com", password: "long-enough" },
  });
  const status = await call(store, {
    method: "POST",
    path: ["stripe", "checkout"],
    headers: { cookie: cookieFrom(created) },
    env: {},
  });
  assert.equal(status.status, 503);
  assert.equal(status.json.code, "stripe_off");
});

test("chat reports a missing key and generate saves the assay", async () => {
  const store = createMemoryStore();
  const created = await call(store, {
    method: "POST",
    path: ["account", "signup"],
    body: { email: "ada@example.com", password: "long-enough" },
  });
  const cookie = cookieFrom(created);
  const missing = await call(store, {
    method: "POST",
    path: ["chat"],
    headers: { cookie },
    body: { message: "Hello" },
    env: {},
  });
  assert.equal(missing.status, 503);
  assert.equal(missing.json.code, "missing_key");

  const generated = await call(store, {
    method: "POST",
    path: ["generate"],
    headers: { cookie },
    body: { prompt: "a quieter inbox", apiKey: "test-key" },
    completeChat: async () => '{"title":"Quiet Inbox","description":"Less noise","target_audience":"Teams"}',
  });
  assert.equal(generated.status, 200);
  assert.equal(generated.json.ideas[0].title, "Quiet Inbox");
  const ideas = await call(store, { method: "GET", path: ["ideas"], headers: { cookie } });
  assert.equal(ideas.json.ideas[0].title, "Quiet Inbox");
});

test("a pasted Idealab seed is stored, and the blue-ocean room is Pro", async () => {
  const store = createMemoryStore();
  const created = await call(store, {
    method: "POST",
    path: ["account", "signup"],
    body: { email: "ada@example.com", password: "long-enough" },
  });
  const cookie = cookieFrom(created);
  const source = "https://idealab.ai/ideas/tool-library";
  const saved = await call(store, {
    method: "POST",
    path: ["ideas"],
    headers: { cookie },
    body: { action: "save", title: "Tool library", prompt: "neighborhood tools", source_url: source },
  });
  assert.equal(saved.status, 200);
  assert.equal(saved.json.idea.source_url, source);

  const blocked = await call(store, {
    method: "POST",
    path: ["research", "blue-ocean"],
    headers: { cookie },
    body: { prompt: "neighborhood tools", sourceUrl: source },
  });
  assert.equal(blocked.status, 403);
  assert.equal(blocked.json.code, "pro_required");

  await store.setStripeCustomer(created.json.user.id, "cus_ada");
  await store.setSubscriptionByCustomer("cus_ada", "pro");

  const quiet = await call(store, {
    method: "POST",
    path: ["research", "blue-ocean"],
    headers: { cookie },
    body: { prompt: "neighborhood tools", sourceUrl: source },
    env: {},
  });
  assert.equal(quiet.status, 503);
  assert.equal(quiet.json.code, "missing_key");
  assert.equal(quiet.json.guest, "Idea Forge Niche Scout");

  let seenMessage = "";
  const dive = await call(store, {
    method: "POST",
    path: ["research", "blue-ocean"],
    headers: { cookie },
    body: { prompt: "neighborhood tools", sourceUrl: source, apiKey: "test-key" },
    completeChat: async (input) => {
      seenMessage = input.message;
      return JSON.stringify({
        niches: [
          { name: "Evening repair", wedge: "After-work bench", why_open: "Shops close early", citations: [source] },
          { name: "Borrow desk", wedge: "Loan the tool", why_open: "Buying is the waste", citations: [] },
          { name: "Care notes", wedge: "One card per tool", why_open: "Settings get lost", citations: [] },
        ],
      });
    },
  });
  assert.equal(dive.status, 200);
  assert.equal(dive.json.guest, "Idea Forge Niche Scout");
  assert.equal(dive.json.catalog, "Idealab.ai");
  assert.equal(dive.json.niches.length, 3);
  assert.equal(dive.json.niches[0].citations[0], source);
  assert.match(seenMessage, /Do not fetch it/);
  assert.doesNotMatch(seenMessage, /fetch\(/);
});

test("trends work with the database disconnected", async () => {
  const result = await handleForge({ method: "GET", path: ["trends"], store: null });
  assert.equal(result.status, 200);
  assert.ok(result.json.trends.length > 0);
  const offline = await handleForge({ method: "GET", path: ["community"], store: null });
  assert.equal(offline.status, 503);
  assert.equal(offline.json.code, "database_off");
});
