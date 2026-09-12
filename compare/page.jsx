"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowLeft,
  Scale,
  Target,
  Zap,
  Rocket,
  DollarSign,
  Cpu,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ComparePage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id1 = params.get("id1");
    const id2 = params.get("id2");

    if (id1 && id2) {
      fetchIdeas(id1, id2);
    }
  }, []);

  const fetchIdeas = async (id1, id2) => {
    try {
      const response = await fetch("/api/ideas");
      const data = await response.json();
      const filtered = data.ideas.filter((i) => i.id === id1 || i.id === id2);
      // Ensure they are in the order of id1, id2
      const sorted = [
        filtered.find((i) => i.id === id1),
        filtered.find((i) => i.id === id2),
      ].filter(Boolean);
      setIdeas(sorted);
    } catch (err) {
      console.error("Compare fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0A18] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#6855FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (ideas.length < 2) {
    return (
      <div className="min-h-screen bg-[#0F0A18] text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Comparison Failed</h1>
        <p className="text-white/40 mb-8">
          Could not find both ideas to compare.
        </p>
        <button
          onClick={() => (window.location.href = "/history")}
          className="bg-[#6855FF] px-6 py-3 rounded-xl font-bold"
        >
          Back to History
        </button>
      </div>
    );
  }

  const [idea1, idea2] = ideas;

  const ComparisonRow = ({
    label,
    icon: Icon,
    value1,
    value2,
    type = "text",
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-white/5 relative">
      <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#1A1425] px-4 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 z-10 hidden md:block">
        {label}
      </div>
      <div className="space-y-4">
        <div className="md:hidden flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6855FF] mb-2">
          <Icon size={12} /> {label}
        </div>
        {type === "score" ? (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6855FF]"
                style={{ width: `${value1 * 10}%` }}
              />
            </div>
            <span className="text-xl font-bold">{value1}/10</span>
          </div>
        ) : type === "list" ? (
          <ul className="space-y-2">
            {value1?.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-white/60"
              >
                <CheckCircle2
                  size={14}
                  className="text-green-500 mt-1 flex-shrink-0"
                />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/80 leading-relaxed">{value1}</p>
        )}
      </div>
      <div className="space-y-4">
        <div className="md:hidden flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6855FF] mb-2">
          <Icon size={12} /> {label}
        </div>
        {type === "score" ? (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6855FF]"
                style={{ width: `${value2 * 10}%` }}
              />
            </div>
            <span className="text-xl font-bold">{value2}/10</span>
          </div>
        ) : type === "list" ? (
          <ul className="space-y-2">
            {value2?.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-white/60"
              >
                <CheckCircle2
                  size={14}
                  className="text-green-500 mt-1 flex-shrink-0"
                />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/80 leading-relaxed">{value2}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-[#0F0A18]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Scale size={20} className="text-[#6855FF]" />
              <span className="text-xl font-bold tracking-tight">
                Compare Ideas
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-white/20">
            <div className="w-[300px] truncate text-right">{idea1.title}</div>
            <div className="px-4 py-1 bg-white/5 rounded-lg">VS</div>
            <div className="w-[300px] truncate text-left">{idea2.title}</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-[#6855FF]/20 to-transparent border border-[#6855FF]/30 rounded-[32px] p-8">
            <div className="text-[10px] font-bold text-[#6855FF] uppercase tracking-widest mb-4">
              Option A
            </div>
            <h1 className="text-3xl font-bold mb-4">{idea1.title}</h1>
            <p className="text-white/60 leading-relaxed">{idea1.description}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/30 rounded-[32px] p-8">
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4">
              Option B
            </div>
            <h1 className="text-3xl font-bold mb-4">{idea2.title}</h1>
            <p className="text-white/60 leading-relaxed">{idea2.description}</p>
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="bg-[#1A1425] border border-white/10 rounded-[40px] p-8 md:p-12">
          <ComparisonRow
            label="Target Audience"
            icon={Target}
            value1={idea1.target_audience}
            value2={idea2.target_audience}
          />
          <ComparisonRow
            label="Problem Solved"
            icon={Zap}
            value1={idea1.problem_solved}
            value2={idea2.problem_solved}
          />
          <ComparisonRow
            label="Unique Value Prop"
            icon={Rocket}
            value1={idea1.unique_value_prop}
            value2={idea2.unique_value_prop}
          />
          <ComparisonRow
            label="Key Features"
            icon={Cpu}
            value1={idea1.key_features}
            value2={idea2.key_features}
            type="list"
          />
          <ComparisonRow
            label="Monetization"
            icon={DollarSign}
            value1={idea1.monetization_strategies}
            value2={idea2.monetization_strategies}
            type="list"
          />

          {/* Scores */}
          <div className="pt-12">
            <h3 className="text-2xl font-bold mb-8 text-center">
              AI Validation Scores
            </h3>
            <ComparisonRow
              label="Market Size"
              icon={Scale}
              value1={idea1.scores?.market_size}
              value2={idea2.scores?.market_size}
              type="score"
            />
            <ComparisonRow
              label="Build Difficulty"
              icon={Scale}
              value1={idea1.scores?.build_difficulty}
              value2={idea2.scores?.build_difficulty}
              type="score"
            />
            <ComparisonRow
              label="Revenue Potential"
              icon={Scale}
              value1={idea1.scores?.revenue_potential}
              value2={idea2.scores?.revenue_potential}
              type="score"
            />
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={() => (window.location.href = `/results?id=${idea1.id}`)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold transition-all"
          >
            View {idea1.title}
          </button>
          <button
            onClick={() => (window.location.href = `/results?id=${idea2.id}`)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold transition-all"
          >
            View {idea2.title}
          </button>
        </div>
      </main>
    </div>
  );
}
