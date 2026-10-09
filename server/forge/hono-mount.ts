import type { Hono } from "hono";
import { isAuthAction } from "../is-auth-action";
// @ts-expect-error Plain JavaScript module.
import { handleAiBufferRequest } from "./ai-proxy.js";
// @ts-expect-error Plain JavaScript module.
import { handleForge } from "./handle.js";
// @ts-expect-error Plain JavaScript module.
import { completeChat } from "./node-adapter.js";
// @ts-expect-error Plain JavaScript module.
import { openNeonStore } from "./neon-store.js";

export function attachForge(app: Hono): void {
  app.all("/api/*", async (c, next) => {
    const url = new URL(c.req.url);
    if (url.pathname === "/api/ai-proxy" || url.pathname === "/api/ai-buffer/status") {
      const method = c.req.method;
      const body = method === "GET" || method === "HEAD" ? undefined : await c.req.text();
      const request = new Request(c.req.url, {
        method,
        headers: new Headers(c.req.raw.headers),
        body,
      });
      return handleAiBufferRequest(request);
    }
    if (isAuthAction(c.req.path)) return next();
    const rawBody = c.req.method === "GET" || c.req.method === "HEAD" ? "" : await c.req.text();
    let body: Record<string, unknown> = {};
    if (rawBody && (c.req.header("content-type") || "").includes("application/json")) {
      try {
        body = JSON.parse(rawBody) as Record<string, unknown>;
      } catch {
        body = {};
      }
    }
    let result;
    try {
      const store = await openNeonStore();
      result = await handleForge({
        method: c.req.method,
        path: url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean),
        headers: {
          cookie: c.req.header("cookie") || "",
          "stripe-signature": c.req.header("stripe-signature") || "",
        },
        body,
        rawBody,
        query: Object.fromEntries(url.searchParams.entries()),
        store,
        secure: url.protocol === "https:" || process.env.VERCEL === "1",
        completeChat,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request failed";
      return c.json({ error: message }, 500);
    }
    const response = c.json(result.json ?? {}, result.status as 200);
    const setCookie = result.headers?.["Set-Cookie"];
    if (setCookie) response.headers.set("Set-Cookie", setCookie);
    return response;
  });
}
