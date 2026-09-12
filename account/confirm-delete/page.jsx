"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import useUser from "@/utils/useUser";

export default function ConfirmDeletePage() {
  const { data: authUser } = useUser();

  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get("token");
      if (!tokenParam) {
        setStatus("error");
        setError("Invalid confirmation link");
      } else {
        setToken(tokenParam);
      }
    }
  }, []);

  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      window.location.href = "/";
    }
  }, [status, countdown]);

  const handleConfirmDelete = async () => {
    setStatus("deleting");
    setError("");

    try {
      const res = await fetch(`/api/user/profile?token=${token}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      setStatus("success");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#6855FF] rounded-lg flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">IdeaForge</span>
          </div>
        </div>

        <div className="bg-[#1A1425] border border-white/10 rounded-3xl p-8">
          {status === "pending" && token && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-6 mx-auto">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h1 className="text-2xl font-bold mb-4 text-center">
                Confirm Account Deletion
              </h1>
              <p className="text-white/60 mb-6 text-center">
                {authUser ? (
                  <>
                    You're about to permanently delete your account{" "}
                    <span className="text-white font-medium">
                      {authUser.email}
                    </span>
                  </>
                ) : (
                  <>You're about to permanently delete your account</>
                )}
              </p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                <p className="text-red-400 text-sm font-medium mb-2">
                  This action will:
                </p>
                <ul className="text-red-400/80 text-sm space-y-1 list-disc list-inside">
                  <li>Delete all your ideas and collections</li>
                  <li>Remove all your comments and shares</li>
                  <li>Cancel any active subscriptions</li>
                  <li>Permanently erase all your data</li>
                </ul>
              </div>
              <p className="text-white/40 text-sm text-center mb-8">
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => (window.location.href = "/settings")}
                  className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20"
                >
                  Delete My Account
                </button>
              </div>
            </>
          )}

          {status === "deleting" && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-6 mx-auto">
                <Loader2 size={32} className="text-[#6855FF] animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-4 text-center">
                Deleting Account...
              </h1>
              <p className="text-white/60 text-center">
                Please wait while we delete your account and all associated
                data.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-2xl mb-6 mx-auto">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-4 text-center">
                Account Deleted
              </h1>
              <p className="text-white/60 text-center mb-6">
                Your account has been permanently deleted. We're sorry to see
                you go!
              </p>
              <p className="text-white/40 text-sm text-center">
                Redirecting to homepage in {countdown}...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-6 mx-auto">
                <XCircle size={32} className="text-red-500" />
              </div>
              <h1 className="text-2xl font-bold mb-4 text-center">
                Something Went Wrong
              </h1>
              <p className="text-white/60 text-center mb-6">
                {error ||
                  "We couldn't delete your account. Please try again or contact support."}
              </p>
              <button
                onClick={() => (window.location.href = "/settings")}
                className="w-full bg-[#6855FF] hover:bg-[#5444D1] py-3 rounded-2xl font-bold transition-all"
              >
                Back to Settings
              </button>
            </>
          )}
        </div>

        <p className="text-white/20 text-xs text-center mt-8">
          Need help? Contact support@ideaforge.ai
        </p>
      </div>
    </div>
  );
}
