import { X, Loader2, Layout, CheckCircle2, HelpCircle } from "lucide-react";

export function LandingPageModal({
  isGeneratingLandingPage,
  landingPageResult,
  landingPageIdea,
  onClose,
}) {
  if (!isGeneratingLandingPage && !landingPageResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Layout size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Landing Page Copywriter</h3>
              <p className="text-xs text-white/40">{landingPageIdea?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-8">
          {isGeneratingLandingPage ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
              <p className="text-white/60">Writing high-converting copy...</p>
            </div>
          ) : (
            <>
              {/* Hero Section */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4">
                  Hero Section
                </h4>
                <h1 className="text-3xl font-bold mb-4">
                  {landingPageResult.hero.headline}
                </h1>
                <p className="text-lg text-white/60 mb-6">
                  {landingPageResult.hero.subheadline}
                </p>
                <button className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold">
                  {landingPageResult.hero.cta}
                </button>
              </section>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Problem */}
                <section className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6">
                  <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">
                    The Problem
                  </h4>
                  <h5 className="text-xl font-bold mb-2">
                    {landingPageResult.problem.title}
                  </h5>
                  <p className="text-sm text-white/60">
                    {landingPageResult.problem.description}
                  </p>
                </section>

                {/* Solution */}
                <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6">
                  <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">
                    The Solution
                  </h4>
                  <h5 className="text-xl font-bold mb-2">
                    {landingPageResult.solution.title}
                  </h5>
                  <p className="text-sm text-white/60">
                    {landingPageResult.solution.description}
                  </p>
                </section>
              </div>

              {/* Features */}
              <section>
                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-6 text-center">
                  Key Features
                </h4>
                <div className="grid md:grid-cols-3 gap-6">
                  {landingPageResult.features.map((feature, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                      <CheckCircle2
                        size={24}
                        className="text-emerald-400 mb-4"
                      />
                      <h5 className="font-bold mb-2">{feature.title}</h5>
                      <p className="text-sm text-white/50">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-6">
                  Frequently Asked Questions
                </h4>
                <div className="space-y-6">
                  {landingPageResult.faq.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <HelpCircle
                        size={20}
                        className="text-emerald-400 shrink-0 mt-1"
                      />
                      <div>
                        <h5 className="font-bold mb-1">{item.question}</h5>
                        <p className="text-sm text-white/50">{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
