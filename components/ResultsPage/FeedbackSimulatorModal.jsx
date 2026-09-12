import {
  X,
  Loader2,
  MessageSquareWarning,
  HelpCircle,
  RefreshCw,
  Star,
} from "lucide-react";

export function FeedbackSimulatorModal({
  isGeneratingFeedback,
  feedbackResult,
  feedbackIdea,
  onClose,
}) {
  if (!isGeneratingFeedback && !feedbackResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <MessageSquareWarning size={20} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Feedback Simulator</h3>
              <p className="text-xs text-white/40">{feedbackIdea?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {isGeneratingFeedback ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-red-400 animate-spin mb-4" />
              <p className="text-white/60">Simulating investor feedback...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-6">
                <div>
                  <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-1">
                    Investor Score
                  </h4>
                  <p className="text-xs text-white/30 italic">
                    Based on viability & scalability
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-5xl font-bold text-white">
                    {feedbackResult.score_out_of_10}
                  </span>
                  <span className="text-2xl text-white/20">/10</span>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquareWarning size={18} className="text-red-400" />
                  <h4 className="font-bold text-lg text-white">
                    The Skeptic's View
                  </h4>
                </div>
                <p className="text-white/70 leading-relaxed italic">
                  "{feedbackResult.skeptic_view}"
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} className="text-red-400" />
                    <h5 className="font-bold text-sm uppercase tracking-wider text-white/60">
                      Tough Questions
                    </h5>
                  </div>
                  <ul className="space-y-3">
                    {feedbackResult.critical_questions.map((q, i) => (
                      <li
                        key={i}
                        className="text-sm text-white/70 bg-white/5 p-3 rounded-xl border border-white/5"
                      >
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={16} className="text-red-400" />
                    <h5 className="font-bold text-sm uppercase tracking-wider text-white/60">
                      Potential Pivots
                    </h5>
                  </div>
                  <ul className="space-y-3">
                    {feedbackResult.potential_pivots.map((p, i) => (
                      <li
                        key={i}
                        className="text-sm text-white/70 bg-white/5 p-3 rounded-xl border border-white/5"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
