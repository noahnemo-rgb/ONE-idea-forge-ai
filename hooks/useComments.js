import { useState } from "react";
import { toast } from "sonner";

export function useComments() {
  const [activeIdeaComments, setActiveIdeaComments] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleFetchComments = async (ideaId) => {
    try {
      setActiveIdeaComments(ideaId);
      const res = await fetch(`/api/ideas/comments?ideaId=${ideaId}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      toast.error("Could not load comments");
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !activeIdeaComments) return;

    try {
      setIsSubmittingComment(true);
      const res = await fetch("/api/ideas/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: activeIdeaComments,
          content: newComment,
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const data = await res.json();
      setComments([...comments, data.comment]);
      setNewComment("");
      toast.success("Comment posted!");
    } catch (err) {
      toast.error("Could not post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return {
    activeIdeaComments,
    setActiveIdeaComments,
    comments,
    newComment,
    setNewComment,
    isSubmittingComment,
    handleFetchComments,
    handlePostComment,
  };
}
