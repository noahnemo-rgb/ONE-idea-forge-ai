import { AiBufferError } from "ai-buffer";
import { createKeyedRouter } from "./forgeRouter.js";

const SYSTEM =
  'You help a human partner assay one idea. Return ONLY JSON: {"title":"","description":"","target_audience":"","key_features":[""],"scores":{"novelty":0,"feasibility":0,"market":0}} Scores 0-10. Concrete. Do not treat the human as a meter or the model as a tool.';

function exhaust(status) {
  throw Object.assign(new Error("exhaust"), { exhaust: true, status });
}

function parseIdea(text, prompt, mode, source) {
  const raw = String(text || "");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  let data = {};
  if (start >= 0 && end > start) {
    try {
      data = JSON.parse(raw.slice(start, end + 1));
    } catch {
      data = {};
    }
  }
  return {
    id: source === "space-bunny" ? "space-bunny-assay" : "openrouter-donor-assay",
    title: data.title || "Assay",
    description: data.description || raw.slice(0, 800) || prompt,
    target_audience: data.target_audience || "Not specified",
    key_features: Array.isArray(data.key_features)
      ? data.key_features.slice(0, 6)
      : [source === "space-bunny" ? "Named helper: Space Bunny Alpha" : "Named helper: OpenRouter donor coat"],
    scores: data.scores || { novelty: 0, feasibility: 0, market: 0 },
    model_source: source,
    creative_mode: mode || "balanced",
  };
}

const FAILOVER = new Set(["missing_key", "signed_out", "rate_limited", "payment_required", "provider_error"]);

export async function sipOpenRouter({ apiKey, prompt, mode }) {
  const router = createKeyedRouter({
    apiKey,
    model: "openai/gpt-4o-mini",
    siteUrl: "https://one-idea-forge-ai.vercel.app",
  });
  const message = "Creative mode: " + (mode || "balanced") + ". Seed: " + prompt;
  try {
    let source = "space-bunny";
    let text;
    try {
      text = await router.streamChat({ route: "space-bunny", systemPrompt: SYSTEM, message });
    } catch (error) {
      if (!(error instanceof AiBufferError) || !FAILOVER.has(error.code)) throw error;
      source = "openrouter-donor";
      text = await router.streamChat({ route: "openrouter", systemPrompt: SYSTEM, message });
    }
    return parseIdea(text, prompt, mode, source);
  } catch (error) {
    if (error instanceof AiBufferError) {
      if (error.code === "payment_required") exhaust(402);
      if (error.code === "rate_limited") exhaust(429);
      if (error.code === "missing_key") exhaust(401);
    }
    const status = error?.status;
    if (status === 401 || status === 402 || status === 429 || status) exhaust(status);
    exhaust(500);
  }
}
