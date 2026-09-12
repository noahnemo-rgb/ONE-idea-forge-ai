import {
  Bookmark,
  Share2,
  Copy,
  Globe,
  MessageSquare,
  ThumbsUp,
  Cpu,
  Presentation,
  Download,
  CheckCircle2,
} from "lucide-react";

export function IdeaCard({
  idea,
  index,
  onToggleFavorite,
  onCopy,
  onShare,
  onResearch,
  onComments,
  onVote,
  onTechStack,
  onPitchDeck,
  onExport,
}) {
  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 flex flex-col h-full hover:border-[#6855FF]/30 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-[#6855FF] transition-colors">
            {idea.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#6855FF] uppercase tracking-widest">
              {idea.model_source || "AI Engine"}
            </span>
            {idea.creative_mode && (
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                • {idea.creative_mode}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onVote(idea, index)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${idea.user_has_voted ? "bg-[#6855FF] text-white" : "bg-white/5 text-white/40 hover:text-white"}`}
          >
            <ThumbsUp
              size={16}
              fill={idea.user_has_voted ? "currentColor" : "none"}
            />
            <span className="text-xs font-bold">{idea.vote_count || 0}</span>
          </button>
          <button
            onClick={() => onCopy(idea)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
            title="Copy Idea"
          >
            <Copy size={20} />
          </button>
          <button
            onClick={() => onToggleFavorite(idea, index)}
            className={`p-2 hover:bg-white/5 rounded-xl transition-colors ${idea.is_favorite ? "text-yellow-400" : "text-white/40 hover:text-white"}`}
          >
            <Bookmark
              size={20}
              fill={idea.is_favorite ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={() => onShare(idea)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
          >
            <Share2 size={20} />
          </button>
          <button
            onClick={() => onResearch(idea)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-blue-400"
            title="Market Research"
          >
            <Globe size={20} />
          </button>
          <button
            onClick={() => onComments(idea.id)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-purple-400"
            title="Comments"
          >
            <MessageSquare size={20} />
          </button>
        </div>
      </div>

      <p className="text-white/60 leading-relaxed mb-8 flex-1">
        {idea.description}
      </p>

      {/* Scores */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {Object.entries(idea.scores || {}).map(([key, val]) => (
          <div
            key={key}
            className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center"
          >
            <div className={`text-xl font-bold ${getScoreColor(val)}`}>
              {val}
            </div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">
              {key.replace("_", " ")}
            </div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="space-y-6 mb-8">
        <div>
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
            Target Audience
          </h4>
          <p className="text-sm text-white/80">{idea.target_audience}</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
            Key Features
          </h4>
          <ul className="space-y-2">
            {idea.key_features?.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-white/60"
              >
                <CheckCircle2 size={14} className="text-[#6855FF]" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button
          onClick={() => onTechStack(idea)}
          className="bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all text-white/60"
        >
          <Cpu size={14} />
          Tech Stack
        </button>
        <button
          onClick={() => onPitchDeck(idea)}
          className="bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all text-white/60"
        >
          <Presentation size={14} />
          Pitch Deck
        </button>
        <button
          onClick={() => onExport(idea)}
          className="col-span-2 bg-white/5 hover:bg-[#6855FF] hover:text-white py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all text-white/80"
        >
          <Download size={16} />
          Export Spec
        </button>
      </div>
    </div>
  );
}
