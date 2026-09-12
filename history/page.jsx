"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowLeft,
  Search,
  Filter,
  ChevronRight,
  History,
  Bookmark,
  Users,
  Scale,
  X,
} from "lucide-react";

export default function HistoryPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, shared, favorites
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let url = "/api/ideas";
      if (filter === "shared") url += "?shared=true";
      if (filter === "favorites") url += "?favorites=true";

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setIdeas(data.ideas);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompare = (ideaId) => {
    if (selectedForCompare.includes(ideaId)) {
      setSelectedForCompare(selectedForCompare.filter((id) => id !== ideaId));
    } else if (selectedForCompare.length < 2) {
      setSelectedForCompare([...selectedForCompare, ideaId]);
    }
  };

  const handleCompare = () => {
    if (selectedForCompare.length === 2) {
      window.location.href = `/compare?id1=${selectedForCompare[0]}&id2=${selectedForCompare[1]}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6855FF] rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">IdeaForge</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/workspace"
            className="text-sm text-white/60 hover:text-white flex items-center gap-2"
          >
            <Users size={16} />
            Team Workspace
          </a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">History</h1>
            <p className="text-white/40">
              Review and manage your past generations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {[
                { id: "all", label: "All" },
                { id: "shared", label: "Shared", icon: Users },
                { id: "favorites", label: "Favorites", icon: Bookmark },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${filter === f.id ? "bg-[#6855FF] text-white" : "text-white/40 hover:text-white"}`}
                >
                  {f.icon && <f.icon size={12} />}
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
              <input
                type="text"
                placeholder="Search ideas..."
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-[#6855FF]/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Compare Bar */}
        {selectedForCompare.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#6855FF] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2">
              <Scale size={20} />
              <span className="font-bold">
                {selectedForCompare.length} / 2 selected for comparison
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCompare}
                disabled={selectedForCompare.length < 2}
                className="bg-white text-[#6855FF] px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-50"
              >
                Compare Now
              </button>
              <button
                onClick={() => setSelectedForCompare([])}
                className="text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#6855FF] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white/40">Loading your history...</p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-20 text-center">
            <History size={48} className="text-white/10 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-2">No history yet</h3>
            <p className="text-white/40 mb-8">
              Start forging ideas to see them appear here.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-[#6855FF] px-8 py-3 rounded-2xl font-bold"
            >
              Forge Your First Idea
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                onClick={() => toggleCompare(idea.id)}
                className={`bg-[#1A1425] border rounded-2xl p-6 flex items-center justify-between transition-all cursor-pointer group ${selectedForCompare.includes(idea.id) ? "border-[#6855FF] ring-1 ring-[#6855FF]" : "border-white/10 hover:border-[#6855FF]/30"}`}
              >
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold truncate group-hover:text-[#6855FF] transition-colors">
                      {idea.title}
                    </h3>
                    {idea.is_favorite && (
                      <Bookmark
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    )}
                    {idea.is_shared && (
                      <div className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Users size={10} />
                        Shared
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-white/40 truncate mb-2">
                    {idea.prompt}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      {new Date(idea.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] font-bold text-[#6855FF] uppercase tracking-widest">
                      {idea.model_source || "AI"}
                    </span>
                    {idea.owner_email && idea.is_shared && (
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        From: {idea.owner_email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {selectedForCompare.includes(idea.id) ? (
                    <div className="w-6 h-6 bg-[#6855FF] rounded-full flex items-center justify-center">
                      <Scale size={14} />
                    </div>
                  ) : (
                    <ChevronRight
                      size={20}
                      className="text-white/20 group-hover:text-white transition-colors"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
