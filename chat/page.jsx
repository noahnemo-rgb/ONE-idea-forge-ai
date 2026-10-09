"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { createAiClient, defaultModelFor } from "ai-buffer";
import { AiBufferDashboard } from "@/utils/AiBufferDashboard";
import { browserSelectionStore } from "@/utils/aiBufferSelection";
import { canFailover, streamFromProxy } from "@/utils/aiProxyClient";
import { FORGE_VISITOR_PUTER } from "@/utils/heat/flags";
import { loadPuter } from "@/utils/puterForge";
import useUser from "@/utils/useUser";

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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/chat", { credentials: "include" })
      .then((response) => (response.ok ? response.json() : { messages: [] }))
      .then((data) => setMessages(Array.isArray(data.messages) ? data.messages : []))
      .catch(() => {});
  }, [user]);

  const askLocal = async (message, history, model) => {
    if (FORGE_VISITOR_PUTER) {
      const ai = createAiClient({
        provider: "puter",
        model: model || defaultModelFor("puter"),
        loadPuter,
        defaultSystemPrompt: CHAT_PROMPT,
      });
      const info = await ai.getInfo();
      if (!info.configured) await ai.signIn();
      return ai.streamChat({ message, history, systemPrompt: CHAT_PROMPT });
    }
    return null;
  };

  const askProxy = async (message, history, provider, model) => {
    return streamFromProxy({
      provider,
      model,
      message,
      history,
      systemPrompt: CHAT_PROMPT,
    });
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
      const chosen = await browserSelectionStore().getSelection();
      let reply = null;
      if (!chosen || chosen.provider === "puter") {
        try {
          reply = await askLocal(message, history, chosen?.model);
        } catch (puterError) {
          console.warn("Puter chat unavailable", puterError);
          if (chosen?.provider === "puter") throw new Error("Chat failed.");
        }
      }
      if (!reply && chosen?.provider !== "puter") {
        const provider = chosen?.provider || "space-bunny";
        const model = chosen?.model;
        try {
          reply = await askProxy(message, history, provider, model);
        } catch (proxyError) {
          if (chosen || !canFailover(proxyError)) throw proxyError;
          reply = await askProxy(message, history, "openrouter", undefined);
        }
      }
      if (!reply) throw new Error("Chat is not available yet.");
      if (user) {
        await logTurn("user", message);
        await logTurn("assistant", reply);
      }
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch (err) {
      const message = err?.message === "Chat is not available yet." ? err.message : "Chat failed.";
      setError(message);
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
          </div>
        </div>
        <AiBufferDashboard />
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
