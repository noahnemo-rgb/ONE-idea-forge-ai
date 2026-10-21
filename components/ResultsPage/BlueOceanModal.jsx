import { X, Loader2, Compass } from "lucide-react";

export function BlueOceanModal({
  isDiving,
  diveResult,
  diveError,
  divingIdea,
  onClose,
}) {
  if (!isDiving && !diveResult && !diveError) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6855FF]/20 rounded-xl flex items-center justify-center">
              <Compass size={20} className="text-[#6855FF]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Blue-ocean dive</h3>
              <p className="text-xs text-white/40">
                Guest: Idea Forge Niche Scout. {divingIdea?.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white" type="button">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {isDiving ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#6855FF] animate-spin mb-4" />
              <p className="text-white/60">Looking for three open wedges.</p>
            </div>
          ) : diveError ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm leading-relaxed text-white/80">
              <p>{diveError}</p>
              <a href="/settings" className="inline-block mt-4 text-[#6855FF] font-bold">
                Pro and sign-in live in Settings
              </a>
            </div>
          ) : (
            <>
              <p className="text-xs text-white/40">
                {diveResult?.catalog
                  ? `Seed page from ${diveResult.catalog}. The catalog stays there.`
                  : "Three wedges for this seed."}
              </p>
              {(diveResult?.niches || []).map((niche) => (
                <article
                  key={niche.name}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5"
                >
                  <h4 className="font-bold mb-2">{niche.name}</h4>
                  <p className="text-sm text-white/80">{niche.wedge}</p>
                  {niche.why_open ? (
                    <p className="text-sm text-white/50 mt-2">{niche.why_open}</p>
                  ) : null}
                  {niche.citations?.length ? (
                    <ul className="mt-3 space-y-1">
                      {niche.citations.map((citation) => (
                        <li key={citation}>
                          <a
                            href={citation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#6855FF] break-all"
                          >
                            {citation}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </>
          )}
        </div>

        {!isDiving ? (
          <button
            onClick={onClose}
            type="button"
            className="w-full mt-6 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition-all"
          >
            Close dive
          </button>
        ) : null}
      </div>
    </div>
  );
}
