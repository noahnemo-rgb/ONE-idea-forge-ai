import { X, Loader2, Rocket, Target, BarChart3 } from "lucide-react";

export function GTMModal({ isGeneratingGTM, gtmResult, gtmIdea, onClose }) {
  if (!isGeneratingGTM && !gtmResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Rocket size={20} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Go-to-Market Strategy</h3>
              <p className="text-xs text-white/40">{gtmIdea?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {isGeneratingGTM ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-orange-400 animate-spin mb-4" />
              <p className="text-white/60">Planning your first 90 days...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid gap-6">
                {[gtmResult.phase1, gtmResult.phase2, gtmResult.phase3].map(
                  (phase, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 font-bold text-sm">
                          {i + 1}
                        </div>
                        <h4 className="font-bold text-lg text-white">
                          {phase.title}
                        </h4>
                      </div>
                      <ul className="space-y-3">
                        {phase.actions.map((action, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 text-sm text-white/70"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ),
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} className="text-orange-400" />
                    <h5 className="font-bold text-sm uppercase tracking-wider text-white/60">
                      Top Channels
                    </h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gtmResult.channels.map((channel, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-300"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 size={16} className="text-orange-400" />
                    <h5 className="font-bold text-sm uppercase tracking-wider text-white/60">
                      Key KPIs
                    </h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gtmResult.kpis.map((kpi, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/60"
                      >
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
