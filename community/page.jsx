"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare, Sparkles } from "lucide-react";
import useUser from "@/utils/useUser";

export default function CommunityPage() {
  const { data: user } = useUser();
  const [ideas, setIdeas] = useState([]);
  const [mine, setMine] = useState([]);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState({});
  const [openComments, setOpenComments] = useState({});

  const load = async () => {
    const response = await fetch("/api/community");
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Community is offline until the database is connected.");
      setIdeas([]);
      return;
    }
    setError(null);
    setIdeas(data.ideas || []);
    if (user) {
      const own = await fetch("/api/ideas", { credentials: "include" });
      const ownData = await own.json().catch(() => ({ ideas: [] }));
      setMine((ownData.ideas || []).filter((idea) => idea.visibility !== "public"));
    }
  };

  useEffect(() => {
    load().catch(() => setError("Community is offline until the database is connected."));
  }, [user]);

  const publish = async (ideaId) => {
    const response = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "publish", ideaId }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Could not publish.");
      return;
    }
    await load();
  };

  const vote = async (ideaId) => {
    const response = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "vote", ideaId }),
    });
    if (response.status === 401) {
      window.location.href = "/account/signin?callbackUrl=/community";
      return;
    }
    await load();
  };

  const showComments = async (ideaId) => {
    const response = await fetch(`/api/ideas/comments?ideaId=${encodeURIComponent(ideaId)}`);
    const data = await response.json().catch(() => ({ comments: [] }));
    setOpenComments((current) => ({ ...current, [ideaId]: data.comments || [] }));
  };

  const sendComment = async (ideaId) => {
    const content = (comment[ideaId] || "").trim();
    if (!content) return;
    const response = await fetch("/api/ideas/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ideaId, content }),
    });
    if (response.status === 401) {
      window.location.href = "/account/signin?callbackUrl=/community";
      return;
    }
    setComment((current) => ({ ...current, [ideaId]: "" }));
    await showComments(ideaId);
  };

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans">
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-4xl mx-auto">
        <a href="/" className="flex items-center gap-3">
          <ArrowLeft size={18} />
          <span className="font-bold">IdeaForge</span>
        </a>
        <a href="/chat" className="text-sm text-white/60 hover:text-white">
          Chat
        </a>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#6855FF] rounded-xl flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-white/50 text-sm">Public assays. Sign in to publish, vote, or comment.</p>
          </div>
        </div>
        {error && <p className="text-red-400 mb-6">{error}</p>}
        {user && mine.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-3">Publish one of yours</h2>
            <ul className="space-y-2">
              {mine.map((idea) => (
                <li key={idea.id} className="flex items-center justify-between bg-white/5 rounded-2xl px-4 py-3">
                  <span>{idea.title}</span>
                  <button
                    onClick={() => publish(idea.id)}
                    className="text-sm bg-[#6855FF] px-3 py-1.5 rounded-full font-semibold"
                  >
                    Publish
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
        <ul className="space-y-4">
          {ideas.length === 0 && !error && <li className="text-white/40">No public ideas yet.</li>}
          {ideas.map((idea) => (
            <li key={idea.id} className="bg-[#1A1425] border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold">{idea.title}</h2>
              <p className="text-white/60 mt-2">{idea.description}</p>
              <p className="text-xs text-white/40 mt-3">{idea.user_name || idea.owner_email || "Partner"}</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => vote(idea.id)} className="text-sm border border-white/10 px-3 py-1.5 rounded-full">
                  Vote ({idea.vote_count || 0})
                </button>
                <button
                  onClick={() => showComments(idea.id)}
                  className="text-sm border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2"
                >
                  <MessageSquare size={14} />
                  Comments
                </button>
              </div>
              {openComments[idea.id] && (
                <div className="mt-4 space-y-2">
                  {openComments[idea.id].map((row) => (
                    <p key={row.id} className="text-sm text-white/80">
                      <span className="text-white/40">{row.user_name}: </span>
                      {row.content}
                    </p>
                  ))}
                  <form
                    className="flex gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      sendComment(idea.id);
                    }}
                  >
                    <input
                      value={comment[idea.id] || ""}
                      onChange={(event) => setComment((current) => ({ ...current, [idea.id]: event.target.value }))}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
                      placeholder="Add a comment"
                    />
                    <button className="text-sm bg-white/10 px-3 rounded-xl">Send</button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
