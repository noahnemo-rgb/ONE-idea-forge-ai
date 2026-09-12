import { X, Loader2, LayoutGrid, ShieldAlert } from "lucide-react";

export function CompetitorMapModal({
  isGeneratingCompetitors,
  competitorResult,
  competitorIdea,
  onClose,
}) {
  if (!isGeneratingCompetitors && !competitorResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-3xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <LayoutGrid size={20} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Competitor Map</h3>
              <p className="text-xs text-white/40">{competitorIdea?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {isGeneratingCompetitors ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-orange-400 animate-spin mb-4" />
              <p className="text-white/60">Mapping the landscape...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competitorResult.map((comp, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-white">
                      {comp.name}
                    </h4>
                    <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-white/60 uppercase tracking-wider">
                      {comp.market_position}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">
                        Value Prop
                      </p>
                      <p className="text-sm text-white/70">{comp.value_prop}</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldAlert size={12} className="text-red-400" />
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                          Weakness
                        </p>
                      </div>
                      <p className="text-sm text-white/60 italic">
                        "{comp.weakness}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
