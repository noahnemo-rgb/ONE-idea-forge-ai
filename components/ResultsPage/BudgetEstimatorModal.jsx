import { X, Loader2, Calculator, TrendingUp, DollarSign } from "lucide-react";

export function BudgetEstimatorModal({
  isGeneratingBudget,
  budgetResult,
  budgetIdea,
  onClose,
}) {
  if (!isGeneratingBudget && !budgetResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Calculator size={20} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Budget Estimator</h3>
              <p className="text-xs text-white/40">{budgetIdea?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {isGeneratingBudget ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
              <p className="text-white/60">Calculating launch costs...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-3xl p-6 text-center">
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
                  Estimated Total Launch Budget
                </p>
                <h2 className="text-4xl font-bold text-white">
                  {budgetResult.total_range}
                </h2>
              </div>

              <div className="grid gap-4">
                {budgetResult.estimates.map((est, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">
                        {est.category}
                      </h4>
                      <p className="text-sm text-white/50">{est.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">
                        {est.amount_range}
                      </div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest">
                        Estimated
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <TrendingUp size={16} className="text-white/40" />
                <p className="text-xs text-white/40 italic">
                  Note: These are AI-generated estimates based on current market
                  rates. Actual costs may vary significantly based on location
                  and specific requirements.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
