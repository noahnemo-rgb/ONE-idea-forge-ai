import assert from "node:assert/strict";
import test from "node:test";
import { AiBufferError } from "ai-buffer";
import { createKeyedRouter } from "./forgeRouter.js";

function sse(text) {
  const body = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\ndata: [DONE]\n`;
  return new Response(body, { status: 200, headers: { "content-type": "text/event-stream" } });
}

test("a browser or server key tries Space Bunny Alpha, then the named OpenRouter model", async () => {
  const models = [];
  const router = createKeyedRouter({
    apiKey: "sk-test",
    model: "openai/gpt-4o-mini",
    siteUrl: "https://one-idea-forge-ai.vercel.app",
    timeoutMs: 1000,
    fetchImpl: async (_input, init) => {
      const payload = JSON.parse(String(init?.body));
      models.push(payload.model);
      if (models.length === 1) return new Response("slow down", { status: 429 });
      return sse("fallback");
    },
  });

  assert.equal(await router.streamChat({ message: "Sketch one idea" }), "fallback");
  assert.deepEqual(models, ["stealth/space-bunny-alpha", "openai/gpt-4o-mini"]);
  assert.equal(router.route("space-bunny").id, "space-bunny");
  assert.throws(
    () => router.route("puter"),
    (error) => error instanceof AiBufferError && error.code === "provider_error",
  );
});
