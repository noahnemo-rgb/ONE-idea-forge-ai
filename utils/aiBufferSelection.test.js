import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createMemoryStore, createProviderSelectionStore } from "ai-buffer";
import { scrubProviderSecrets } from "./aiBufferSelection.js";
import { collectProxyText } from "./aiProxyClient.js";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("scrub removes legacy browser keys and leaves the model id", () => {
  const storage = memoryStorage({
    ideaforge_openrouter_key: "sk-live-looking-key-1234567890",
    "ai-buffer.openrouter_key": "sk-live-looking-key-1234567890",
    "ai-buffer.gateway_key": "gw-test-key-1234567890qrst",
    "ai-buffer.model.openrouter": "sk-live-looking-key-1234567890",
    "ai-buffer.model.gemini": "gemini-3.8-flash",
    "ai-buffer.active_provider": "gemini",
    ideaforge_free_strikes: "2",
  });
  scrubProviderSecrets(storage);
  assert.equal(storage.getItem("ideaforge_openrouter_key"), null);
  assert.equal(storage.getItem("ai-buffer.openrouter_key"), null);
  assert.equal(storage.getItem("ai-buffer.gateway_key"), null);
  assert.equal(storage.getItem("ai-buffer.model.openrouter"), null);
  assert.equal(storage.getItem("ai-buffer.model.gemini"), "gemini-3.8-flash");
  assert.equal(storage.getItem("ai-buffer.active_provider"), "gemini");
  assert.equal(storage.getItem("ideaforge_free_strikes"), "2");
});

test("the selection store rejects a key pasted into the model field", async () => {
  const selection = createProviderSelectionStore(createMemoryStore());
  await assert.rejects(() => selection.setModel("nvidia", "nvapi-test-key-1234567890wxyz"));
  assert.equal(await selection.getModel("nvidia"), "nvidia/nemotron-3-nano-30b-a3b");
});

test("client pages do not write provider keys into web storage", () => {
  const files = [
    "chat/page.jsx",
    "settings/page.jsx",
    "utils/AiBufferDashboard.jsx",
    "utils/useAiBufferDashboard.js",
    "utils/aiBufferSelection.js",
    "utils/aiProxyClient.js",
    "hooks/useResultsData.js",
  ];
  for (const file of files) {
    const text = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    assert.equal(text.includes("localStorage.setItem"), false, file);
    assert.equal(text.includes("sessionStorage.setItem"), false, file);
    assert.equal(text.includes("ideaforge_openrouter_key"), file === "utils/aiBufferSelection.js");
  }
});

test("proxy text collection keeps chunks and drops a redacted error", () => {
  const collected = collectProxyText(
    'data: {"text":"Hello"}\n\ndata: {"text":" there"}\n\ndata: {"error":{"code":"provider_error","message":"[redacted]"}}\n\n',
  );
  assert.equal(collected.text, "Hello there");
  assert.equal(collected.error.code, "provider_error");
});
