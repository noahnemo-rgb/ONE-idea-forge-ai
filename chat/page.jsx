"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { createAiClient } from "ai-buffer";
import { createKeyedRouter } from "@/utils/heat/forgeRouter";
import { FORGE_VISITOR_PUTER } from "@/utils/heat/flags";
import { loadPuter } from "@/utils/puterForge";
import useUser from "@/utils/useUser";

const KEY_NAME = "ideaforge_openrouter_key";
const CHAT_PROMPT =
  "You are the Idea Forge assistant. Help the partner think through one business idea. Be concrete and short. When you suggest a next step, say whether the human or a named helper does it.";

async function logTurn(role, content) {
  await fetch("/api/chat/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ role, content }),
  });
}

export default function ChatPage() {
  const { data: user } = useUser();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") setKey(localStorage.getItem(KEY_NAME) || "");
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/chat", { credentials: "include" })
      .then((response) => (response.ok ? response.json() : { messages: [] }))
      .then((data) => setMessages(Array.isArray(data.messages) ? data.messages : []))
      .catch(() => {});
  }, [user]);

  const saveKey = (value) => {
    setKey(value);
    if (value.trim()) localStorage.setItem(KEY_NAME, value.trim());
    else localStorage.removeItem(KEY_NAME);
  };

  const askLocal = async (message, history) => {
    if (FORGE_VISITOR_PUTER) {
      const ai = createAiClient({
        provider: "puter",
        model: "openai/gpt-5-nano",
        loadPuter,
        defaultSystemPrompt: CHAT_PROMPT,
      });
      const info = await ai.getInfo();
      if (!info.configured) await ai.signIn();
      return ai.streamChat({ message, history, systemPrompt: CHAT_PROMPT });
    }
    return null;
  };

  const askKey = async (message, history) => {
    const apiKey = key.trim();
    if (!apiKey) return null;
    const router = createKeyedRouter({
      apiKey,
      appName: "Idea Forge",
      siteUrl: window.location.origin,
    });
    return router.streamChat({ message, history, systemPrompt: CHAT_PROMPT });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || busy) return;
    const history = messages.map((row) => ({ role: row.role, content: row.content }));
    setMessages((current) => [...current, { role: "user", content: message }]);
    setDraft("");
    setBusy(true);
    setError(null);
    try {
      let reply = null;
      try {
        reply = await askLocal(message, history);
      } catch (puterError) {
        console.warn("Puter chat unavailable", puterError);
      }
      if (!reply) reply = await askKey(message, history);
      if (reply) {
        if (user) {
          await logTurn("user", message);
          await logTurn("assistant", reply);
        }
      } else {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message, history }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Chat is not available yet.");
        reply = data.reply;
      }
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message || "Chat failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans">
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-3xl mx-auto">
        <a href="/" className="flex items-center gap-3">
          <ArrowLeft size={18} />
          <span className="font-bold">IdeaForge</span>
        </a>
        <a href="/community" className="text-sm text-white/60 hover:text-white">
          Community
        </a>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#6855FF] rounded-xl flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Chat</h1>
            <p className="text-white/50 text-sm">
              Puter in the browser first. A key saved here tries Space Bunny Alpha, then your OpenRouter model. The server key is the last stop.
            </p>
          </div>
        </div>
        <label className="block text-sm text-white/60 mb-6">
          OpenRouter key, stored only in this browser
          <input
            type="password"
            value={key}
            onChange={(event) => saveKey(event.target.value)}
            placeholder="sk-or-..."
            className="mt-2 w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-[#6855FF]"
          />
        </label>
        <div className="space-y-4 mb-6 min-h-48">
          {messages.length === 0 && (
            <p className="text-white/40">Ask about one idea. Sign in if you want the thread saved.</p>
          )}
          {messages.map((row, index) => (
            <div
              key={`${row.role}-${index}`}
              className={`rounded-2xl px-4 py-3 ${row.role === "user" ? "bg-[#6855FF]/20 ml-8" : "bg-white/5 mr-8"}`}
            >
              <p className="text-xs uppercase tracking-wide text-white/40 mb-1">{row.role}</p>
              <p className="whitespace-pre-wrap">{row.content}</p>
            </div>
          ))}
        </div>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={onSubmit} className="flex gap-3">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What should we assay?"
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-[#6855FF]"
          />
          <button
            type="submit"
            disabled={busy}
            className="bg-[#6855FF] hover:bg-[#5444D1] disabled:opacity-50 px-5 rounded-2xl font-bold flex items-center gap-2"
          >
            <Send size={16} />
            {busy ? "..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}
