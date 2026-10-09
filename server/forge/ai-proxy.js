import {
  SERVER_PROXY_PROVIDERS,
  createAiProxy,
  createMemoryRateLimit,
  createNodeAiProxy,
  defaultModelFor,
  looksLikeSecret,
  maskKeyHint,
  readOwnerApiKey,
} from "ai-buffer";
import { hashToken, readCookie } from "./session.js";

/**
 * Browser model calls land here so owner keys stay in the server environment.
 * The proxy checks Origin, then the provider and model allowlists, then reads the key.
 */

const MODEL_ENV = {
  openrouter: "OPENROUTER_MODEL",
  "vercel-gateway": "AI_GATEWAY_MODEL",
  gemini: "GEMINI_MODEL",
  nvidia: "NVIDIA_MODEL",
  llmapi: "LLMAPI_MODEL",
};

const MODEL_ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,200}$/;

const LOCAL_ORIGINS = [
  "http://localhost:4000",
  "http://127.0.0.1:4000",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const PRODUCT_ORIGINS = [
  "https://one-idea-forge-ai.vercel.app",
  "https://idea-forge.ai",
  "https://www.idea-forge.ai",
];

const MISSING_KEY = "API key is not configured on the server.";
const ORIGIN_DENIED = "Origin is not allowed.";
const PROVIDER_DENIED = "Provider is not allowed.";
const MODEL_DENIED = "Model is not allowed.";

let sharedRateLimit;

function rateLimit() {
  if (!sharedRateLimit) sharedRateLimit = createMemoryRateLimit({ limit: 30, windowMs: 60_000 });
  return sharedRateLimit;
}

function addOrigin(origins, value) {
  const trimmed = String(value || "").trim().replace(/\/$/, "");
  if (trimmed) origins.add(trimmed);
}

export function allowedOrigins(env = process.env) {
  const origins = new Set(PRODUCT_ORIGINS);
  addOrigin(origins, env.APP_ORIGIN);
  for (const item of String(env.CORS_ORIGINS || "").split(",")) addOrigin(origins, item);
  if (env.VERCEL_URL) addOrigin(origins, `https://${env.VERCEL_URL}`);
  if (env.VERCEL_BRANCH_URL) addOrigin(origins, `https://${env.VERCEL_BRANCH_URL}`);
  if (env.VERCEL_PROJECT_PRODUCTION_URL) addOrigin(origins, `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`);
  if (env.VERCEL !== "1") {
    for (const origin of LOCAL_ORIGINS) origins.add(origin);
  }
  return [...origins];
}

export function proxyModels(env = process.env) {
  const models = {};
  for (const id of SERVER_PROXY_PROVIDERS) {
    const base = defaultModelFor(id);
    const list = [base];
    const extra = String(env[MODEL_ENV[id]] || "").trim();
    if (extra && extra !== base && MODEL_ID.test(extra) && !looksLikeSecret(extra)) list.push(extra);
    models[id] = list;
  }
  return models;
}

export function modelAllowed(provider, model, env = process.env) {
  const list = proxyModels(env)[provider];
  if (!list) return null;
  if (provider === "space-bunny") return list[0];
  const chosen = String(model || "").trim() || list[0];
  return list.includes(chosen) ? chosen : null;
}

export function ideaForgeProxyOptions(env = process.env, extras = {}) {
  return {
    allowedOrigins: allowedOrigins(env),
    allowMissingOrigin: false,
    providers: SERVER_PROXY_PROVIDERS,
    models: proxyModels(env),
    rateLimit: extras.rateLimit ?? rateLimit(),
    allowByok: false,
    env,
    resolveUser(request) {
      const token = readCookie(request.headers.get("cookie") || "");
      return token ? hashToken(token) : null;
    },
    appName: "Idea Forge",
    siteUrl: env.APP_ORIGIN || "https://one-idea-forge-ai.vercel.app",
    fetchImpl: extras.fetchImpl,
  };
}

export function createIdeaForgeProxy(env = process.env, extras = {}) {
  return createAiProxy(ideaForgeProxyOptions(env, extras));
}

/**
 * Server routes (/api/chat, /api/generate) use the same allowlist and owner keys.
 * A key on the request body is ignored.
 */
export function ownerKeyForRequest(body, env = process.env) {
  const requested = typeof body?.provider === "string" ? body.provider.trim() : "";
  if (!requested) {
    if (!readOwnerApiKey("openrouter", env)) {
      return { ok: false, status: 503, code: "missing_key", error: MISSING_KEY };
    }
    return {
      ok: true,
      mode: "router",
      provider: "openrouter",
      model: modelAllowed("openrouter", env.OPENROUTER_MODEL, env),
    };
  }
  if (!SERVER_PROXY_PROVIDERS.includes(requested)) {
    return { ok: false, status: 400, code: "provider_error", error: PROVIDER_DENIED };
  }
  const model = modelAllowed(requested, body?.model, env);
  if (!model) return { ok: false, status: 400, code: "provider_error", error: MODEL_DENIED };
  if (!readOwnerApiKey(requested, env)) {
    return { ok: false, status: 503, code: "missing_key", error: MISSING_KEY };
  }
  return { ok: true, mode: "provider", provider: requested, model };
}

export function ownerStatus(env = process.env) {
  const keyHints = {};
  const remember = (id) => {
    const key = readOwnerApiKey(id, env);
    if (!key) return false;
    const hint = maskKeyHint(key);
    if (hint) keyHints[id] = hint;
    return true;
  };
  return {
    openrouterKey: remember("openrouter"),
    gatewayKey: remember("vercel-gateway"),
    geminiKey: remember("gemini"),
    nvidiaKey: remember("nvidia"),
    llmapiKey: remember("llmapi"),
    keyHints: {
      ...keyHints,
      ...(keyHints.openrouter ? { "space-bunny": keyHints.openrouter } : {}),
    },
  };
}

function originAllowed(request, env) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return allowedOrigins(env).includes(origin);
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function handleAiBufferRequest(request, env = process.env, extras = {}) {
  const url = new URL(request.url);
  if (request.method === "GET" && url.pathname.endsWith("/ai-buffer/status")) {
    if (!originAllowed(request, env)) {
      return jsonResponse(403, { error: { code: "provider_error", message: ORIGIN_DENIED } });
    }
    return jsonResponse(200, ownerStatus(env));
  }
  if (url.pathname.endsWith("/ai-proxy")) {
    return createIdeaForgeProxy(env, extras)(request);
  }
  return jsonResponse(404, { error: "Not found" });
}

export function requestPath(req) {
  const raw = req?.url || "/";
  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) return new URL(raw).pathname;
    return new URL(raw, "http://localhost").pathname;
  } catch {
    return "/";
  }
}

function headerRecord(req) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else {
      headers.set(key, String(value));
    }
  }
  return headers;
}

export async function handleAiBufferNode(req, res, env = process.env) {
  const pathName = requestPath(req);
  if (req.method === "GET" && pathName.endsWith("/ai-buffer/status")) {
    const host = req.headers?.host || "localhost";
    const request = new Request(`http://${host}${req.url || pathName}`, {
      method: "GET",
      headers: headerRecord(req),
    });
    const response = await handleAiBufferRequest(request, env);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      if (key === "transfer-encoding") return;
      res.setHeader(key, value);
    });
    res.end(Buffer.from(await response.arrayBuffer()));
    return;
  }
  if (pathName.endsWith("/ai-proxy")) {
    return createNodeAiProxy(ideaForgeProxyOptions(env))(req, res);
  }
  res.statusCode = 404;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ error: "Not found" }));
}
