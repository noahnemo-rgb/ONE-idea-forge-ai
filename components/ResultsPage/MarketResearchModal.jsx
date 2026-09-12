import { X, Loader2, TrendingUp } from "lucide-react";

export function MarketResearchModal({
  isResearching,
  researchResult,
  researchingIdea,
  onClose,
}) {
  if (!isResearching && !researchResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Market Research</h3>
              <p className="text-xs text-white/40">{researchingIdea?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {isResearching ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
              <p className="text-white/60">
                Analyzing market trends and competitors...
              </p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                {researchResult}
              </div>
            </div>
          )}
        </div>

        {!isResearching && (
          <button
            onClick={onClose}
            className="w-full mt-6 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition-all"
          >
            Close Research
          </button>
        )}
      </div>
    </div>
  );
}
