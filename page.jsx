"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Zap,
  ArrowRight,
  Lightbulb,
  Rocket,
  Target,
  User as UserIcon,
  LogOut,
  CreditCard,
  History,
  Star,
  X,
  BarChart3,
  Cookie,
  Hammer,
  Flame,
  Wind,
} from "lucide-react";
import useUser from "@/utils/useUser";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const { data: authUser, loading: authLoading } = useUser();
  const [prompt, setPrompt] = useState("");
  const [isTrendingEnabled, setIsTrendingEnabled] = useState(false);
  const [creativeMode, setCreativeMode] = useState("balanced");
  const [showPromo, setShowPromo] = useState(true);
  const [showMigrationModal, setShowMigrationModal] = useState(false);

  // Fetch user profile (credits, subscription)
  const { data: profileData, refetch: refetchProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: !!authUser,
  });

  const user = profileData?.user;
  const isPro =
    user?.subscription_status === "pro" ||
    user?.subscription_status === "active";
  const credits = user?.credits ?? 0;
  const hasAskedMigration = user?.has_asked_migration;

  // Fetch Market Trends
  const { data: trendsData, isLoading: trendsLoading } = useQuery({
    queryKey: ["marketTrends"],
    queryFn: async () => {
      const res = await fetch("/api/trends");
      if (!res.ok) throw new Error("Failed to fetch trends");
      return res.json();
    },
  });

  const inspirations = [
    {
      name: "Notion",
      description: "All-in-one workspace for notes and tasks",
      prompt:
        "A modular workspace for teams to collaborate on docs, tasks, and databases with a clean, block-based interface.",
    },
    {
      name: "Duolingo",
      description: "Gamified language learning platform",
      prompt:
        "A gamified education app that uses streaks, leaderboards, and bite-sized lessons to teach new skills.",
    },
    {
      name: "Calm",
      description: "Meditation and sleep for mental wellness",
      prompt:
        "A mental wellness app focused on guided meditations, sleep stories, and ambient soundscapes for stress relief.",
    },
    {
      name: "Airbnb",
      description: "Peer-to-peer travel accommodations",
      prompt:
        "A marketplace for unique travel stays and experiences, connecting hosts with travelers worldwide.",
    },
    {
      name: "Uber",
      description: "On-demand ride-sharing and delivery",
      prompt:
        "A real-time logistics platform for on-demand transportation and food delivery with seamless payments.",
    },
    {
      name: "Slack",
      description: "Real-time team communication tool",
      prompt:
        "A channel-based communication platform for teams with deep integrations and searchable message history.",
    },
    {
      name: "Spotify",
      description: "Music streaming with discovery",
      prompt:
        "A music streaming service that uses AI to provide personalized playlists and discovery for millions of tracks.",
    },
    {
      name: "Tinder",
      description: "Location-based social search app",
      prompt:
        "A social discovery app using a swipe-based interface to connect people based on location and interests.",
    },
    {
      name: "Robinhood",
      description: "Commission-free stock trading",
      prompt:
        "A simplified investing platform that makes stock and crypto trading accessible to everyone with zero commissions.",
    },
    {
      name: "Strava",
      description: "Social network for athletes",
      prompt:
        "A fitness tracking app that combines GPS data with social features like segments, clubs, and leaderboards.",
    },
  ];

  const handleReverseEngineer = (seedPrompt) => {
    setPrompt(seedPrompt);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check for anonymous data and show migration modal
  useEffect(() => {
    const checkMigration = async () => {
      if (authUser && hasAskedMigration === false) {
        try {
          const res = await fetch("/api/auth/migrate");
          const data = await res.json();

          if (data.exists) {
            setShowMigrationModal(true);
          }
        } catch (err) {
          console.error("Migration check failed", err);
        }
      }
    };

    checkMigration();
  }, [authUser, hasAskedMigration]);

  const handleApproveMigration = async () => {
    try {
      const res = await fetch("/api/auth/migrate", { method: "POST" });
      const data = await res.json();
      console.log(`Migrated ${data.migratedCount} ideas.`);
      setShowMigrationModal(false);
      refetchProfile();
    } catch (err) {
      console.error("Migration failed", err);
    }
  };

  const handleDeclineMigration = async () => {
    try {
      await fetch("/api/auth/migrate", { method: "PATCH" });
      setShowMigrationModal(false);
      refetchProfile();
    } catch (err) {
      console.error("Failed to decline migration", err);
    }
  };

  const exampleSeeds = [
    "Fitness tracker for seniors",
    "AI-powered meal planner",
    "Mental health journal for devs",
    "Sustainable travel planner",
    "Local community marketplace",
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (!authUser) {
      window.location.href = "/account/signin";
      return;
    }

    if (!isPro && credits <= 0) {
      window.location.href = "/settings?upgrade=true";
      return;
    }

    window.location.href = `/results?prompt=${encodeURIComponent(prompt)}&trending=${isTrendingEnabled}&mode=${creativeMode}`;
  };

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans">
      {/* Launch Promo Banner */}
      {showPromo && (
        <div className="bg-gradient-to-r from-[#6855FF] to-[#A855F7] px-4 py-2 text-center relative">
          <p className="text-sm font-bold flex items-center justify-center gap-2">
            <Rocket size={16} />
            Launch Special: Get 50% off Pro for your first month! Use code
            LAUNCH50
            <a href="/settings" className="underline ml-2 hover:text-white/80">
              Upgrade Now
            </a>
          </p>
          <button
            onClick={() => setShowPromo(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#6855FF] rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">IdeaForge</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="/history"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            History
          </a>
          <a
            href="/settings"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Settings
          </a>
          {authUser ? (
            <div className="flex items-center gap-4">
              {!isPro && (
                <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <Zap size={12} className="text-[#6855FF]" />
                  <span className="text-xs font-medium">
                    {credits} credits left
                  </span>
                </div>
              )}
              <a
                href="/account/logout"
                className="text-white/50 hover:text-white transition-colors"
              >
                <LogOut size={18} />
              </a>
            </div>
          ) : (
            <a
              href="/account/signin"
              className="bg-[#6855FF] hover:bg-[#5444D1] px-4 py-2 rounded-full text-sm font-semibold transition-all"
            >
              Sign In
            </a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8">
          <Zap size={14} className="text-[#6855FF]" />
          <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
            {isPro ? "Pro Plan Active" : "The Ultimate AI App Idea Generator"}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          Turn your sparks into <br />
          <span className="text-[#6855FF]">validated startups.</span>
        </h1>

        <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
          Generate high-quality, actionable app ideas using multiple leading AI
          models. Validated with market trends, monetization strategies, and
          technical specs.
        </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 max-w-3xl mx-auto text-left">
            {[
              { icon: Zap, title: "Spark", line: "The first strike. Any idea." },
              { icon: Wind, title: "Bellows", line: "Named guests. Dated window." },
              { icon: Hammer, title: "Forge", line: "Hit, cut, refuse, keep." },
              { icon: Flame, title: "Innovate", line: "Yes ships. No is data." },
            ].map((b) => (
              <div key={b.title} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <b.icon size={16} className="text-[#6855FF] mb-2" />
                <div className="text-sm font-bold tracking-wide">{b.title}</div>
                <div className="text-xs text-white/40 mt-1 leading-relaxed">{b.line}</div>
              </div>
            ))}
          </div>


        {/* Input Area */}
        <form
          onSubmit={handleGenerate}
          className="relative max-w-2xl mx-auto mb-12"
        >
          <div className="bg-[#1A1425] border border-white/10 rounded-3xl p-2 shadow-2xl focus-within:border-[#6855FF]/50 transition-all">
            <textarea
              rows={3}
              placeholder="Enter a seed idea, niche, or problem you want to solve..."
              className="w-full bg-transparent border-none focus:ring-0 text-lg p-4 resize-none placeholder:text-white/20"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between px-4 pb-2 gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    className={`w-10 h-5 rounded-full transition-colors relative ${isTrendingEnabled ? "bg-[#6855FF]" : "bg-white/10"}`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isTrendingEnabled ? "translate-x-5" : ""}`}
                    />
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isTrendingEnabled}
                    onChange={() => setIsTrendingEnabled(!isTrendingEnabled)}
                  />
                  <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors flex items-center gap-1">
                    <TrendingUp size={12} />
                    Trends
                  </span>
                </label>

                <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    Mode:
                  </span>
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {["conservative", "balanced", "disruptive", "niche"].map(
                      (mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setCreativeMode(mode)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${creativeMode === mode ? "bg-[#6855FF] text-white" : "text-white/40 hover:text-white"}`}
                        >
                          {mode}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4">
                {!isPro && authUser && (
                  <span className="text-xs text-white/40">{credits} left</span>
                )}
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="bg-[#6855FF] hover:bg-[#5444D1] disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all"
                >
                  Forge
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Example Seeds */}
        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {exampleSeeds.map((seed, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(seed)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-white/60 hover:text-white transition-all"
            >
              {seed}
            </button>
          ))}
        </div>

        {/* Market Trends Dashboard */}
        <section className="mb-32 text-left">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 size={20} className="text-green-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Market Trends</h2>
                <p className="text-white/40">
                  Hot niches and emerging opportunities
                </p>
              </div>
            </div>
            <div className="hidden md:block text-xs font-bold text-white/20 uppercase tracking-widest">
              Updated Daily
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendsLoading
              ? Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-24 bg-white/5 rounded-2xl animate-pulse"
                    />
                  ))
              : trendsData?.trends?.map((trend) => (
                  <div
                    key={trend.id}
                    className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-green-500/50 transition-all group cursor-default"
                  >
                    <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2">
                      {trend.category}
                    </div>
                    <h4 className="text-sm font-bold mb-1 group-hover:text-green-400 transition-colors">
                      {trend.topic}
                    </h4>
                    <p className="text-[10px] text-white/30">{trend.source}</p>
                  </div>
                ))}
          </div>
        </section>

        {/* Inspiration Section */}
        <section className="mb-32 text-left">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#6855FF]/20 rounded-xl flex items-center justify-center">
              <Star size={20} className="text-[#6855FF]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Get Inspired</h2>
              <p className="text-white/40">
                Reverse engineer successful real-world apps
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inspirations.map((app, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-[#6855FF]/50 transition-all"
              >
                <div>
                  <h4 className="text-lg font-bold mb-1">{app.name}</h4>
                  <p className="text-sm text-white/50">{app.description}</p>
                </div>
                <button
                  onClick={() => handleReverseEngineer(app.prompt)}
                  className="bg-white/5 hover:bg-[#6855FF] px-4 py-2 rounded-xl text-xs font-bold transition-all opacity-0 group-hover:opacity-100"
                >
                  Reverse Engineer
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-[#6855FF]/20 rounded-2xl flex items-center justify-center mb-6">
              <Rocket size={24} className="text-[#6855FF]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Multi-Model Engine</h3>
            <p className="text-white/50 leading-relaxed">
              Simultaneously query GPT-4o, Claude 3, and Gemini for diverse
              perspectives and deeper insights.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-[#6855FF]/20 rounded-2xl flex items-center justify-center mb-6">
              <Target size={24} className="text-[#6855FF]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Market Validation</h3>
            <p className="text-white/50 leading-relaxed">
              Every idea comes with AI-generated scores for market size, build
              difficulty, and revenue potential.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-[#6855FF]/20 rounded-2xl flex items-center justify-center mb-6">
              <Lightbulb size={24} className="text-[#6855FF]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Actionable Specs</h3>
            <p className="text-white/50 leading-relaxed">
              One-tap export to detailed spec documents ready for modern app
              builders and development tools.
            </p>
          </div>
        </div>
      </main>

      {/* Migration Consent Modal */}
      {showMigrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#1A1425] border border-[#6855FF]/30 rounded-[32px] p-8 max-w-md w-full shadow-[0_0_50px_rgba(104,85,255,0.2)] relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6855FF]/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6855FF] to-[#A855F7] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-[#6855FF]/20">
                <Sparkles size={32} className="text-white" />
              </div>

              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Keep your <span className="text-[#6855FF]">sparks?</span>
              </h2>

              <p className="text-white/60 mb-10 leading-relaxed text-lg">
                We found some ideas you created while exploring. Would you like
                to save them to your account so you never lose them?
              </p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleApproveMigration}
                  className="w-full bg-[#6855FF] hover:bg-[#5444D1] py-5 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-[#6855FF]/20 active:scale-[0.98]"
                >
                  Yes, Save My Ideas
                </button>
                <button
                  onClick={handleDeclineMigration}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-semibold transition-all text-white/40 hover:text-white/60"
                >
                  No thanks, start fresh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
