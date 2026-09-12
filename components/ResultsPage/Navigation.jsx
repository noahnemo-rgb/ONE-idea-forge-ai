import { ArrowLeft, Sparkles } from "lucide-react";

export function Navigation() {
  return (
    <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto sticky top-0 bg-[#0F0A18]/80 backdrop-blur-xl z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => (window.location.href = "/")}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#6855FF] rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">IdeaForge</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
          Save All
        </button>
        <button className="bg-[#6855FF] hover:bg-[#5444D1] px-4 py-2 rounded-xl text-sm font-semibold transition-all">
          Export All
        </button>
      </div>
    </nav>
  );
}
