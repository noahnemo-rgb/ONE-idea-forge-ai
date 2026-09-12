import { X, Loader2, Cpu } from "lucide-react";

export function TechStackModal({
  isGeneratingTechStack,
  techStackResult,
  techStackIdea,
  onClose,
}) {
  if (!isGeneratingTechStack && !techStackResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Cpu size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Tech Stack Suggester</h3>
              <p className="text-xs text-white/40">{techStackIdea?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {isGeneratingTechStack ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
              <p className="text-white/60">Architecting your solution...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(techStackResult).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <h4 className="text-[10px] font-bold text-[#6855FF] uppercase tracking-widest mb-2">
                    {key.replace("_", " ")}
                  </h4>
                  {Array.isArray(value) ? (
                    <ul className="space-y-1">
                      {value.map((v, i) => (
                        <li
                          key={i}
                          className="text-sm text-white/80 flex items-center gap-2"
                        >
                          <div className="w-1 h-1 bg-blue-400 rounded-full" />
                          {v}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/80">{value}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
