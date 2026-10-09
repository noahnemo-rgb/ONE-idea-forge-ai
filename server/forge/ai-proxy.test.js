import assert from "node:assert/strict";
import test from "node:test";
import {
  allowedOrigins,
  handleAiBufferRequest,
  ownerKeyForRequest,
  ownerStatus,
} from "./ai-proxy.js";

const OWNER = "sk-owner-test-key-1234567890abcd";
const CLIENT = "sk-client-should-not-be-used-9999";
const GEMINI = "AIzaSyTESTKEY1234567890abcd";

function sse(text) {
  return new Response(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\ndata: [DONE]\n`, {
    status: 200,
    headers: { "content-type": "text/event-stream" },
  });
}

function headerValue(headers, name) {
  if (!headers) return "";
  if (typeof headers.get === "function") return headers.get(name) || headers.get(name.toLowerCase()) || "";
  const found = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  return found ? String(found[1]) : "";
}

function post(origin, body, url = "https://idea-forge.ai/api/ai-proxy") {
  return new Request(url, {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

test("production origins are exact and local dev origins stay off Vercel", () => {
  const production = allowedOrigins({ VERCEL: "1", APP_ORIGIN: "https://idea-forge.ai" });
  assert.ok(production.includes("https://idea-forge.ai"));
  assert.equal(production.includes("http://localhost:4000"), false);
  const local = allowedOrigins({ APP_ORIGIN: "https://idea-forge.ai" });
  assert.ok(local.includes("http://localhost:4000"));
  assert.ok(local.includes("http://127.0.0.1:4000"));
});

test("a browser key does not unlock chat or generate", () => {
  const denied = ownerKeyForRequest({ apiKey: CLIENT, prompt: "seed" }, {});
  assert.equal(denied.ok, false);
  assert.equal(denied.code, "missing_key");
  assert.equal(JSON.stringify(denied).includes(CLIENT), false);

  const foreign = ownerKeyForRequest({ provider: "puter", apiKey: CLIENT }, { OPENROUTER_API_KEY: OWNER });
  assert.equal(foreign.ok, false);
  assert.equal(foreign.error, "Provider is not allowed.");

  const model = ownerKeyForRequest(
    { provider: "gemini", model: "not-on-the-list", apiKey: CLIENT },
    { GEMINI_API_KEY: GEMINI },
  );
  assert.equal(model.ok, false);
  assert.equal(model.error, "Model is not allowed.");

  const allowed = ownerKeyForRequest(
    { provider: "vercel-gateway", model: "openai/gpt-4o-mini", apiKey: CLIENT },
    { AI_GATEWAY_API_KEY: OWNER },
  );
  assert.equal(allowed.ok, true);
  assert.equal(allowed.provider, "vercel-gateway");
  assert.equal(allowed.apiKey, undefined);
});

test("status returns a masked hint and not the owner key", () => {
  const status = ownerStatus({
    OPENROUTER_API_KEY: OWNER,
    GEMINI_API_KEY: GEMINI,
    NVIDIA_API_KEY: "nvapi-test-key-1234567890wxyz",
    LLM_API_KEY: "llm-test-key-1234567890mnop",
    AI_GATEWAY_API_KEY: "gw-test-key-1234567890qrst",
  });
  const raw = JSON.stringify(status);
  assert.equal(raw.includes(OWNER), false);
  assert.equal(raw.includes(GEMINI), false);
  assert.equal(raw.includes("nvapi-test-key-1234567890wxyz"), false);
  assert.equal(status.openrouterKey, true);
  assert.equal(status.gatewayKey, true);
  assert.equal(status.geminiKey, true);
  assert.equal(status.nvidiaKey, true);
  assert.equal(status.llmapiKey, true);
  assert.equal(status.keyHints.openrouter, "••••abcd");
  assert.equal(status.keyHints["space-bunny"], "••••abcd");
  assert.equal(status.keyHints.gemini, "••••abcd");
  assert.equal(status.keyHints.nvidia, "••••wxyz");
  assert.equal(status.keyHints.llmapi, "••••mnop");
  assert.equal(status.keyHints["vercel-gateway"], "••••qrst");
});

test("the proxy checks origin, rejects byok, and keeps the key out of the response", async () => {
  const seen = [];
  const env = { VERCEL: "1", OPENROUTER_API_KEY: OWNER, GEMINI_API_KEY: GEMINI };
  const fetchImpl = async (url, init) => {
    seen.push({ url: String(url), init });
    return sse("assay");
  };
  const extras = { fetchImpl, rateLimit: () => true };

  const missingOrigin = await handleAiBufferRequest(
    new Request("https://idea-forge.ai/api/ai-proxy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ provider: "openrouter", model: "openai/gpt-4o-mini", message: "Hi" }),
    }),
    env,
    extras,
  );
  assert.equal(missingOrigin.status, 403);

  const foreign = await handleAiBufferRequest(
    post("https://evil.example", { provider: "openrouter", model: "openai/gpt-4o-mini", message: "Hi" }),
    env,
    extras,
  );
  assert.equal(foreign.status, 403);
  assert.equal(seen.length, 0);

  const puter = await handleAiBufferRequest(
    post("https://idea-forge.ai", { provider: "puter", model: "openai/gpt-4o-mini", message: "Hi" }),
    env,
    extras,
  );
  assert.equal(puter.status, 400);
  assert.equal(seen.length, 0);

  const model = await handleAiBufferRequest(
    post("https://idea-forge.ai", { provider: "openrouter", model: "secret-model", message: "Hi" }),
    env,
    extras,
  );
  assert.equal(model.status, 400);

  const byok = await handleAiBufferRequest(
    post("https://idea-forge.ai", {
      provider: "openrouter",
      model: "openai/gpt-4o-mini",
      message: "Hi",
      byok: CLIENT,
    }),
    env,
    extras,
  );
  const byokText = await byok.text();
  assert.equal(byok.status, 200);
  assert.match(byokText, /assay/);
  assert.equal(byokText.includes(OWNER), false);
  assert.equal(byokText.includes(CLIENT), false);
  assert.match(headerValue(seen[0].init.headers, "authorization"), new RegExp(`Bearer ${OWNER}`));
  assert.equal(headerValue(seen[0].init.headers, "authorization").includes(CLIENT), false);

  seen.length = 0;
  const gemini = await handleAiBufferRequest(
    post("https://idea-forge.ai", { provider: "gemini", model: "gemini-3.8-flash", message: "Hi" }),
    env,
    extras,
  );
  assert.equal(gemini.status, 200);
  const geminiText = await gemini.text();
  assert.equal(geminiText.includes(GEMINI), false);
  assert.match(String(seen[0].url), /generativelanguage\.googleapis\.com/);
  assert.equal(String(seen[0].url).includes(GEMINI), false);
  assert.equal(headerValue(seen[0].init.headers, "x-goog-api-key"), GEMINI);
});

test("status requires the page origin and does not echo the key", async () => {
  const env = { VERCEL: "1", NVIDIA_API_KEY: "nvapi-test-key-1234567890wxyz" };
  const denied = await handleAiBufferRequest(new Request("https://idea-forge.ai/api/ai-buffer/status"), env);
  assert.equal(denied.status, 403);
  const allowed = await handleAiBufferRequest(
    new Request("https://idea-forge.ai/api/ai-buffer/status", { headers: { origin: "https://idea-forge.ai" } }),
    env,
  );
  const body = await allowed.text();
  assert.equal(allowed.status, 200);
  assert.equal(body.includes("nvapi-test-key-1234567890wxyz"), false);
  assert.match(body, /••••wxyz/);
});

test("the proxy rate limit rejects a second call", async () => {
  const { createMemoryRateLimit } = await import("ai-buffer");
  const env = { VERCEL: "1", OPENROUTER_API_KEY: OWNER };
  const extras = {
    rateLimit: createMemoryRateLimit({ limit: 1, windowMs: 60_000 }),
    fetchImpl: async () => sse("once"),
  };
  const first = await handleAiBufferRequest(
    post("https://idea-forge.ai", { provider: "openrouter", model: "openai/gpt-4o-mini", message: "Hi" }),
    env,
    extras,
  );
  assert.equal(first.status, 200);
  const second = await handleAiBufferRequest(
    post("https://idea-forge.ai", { provider: "openrouter", model: "openai/gpt-4o-mini", message: "Hi" }),
    env,
    extras,
  );
  assert.equal(second.status, 429);
});
