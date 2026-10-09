import { defaultModelFor } from "ai-buffer";

const FAILOVER = new Set(["missing_key", "signed_out", "rate_limited", "payment_required", "provider_error"]);

export function collectProxyText(raw) {
  let text = "";
  let error = null;
  for (const line of String(raw || "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const payload = trimmed.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;
    let json;
    try {
      json = JSON.parse(payload);
    } catch {
      continue;
    }
    if (json?.error) error = json.error;
    if (typeof json?.text === "string") text += json.text;
  }
  return { text, error };
}

function fail(code) {
  const quiet = code === "missing_key" || code === "signed_out";
  const error = new Error(quiet ? "Chat is not available yet." : "Chat failed.");
  error.code = code || "provider_error";
  return error;
}

export async function readProxyResponse(response) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw fail(data?.error?.code);
  }
  const raw = await response.text();
  const collected = collectProxyText(raw);
  if (collected.error) throw fail(collected.error.code);
  return collected.text;
}

export async function streamFromProxy({ provider, model, message, history, systemPrompt }) {
  const id = provider || "openrouter";
  const response = await fetch("/api/ai-proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      provider: id,
      model: model || defaultModelFor(id),
      message,
      history,
      systemPrompt,
    }),
  });
  return readProxyResponse(response);
}

export function canFailover(error) {
  return FAILOVER.has(error?.code);
}
