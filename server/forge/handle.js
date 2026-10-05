import { hashPassword, verifyPassword } from "./password.js";
import {
  clearSessionCookie,
  hashToken,
  newSessionToken,
  readCookie,
  sessionCookie,
  sessionExpiry,
} from "./session.js";

const TRENDS = [
  { id: 1, topic: "AI-Powered Micro-SaaS", category: "Tech", source: "Market Trends" },
  { id: 2, topic: "Sustainable E-commerce", category: "Retail", source: "Consumer Reports" },
  { id: 3, topic: "Remote Team Wellness", category: "HR", source: "Workplace Trends" },
  { id: 4, topic: "Personalized Learning Paths", category: "EdTech", source: "Education Trends" },
  { id: 5, topic: "Hyper-local Delivery Networks", category: "Logistics", source: "Urban Trends" },
];

const ASSAY_PROMPT =
  "You help a human partner assay one idea. Return ONLY JSON with title, description, target_audience, problem_solved, unique_value_prop, key_features, monetization_strategies, technical_feasibility, market_validation_hints, and scores for market_size, build_difficulty, and monetization_potential from 1 to 10. Be concrete. Do not treat the human as a meter or the model as a tool.";

const CHAT_PROMPT =
  "You are the Idea Forge assistant. Help the partner think through one business idea. Be concrete and short. When you suggest a next step, say whether the human or a named helper does it.";

function json(status, body, headers = {}) {
  return { status, headers, json: body };
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image ?? null,
    subscription_status: user.subscription_status,
    credits: user.credits,
    last_credit_reset: user.last_credit_reset,
    has_asked_migration: user.has_asked_migration,
    stripe_customer_id: user.stripe_customer_id,
  };
}

function parseIdeaText(text, prompt, mode) {
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
    prompt,
    title: data.title || "Assay",
    description: data.description || raw.slice(0, 800) || prompt,
    target_audience: data.target_audience || "Not specified",
    problem_solved: data.problem_solved || null,
    unique_value_prop: data.unique_value_prop || null,
    key_features: Array.isArray(data.key_features) ? data.key_features : [],
    monetization_strategies: Array.isArray(data.monetization_strategies) ? data.monetization_strategies : [],
    technical_feasibility: data.technical_feasibility || null,
    market_validation_hints: data.market_validation_hints || null,
    scores: data.scores || {},
    model_source: "ai-buffer",
    creative_mode: mode || "balanced",
  };
}

async function userFromCookie(store, cookieHeader) {
  const token = readCookie(cookieHeader);
  if (!token) return { token: null, user: null };
  const user = await store.userForToken(hashToken(token));
  return { token, user };
}

/**
 * One backend for accounts, saved ideas, community, chat, and Stripe.
 * `completeChat` is ai-buffer's streamChat, injected so tests stay offline.
 */
