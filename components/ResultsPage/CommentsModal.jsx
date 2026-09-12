import { X, Send, Loader2 } from "lucide-react";

export function CommentsModal({
  activeIdeaComments,
  comments,
  newComment,
  isSubmittingComment,
  onClose,
  onCommentChange,
  onSubmit,
}) {
  if (!activeIdeaComments) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-lg w-full shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Comments</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
          {comments.length === 0 ? (
            <p className="text-center text-white/20 py-8">
              No comments yet. Start the conversation!
            </p>
          ) : (
            comments.map((comment, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#6855FF]">
                    {comment.user_name || "Teammate"}
                  </span>
                  <span className="text-[10px] text-white/20">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-white/80">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={onSubmit} className="relative">
          <input
            type="text"
            required
            placeholder="Add a comment..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 pr-12 focus:border-[#6855FF] focus:ring-0 transition-all outline-none"
            value={newComment}
            onChange={(e) => onCommentChange(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSubmittingComment}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6855FF] hover:text-[#5444D1] disabled:opacity-50"
          >
            {isSubmittingComment ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
