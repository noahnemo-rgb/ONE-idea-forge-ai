import { useState } from "react";
import { toast } from "sonner";

export function useShareIdea() {
  const [sharingIdea, setSharingIdea] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    if (!shareEmail || !sharingIdea) return;

    try {
      setIsSharing(true);
      const response = await fetch("/api/ideas/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: sharingIdea.id,
          shareWithEmail: shareEmail,
        }),
      });

      if (!response.ok) throw new Error("Failed to share idea");

      toast.success(`Idea shared with ${shareEmail}!`);
      setSharingIdea(null);
      setShareEmail("");
    } catch (err) {
      toast.error("Could not share idea");
    } finally {
      setIsSharing(false);
    }
  };

  return {
    sharingIdea,
    setSharingIdea,
    shareEmail,
    setShareEmail,
    isSharing,
    handleShare,
  };
}
