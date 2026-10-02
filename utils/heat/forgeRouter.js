import { createCallRouter } from "ai-buffer";

/**
 * Same OpenRouter key, two routes. Space Bunny Alpha is first.
 * Puter stays outside this router so the browser can try it before any key.
 */
export function createKeyedRouter({
  apiKey,
  model,
  siteUrl,
  appName = "Idea Forge",
  timeoutMs,
  fetchImpl,
}) {
  const shared = {
    getApiKey: () => apiKey,
    appName,
    siteUrl,
    timeoutMs,
    fetchImpl,
  };
  const namedModel = typeof model === "string" && model.trim() ? model.trim() : undefined;
  return createCallRouter({
    spaceBunny: shared,
    openrouter: namedModel ? { ...shared, model: namedModel } : shared,
    order: ["space-bunny", "openrouter"],
  });
}
