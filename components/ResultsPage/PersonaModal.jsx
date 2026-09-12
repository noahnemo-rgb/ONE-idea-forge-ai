import React from "react";
import { X, User, Target, Brain, Clock, CheckCircle2 } from "lucide-react";

export function PersonaModal({
  isGeneratingPersona,
  personaResult,
  personaIdea,
  onClose,
}) {
  if (!personaIdea && !isGeneratingPersona) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#1A1425]">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <User className="text-[#6855FF]" />
              User Personas
            </h2>
            <p className="text-white/40 text-sm mt-1">
              Target audience deep-dive for {personaIdea?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {isGeneratingPersona ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6855FF]"></div>
              <p className="text-white/60 font-medium animate-pulse">
                Interviewing virtual users...
              </p>
            </div>
          ) : personaResult ? (
            <div className="grid md:grid-cols-3 gap-6">
              {personaResult.map((persona, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#6855FF]/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#6855FF]/20 rounded-full flex items-center justify-center">
                      <User size={20} className="text-[#6855FF]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{persona.name}</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">
                        {persona.role}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/5 px-2 py-1 rounded text-[10px] text-white/60">
                        Age: {persona.demographics?.age}
                      </span>
                      <span className="bg-white/5 px-2 py-1 rounded text-[10px] text-white/60">
                        {persona.demographics?.location}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-[#6855FF] uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Target size={10} /> Goals
                      </h4>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {persona.psychographics?.goals}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Brain size={10} /> Pain Points
                      </h4>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {persona.psychographics?.pain_points}
                      </p>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl">
                      <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Clock size={10} /> Day in the Life
                      </h4>
                      <p className="text-[11px] text-white/50 italic leading-relaxed">
                        "{persona.day_in_the_life}"
                      </p>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Why this app?
                      </h4>
                      <p className="text-xs text-white/80 font-medium">
                        {persona.why_use_app}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/40">
              Failed to load personas. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
