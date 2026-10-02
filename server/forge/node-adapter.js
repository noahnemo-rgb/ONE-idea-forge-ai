import { handleForge } from "./handle.js";
import { openNeonStore } from "./neon-store.js";
import { AiBufferError } from "ai-buffer";
import { createKeyedRouter } from "../../utils/heat/forgeRouter.js";

async function readRaw(req) {
  if (typeof req.body === "string") return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
  if (!req || typeof req[Symbol.asyncIterator] !== "function") return "";
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

export async function completeChat({ apiKey, systemPrompt, message, history }) {
  const router = createKeyedRouter({
    apiKey,
    appName: "Idea Forge",
    siteUrl: process.env.APP_ORIGIN || "https://one-idea-forge-ai.vercel.app",
    model: process.env.OPENROUTER_MODEL,
    timeoutMs: 55_000,
  });
  try {
    return await router.streamChat({ message, systemPrompt, history });
  } catch (error) {
    if (error instanceof AiBufferError) {
      const wrapped = new Error(error.message);
      wrapped.code = error.code;
      throw wrapped;
    }
    throw error;
  }
}

function headerValue(headers, name) {
  const value = headers?.[name] ?? headers?.[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export async function forgeNodeHandler(req, res) {
  let rawBody = "";
  let body = {};
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    body = req.body;
    rawBody = JSON.stringify(req.body);
  } else {
    rawBody = await readRaw(req);
    const type = headerValue(req.headers, "content-type");
    if (rawBody && type.includes("application/json")) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = {};
      }
    }
  }
  const url = new URL(req.url || "/", "https://idea-forge.local");
  const queryPath = req.query?.path;
  const fromQuery = Array.isArray(queryPath)
    ? queryPath
    : typeof queryPath === "string" && queryPath
      ? [queryPath]
      : [];
  const path =
    fromQuery.length > 0
      ? fromQuery
      : url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  let result;
  try {
    const store = await openNeonStore();
    const secure = headerValue(req.headers, "x-forwarded-proto").includes("https") || process.env.VERCEL === "1";
    result = await handleForge({
      method: req.method,
      path,
      headers: {
        cookie: headerValue(req.headers, "cookie"),
        "stripe-signature": headerValue(req.headers, "stripe-signature"),
        "content-type": headerValue(req.headers, "content-type"),
      },
      body,
      rawBody,
      query: Object.fromEntries(url.searchParams.entries()),
      store,
      secure,
      completeChat,
    });
  } catch (error) {
    result = { status: 500, json: { error: error?.message || "Request failed" } };
  }
  res.statusCode = result.status;
  for (const [key, value] of Object.entries(result.headers || {})) {
    res.setHeader(key, value);
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result.json ?? {}));
}
