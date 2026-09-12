import { X, Share2, Loader2 } from "lucide-react";

export function ShareModal({
  sharingIdea,
  shareEmail,
  isSharing,
  onClose,
  onEmailChange,
  onSubmit,
}) {
  if (!sharingIdea) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Share Idea</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <p className="text-white/60 mb-8">
          Share{" "}
          <span className="text-white font-bold">"{sharingIdea.title}"</span>{" "}
          with a teammate. They'll receive an email and see it in their history.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">
              Teammate's Email
            </label>
            <input
              type="email"
              required
              placeholder="teammate@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-[#6855FF] focus:ring-0 transition-all"
              value={shareEmail}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isSharing}
            className="w-full bg-[#6855FF] hover:bg-[#5444D1] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSharing ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Share2 size={20} />
            )}
            Share Idea
          </button>
        </form>
      </div>
    </div>
  );
}