export async function handleForge(request) {
  const {
    method,
    path,
    headers = {},
    body = {},
    store,
    env = process.env,
    completeChat,
    secure = false,
  } = request;
  const route = `/${path.filter(Boolean).join("/")}`;

  if (!store && route !== "/trends") {
    return json(503, {
      error: "Database is not connected. Set DATABASE_URL to a Neon Postgres connection string.",
      code: "database_off",
    });
  }
  if (store) await store.ready();

  const session = store ? await userFromCookie(store, headers.cookie) : { token: null, user: null };

  if (method === "GET" && route === "/trends") {
    return json(200, { trends: TRENDS });
  }

  if (method === "POST" && route === "/account/signup") {
    const email = String(body.email || "");
    const password = String(body.password || "");
    if (!email.includes("@") || password.length < 8) {
      return json(400, { error: "Use a real email and a password of at least 8 characters." });
    }
    const created = await store.createUser({
      email,
      name: body.name,
      passwordHash: await hashPassword(password),
    });
    if (!created) return json(409, { error: "Could not create account. Email might already be in use." });
    return await startSession(store, created, secure);
  }

  if (method === "POST" && route === "/account/signin") {
    const user = await store.findUserByEmail(String(body.email || ""));
    const valid = user && (await verifyPassword(String(body.password || ""), user.password_hash));
    if (!valid) return json(401, { error: "Invalid email or password. Please try again." });
    return await startSession(store, user, secure);
  }

  if (method === "POST" && route === "/account/signout") {
    if (session.token) await store.deleteSession(hashToken(session.token));
    return json(200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
  }

  if (method === "GET" && (route === "/account/session" || route === "/auth/session")) {
    return json(200, { user: publicUser(session.user), expires: session.user ? sessionExpiry() : null });
  }

  if (method === "POST" && route === "/auth/welcome") {
    return json(200, { ok: true });
  }

  if (route === "/auth/migrate") {
    if (!session.user) return json(401, { error: "Unauthorized" });
    if (method === "GET") return json(200, { exists: false, count: 0 });
    await store.markMigrationAsked(session.user.id);
    return json(200, { success: true, migratedCount: 0 });
  }

  if (method === "GET" && route === "/user/profile") {
    if (!session.user) return json(200, { user: null });
    const user = await store.refreshCredits(session.user);
    return json(200, { user: publicUser(user) });
  }

  if (method === "GET" && route === "/ideas") {
    if (!session.user) return json(200, { ideas: [], collections: [] });
    let ideas = await store.listIdeasForUser(session.user);
    if (request.query?.favorites === "true") ideas = ideas.filter((idea) => idea.is_favorite);
    if (request.query?.shared === "true") ideas = ideas.filter((idea) => idea.is_shared);
    return json(200, { ideas, collections: [] });
  }

  if (method === "GET" && route === "/community") {
    return json(200, { ideas: await store.listPublicIdeas() });
  }

  if (method === "POST" && route === "/ideas") {
    if (!session.user) return json(401, { error: "Unauthorized" });
    if (body.action === "vote") {
      const voted = await store.toggleVote(body.ideaId, session.user.id);
      return json(200, { success: true, voted });
    }
    if (body.action === "publish") {
      const idea = await store.setVisibility(body.ideaId, session.user.id, "public");
      if (!idea) return json(403, { error: "Idea not found or unauthorized" });
      return json(200, { idea });
    }
    if (body.action === "favorite") {
      const idea = await store.setFavorite(body.ideaId ?? body.id, session.user.id, body.is_favorite);
      if (!idea) return json(403, { error: "Idea not found or unauthorized" });
      return json(200, { success: true });
    }
    if (body.action === "save" || body.title) {
      const spent = await store.spendCredit(session.user);
      if (!spent.ok) {
        return json(403, { error: "Daily limit reached", limitReached: true, code: "rate_limited" });
      }
      const idea = await store.insertIdea({
        user_id: session.user.id,
        prompt: body.prompt ?? body.idea?.prompt,
        title: body.title ?? body.idea?.title,
        description: body.description ?? body.idea?.description,
        target_audience: body.target_audience ?? body.idea?.target_audience,
        problem_solved: body.problem_solved ?? body.idea?.problem_solved,
        unique_value_prop: body.unique_value_prop ?? body.idea?.unique_value_prop,
        key_features: body.key_features ?? body.idea?.key_features,
        monetization_strategies: body.monetization_strategies ?? body.idea?.monetization_strategies,
        technical_feasibility: body.technical_feasibility ?? body.idea?.technical_feasibility,
        market_validation_hints: body.market_validation_hints ?? body.idea?.market_validation_hints,
        scores: body.scores ?? body.idea?.scores,
        model_source: body.model_source ?? body.idea?.model_source ?? "puter",
        creative_mode: body.creative_mode ?? body.idea?.creative_mode,
      });
      return json(200, { idea, remainingCredits: spent.credits });
    }
    return json(400, { error: "Invalid action" });
  }

  if (method === "GET" && route === "/ideas/share") {
    if (!session.user) return json(200, { shares: [] });
    return json(200, { shares: await store.listSharesBy(session.user.id) });
  }

  if (method === "POST" && route === "/ideas/share") {
    if (!session.user) return json(401, { error: "Unauthorized" });
    const idea = await store.findIdea(body.ideaId);
    if (!idea || idea.user_id !== session.user.id) {
      return json(403, { error: "Idea not found or unauthorized" });
    }
    if (body.community) {
      await store.setVisibility(body.ideaId, session.user.id, "public");
      return json(200, { success: true, visibility: "public" });
    }
    if (!body.shareWithEmail) return json(400, { error: "Missing ideaId or shareWithEmail" });
    await store.shareIdea({ ideaId: body.ideaId, sharedBy: session.user.id, email: body.shareWithEmail });
    return json(200, { success: true });
  }

  if (method === "GET" && route === "/ideas/comments") {
    if (!body.ideaId && !request.query?.ideaId) return json(400, { error: "Missing ideaId" });
    const ideaId = request.query?.ideaId || body.ideaId;
    return json(200, { comments: await store.listComments(ideaId) });
  }

  if (method === "POST" && route === "/ideas/comments") {
    if (!session.user) return json(401, { error: "Unauthorized" });
    if (!body.ideaId || !body.content) return json(400, { error: "Missing ideaId or content" });
    const comment = await store.addComment({
      ideaId: body.ideaId,
      userId: session.user.id,
      content: String(body.content).slice(0, 2000),
    });
    return json(200, { comment });
  }

  if (method === "GET" && route === "/chat") {
    if (!session.user) return json(401, { error: "Unauthorized" });
    const messages = await store.listChat(session.user.id, request.query?.ideaId);
    return json(200, { messages });
  }

  if (method === "POST" && route === "/chat/log") {
    if (!session.user) return json(401, { error: "Unauthorized" });
    if (!body.content) return json(400, { error: "Missing content" });
    await store.addChat({
      userId: session.user.id,
      ideaId: body.ideaId,
      role: body.role === "assistant" ? "assistant" : "user",
      content: String(body.content).slice(0, 8000),
    });
    return json(200, { ok: true });
  }

  if (method === "POST" && route === "/chat") {
    if (!session.user) return json(401, { error: "Unauthorized" });
    const apiKey = String(body.apiKey || env.OPENROUTER_API_KEY || "").trim();
    if (!apiKey) {
      return json(503, {
        error: "Add an OpenRouter key on this device, or set OPENROUTER_API_KEY on the server. The website can also use Puter.",
        code: "missing_key",
      });
    }
    const message = String(body.message || "").trim();
    if (!message) return json(400, { error: "Message is empty.", code: "empty_message" });
    const ran = await runModel(completeChat, {
      apiKey,
      systemPrompt: body.systemPrompt || CHAT_PROMPT,
      message,
      history: Array.isArray(body.history) ? body.history : [],
    });
    if (ran.error) return ran.error;
    await store.addChat({ userId: session.user.id, ideaId: body.ideaId, role: "user", content: message });
    await store.addChat({ userId: session.user.id, ideaId: body.ideaId, role: "assistant", content: ran.text });
    return json(200, { reply: ran.text });
  }

  if (method === "POST" && route === "/generate") {
    const apiKey = String(body.apiKey || env.OPENROUTER_API_KEY || "").trim();
    if (!apiKey) {
      return json(503, {
        error: "No model key is configured. Sign in to Puter in the browser, or set OPENROUTER_API_KEY.",
        code: "missing_key",
      });
    }
    if (session.user) {
      const spent = await store.spendCredit(session.user);
      if (!spent.ok) return json(403, { error: "Daily limit reached", limitReached: true });
    }
    const prompt = String(body.prompt || "").trim();
    if (!prompt) return json(400, { error: "Prompt is required" });
    const ran = await runModel(completeChat, {
      apiKey,
      systemPrompt: ASSAY_PROMPT,
      message: `Creative mode: ${body.creativeMode || "balanced"}. Seed: ${prompt}`,
      history: [],
    });
    if (ran.error) return ran.error;
    const text = ran.text;
    const parsed = parseIdeaText(text, prompt, body.creativeMode);
    let saved = null;
    if (session.user) {
      saved = await store.insertIdea({ ...parsed, user_id: session.user.id });
    }
    const idea = saved || { ...parsed, id: "buffer-assay" };
    return json(200, { ideas: [idea], remainingCredits: session.user?.credits ?? null });
  }

  if (method === "GET" && route === "/stripe/status") {
    if (!session.user) return json(401, { error: "Unauthorized" });
    return json(200, {
      status: session.user.subscription_status || "free",
      stripe: env.STRIPE_SECRET_KEY ? "ready" : "not_configured",
    });
  }

  if (method === "POST" && route === "/stripe/checkout") {
    if (!session.user) return json(401, { error: "Unauthorized" });
    if (!env.STRIPE_SECRET_KEY) {
      return json(503, {
        error: "Stripe is not activated. Set STRIPE_SECRET_KEY on the server.",
        code: "stripe_off",
      });
    }
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    let customerId = session.user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: { userId: session.user.id, source: "ideaforge" },
      });
      customerId = customer.id;
      await store.setStripeCustomer(session.user.id, customerId);
    }
    const origin = env.APP_ORIGIN || "https://one-idea-forge-ai.vercel.app";
    const price = env.STRIPE_PRICE_ID;
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: price
        ? [{ price, quantity: 1 }]
        : [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: 1900,
                recurring: { interval: "month" },
                product_data: { name: "IdeaForge Pro (Monthly)" },
              },
            },
          ],
      success_url: body.redirectURL || `${origin}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.redirectURL || `${origin}/settings`,
      metadata: { userId: session.user.id },
    });
    return json(200, { url: checkout.url });
  }

  if (method === "POST" && route === "/stripe/webhook") {
    if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
      return json(503, { error: "Stripe webhook is not activated.", code: "stripe_off" });
    }
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody || "",
        headers["stripe-signature"],
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      return json(400, { error: error.message || "Webhook signature verification failed" });
    }
    const object = event.data?.object;
    if (event.type === "checkout.session.completed" && object?.customer) {
      await store.setSubscriptionByCustomer(object.customer, "pro");
    }
    if (event.type === "customer.subscription.deleted" && object?.customer) {
      await store.setSubscriptionByCustomer(object.customer, "free");
    }
    if (
      (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") &&
      object?.customer
    ) {
      const active = object.status === "active" || object.status === "trialing";
      await store.setSubscriptionByCustomer(object.customer, active ? "pro" : "free");
    }
    return json(200, { received: true });
  }

  return json(404, { error: "Not found" });
}

async function runModel(completeChat, input) {
  if (!completeChat) return { error: json(500, { error: "Chat adapter is not configured." }) };
  try {
    return { text: await completeChat(input) };
  } catch (error) {
    const code = error?.code || "provider_error";
    const status = code === "payment_required" ? 402 : code === "rate_limited" ? 429 : code === "missing_key" ? 503 : 502;
    return { error: json(status, { error: error.message || "AI request failed", code }) };
  }
}

async function startSession(store, user, secure) {
  const token = newSessionToken();
  await store.saveSession({
    tokenHash: hashToken(token),
    userId: user.id,
    expiresAt: sessionExpiry(),
  });
  return json(200, { user: publicUser(user) }, { "Set-Cookie": sessionCookie(token, { secure }) });
}
