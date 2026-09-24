import http from "node:http";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { coatsFromEnv, parseEnvFile } from "../utils/heat/loadCoats.js";
import { applyResult, planAttempt, utcDay } from "../utils/heat/donatorSequencer.js";
import { loadState, saveState } from "../utils/heat/stateStore.js";
import { sipOpenRouter } from "../utils/heat/sipOpenRouter.js";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

try {
  const parsed = parseEnvFile(readFileSync(join(root, ".env"), "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] == null || process.env[key] === "") process.env[key] = value;
  }
} catch {
  // no .env
}

const ALLOW = new Set([
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
]);

function cors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOW.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

function send(res, status, body) {
  const raw = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(raw);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  const path = new URL(req.url || "/", "http://127.0.0.1:8787").pathname;
  if (req.method === "GET" && path === "/health") {
    send(res, 200, {
      ok: true,
      host: "127.0.0.1",
      coats: coatsFromEnv(process.env).length,
      visitorPuter: false,
    });
    return;
  }
  if (req.method === "POST" && path === "/forge") {
    const day = utcDay();
    let body = {};
    try {
      body = await readBody(req);
    } catch {
      send(res, 400, { ok: false, stub: "gift-spent" });
      return;
    }
    const state = loadState(day);
    const plan = planAttempt(state, coatsFromEnv(process.env));
    if (!plan.ok) {
      console.log(day, "gift-spent");
      send(res, 200, { ok: false, stub: "gift-spent" });
      return;
    }
    const apiKey = process.env[plan.slot.id];
    try {
      const idea = await sipOpenRouter({
        apiKey,
        prompt: body.prompt,
        mode: body.mode,
      });
      saveState(applyResult(state, plan.slot.id, "sip"));
      console.log(day, plan.slot.id, "sip");
      send(res, 200, { ok: true, idea, slot: plan.slot.id });
    } catch (err) {
      if (err?.exhaust) {
        saveState(applyResult(state, plan.slot.id, "exhaust"));
        console.log(day, plan.slot.id, "exhaust");
      } else {
        console.log(day, plan.slot.id, "gift-spent");
      }
      send(res, 200, { ok: false, stub: "gift-spent" });
    }
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(8787, "127.0.0.1");
