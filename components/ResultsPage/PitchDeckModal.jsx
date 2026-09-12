import { X, Loader2, Presentation } from "lucide-react";

export function PitchDeckModal({
  isGeneratingPitchDeck,
  pitchDeckResult,
  pitchDeckIdea,
  onClose,
}) {
  if (!isGeneratingPitchDeck && !pitchDeckResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-3xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Presentation size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Pitch Deck Generator</h3>
              <p className="text-xs text-white/40">{pitchDeckIdea?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {isGeneratingPitchDeck ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
              <p className="text-white/60">Preparing your presentation...</p>
            </div>
          ) : (
            pitchDeckResult.slides.map((slide, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-[#6855FF] rounded-full flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <h4 className="text-lg font-bold">{slide.title}</h4>
                </div>
                <ul className="space-y-2">
                  {slide.content.map((item, j) => (
                    <li
                      key={j}
                      className="text-sm text-white/60 flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
