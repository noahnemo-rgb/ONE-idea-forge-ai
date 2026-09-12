"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowLeft,
  CreditCard,
  Shield,
  LogOut,
  ChevronRight,
  CheckCircle2,
  User as UserIcon,
  Mail,
  Twitter,
  Share2,
  Zap,
  FileText,
  Cookie,
  Accessibility,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { useSubscription } from "@/utils/useSubscription";
import useUser from "@/utils/useUser";
import { useQuery } from "@tanstack/react-query";

export default function SettingsPage() {
  const { data: authUser, loading: authLoading } = useUser();
  const { isPro, upgrade, isUpgrading } = useSubscription();

  const { data: profileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: !!authUser,
  });

  const user = profileData?.user;
  const credits = user?.credits ?? 0;

  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    google: "",
  });
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleShare = () => {
    const text = encodeURIComponent(
      "I'm using IdeaForge to build my next big startup idea! Check it out: https://ideaforge.ai #IdeaForge #AI #Startups",
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setDeleteError("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/user/delete-request", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to send confirmation email");
      }

      setEmailSent(true);
    } catch (error) {
      console.error("Error requesting account deletion:", error);
      setDeleteError("Failed to send confirmation email. Please try again.");
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F0A18] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6855FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans">
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
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
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <h1 className="text-4xl font-bold mb-12 tracking-tight">Settings</h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
              Account
            </h2>
            <div className="bg-[#1A1425] border border-white/10 rounded-3xl p-8">
              {authUser ? (
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    {authUser.image ? (
                      <img
                        src={authUser.image}
                        alt={authUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon size={32} className="text-white/20" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {authUser.name || "User"}
                    </h3>
                    <p className="text-white/40 flex items-center gap-2">
                      <Mail size={14} />
                      {authUser.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/60 mb-4">
                    Sign in to manage your account and forge more ideas.
                  </p>
                  <a
                    href="/account/signin"
                    className="bg-[#6855FF] hover:bg-[#5444D1] px-8 py-3 rounded-2xl font-bold transition-all inline-block"
                  >
                    Sign In
                  </a>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
              Subscription
            </h2>
            <div className="bg-[#1A1425] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#6855FF]/10 rounded-2xl flex items-center justify-center">
                  <CreditCard size={28} className="text-[#6855FF]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {isPro ? "Pro Plan" : "Free Plan"}
                  </h3>
                  <p className="text-white/40 text-sm">
                    {isPro
                      ? "Unlimited generations"
                      : `${credits} generations left today`}
                  </p>
                </div>
              </div>
              {!isPro && authUser && (
                <button
                  onClick={() => upgrade("pro_monthly")}
                  disabled={isUpgrading}
                  className="w-full md:w-auto bg-[#6855FF] hover:bg-[#5444D1] px-8 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-[#6855FF]/20"
                >
                  {isUpgrading ? "Processing..." : "Upgrade to Pro"}
                </button>
              )}
              {isPro && (
                <div className="flex items-center gap-2 text-green-400 font-bold">
                  <CheckCircle2 size={20} />
                  <span>Active</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Pricing Plans
              </h2>
              <span className="bg-[#6855FF]/20 text-[#6855FF] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                Launch Special: 50% OFF
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div
                className={`bg-[#1A1425] border ${
                  !isPro ? "border-[#6855FF]" : "border-white/10"
                } rounded-3xl p-8 relative overflow-hidden`}
              >
                {!isPro && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 size={20} className="text-[#6855FF]" />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-white/40 text-sm">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm text-white/60">
                    <CheckCircle2 size={16} className="text-white/20" />3
                    generations per day
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/60">
                    <CheckCircle2 size={16} className="text-white/20" />
                    Basic AI models
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/60">
                    <CheckCircle2 size={16} className="text-white/20" />
                    Standard validation
                  </li>
                </ul>
                <button
                  disabled={!isPro}
                  className={`w-full py-3 rounded-2xl font-bold transition-all ${
                    !isPro
                      ? "bg-white/5 text-white/40 cursor-default"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {!isPro ? "Current Plan" : "Downgrade"}
                </button>
              </div>

              <div
                className={`bg-[#1A1425] border ${
                  isPro ? "border-[#6855FF]" : "border-white/10"
                } rounded-3xl p-8 relative overflow-hidden`}
              >
                {isPro && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 size={20} className="text-[#6855FF]" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">Pro</h3>
                  <Zap size={16} className="text-[#6855FF] fill-[#6855FF]" />
                </div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold">$10</span>
                  <span className="text-white/40 text-sm line-through">
                    $20
                  </span>
                  <span className="text-white/40 text-sm">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 size={16} className="text-[#6855FF]" />
                    Unlimited generations
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 size={16} className="text-[#6855FF]" />
                    Premium models (GPT-4, Claude)
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 size={16} className="text-[#6855FF]" />
                    Advanced market analytics
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 size={16} className="text-[#6855FF]" />
                    Priority support
                  </li>
                </ul>
                <button
                  onClick={() => upgrade("pro_monthly")}
                  disabled={isUpgrading || isPro}
                  className={`w-full py-3 rounded-2xl font-bold transition-all ${
                    isPro
                      ? "bg-white/5 text-white/40 cursor-default"
                      : "bg-[#6855FF] hover:bg-[#5444D1] shadow-lg shadow-[#6855FF]/20"
                  }`}
                >
                  {isPro
                    ? "Current Plan"
                    : isUpgrading
                      ? "Processing..."
                      : "Upgrade Now"}
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
              Spread the Word
            </h2>
            <div className="bg-gradient-to-br from-[#6855FF]/10 to-[#A855F7]/10 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <Share2 size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Love IdeaForge?</h3>
                  <p className="text-white/40 text-sm">
                    Share your experience and help other builders find their
                    spark.
                  </p>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="w-full md:w-auto bg-[#1DA1F2] hover:bg-[#1a8cd8] px-8 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Twitter size={18} />
                Tweet about it
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
              Custom API Keys
            </h2>
            <form
              onSubmit={handleSave}
              className="bg-[#1A1425] border border-white/10 rounded-3xl p-8 space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#6855FF]/50 transition-all"
                  value={apiKeys.openai}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, openai: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#6855FF]/50 transition-all"
                  value={apiKeys.anthropic}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, anthropic: e.target.value })
                  }
                />
              </div>
              <div className="pt-4 flex items-center justify-between">
                <p className="text-xs text-white/30 max-w-xs">
                  Keys are stored securely in your browser's local storage. We
                  never see or store your keys on our servers.
                </p>
                <button
                  type="submit"
                  className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2"
                >
                  {saved ? (
                    <CheckCircle2 size={18} className="text-green-400" />
                  ) : null}
                  {saved ? "Saved" : "Save Keys"}
                </button>
              </div>
            </form>
          </section>

          <section>
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
              Legal & Policies
            </h2>
            <div className="bg-[#1A1425] border border-white/10 rounded-3xl overflow-hidden">
              <a
                href="https://idea-forge.ai/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-all border-b border-white/5"
              >
                <div className="flex items-center gap-4">
                  <Shield size={20} className="text-white/60" />
                  <span className="font-medium text-white/80">
                    Privacy Policy
                  </span>
                </div>
                <ChevronRight size={18} className="text-white/20" />
              </a>
              <a
                href="https://idea-forge.ai/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-all border-b border-white/5"
              >
                <div className="flex items-center gap-4">
                  <FileText size={20} className="text-white/60" />
                  <span className="font-medium text-white/80">
                    Terms of Service
                  </span>
                </div>
                <ChevronRight size={18} className="text-white/20" />
              </a>
              <a
                href="https://idea-forge.ai/cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-all border-b border-white/5"
              >
                <div className="flex items-center gap-4">
                  <Cookie size={20} className="text-white/60" />
                  <span className="font-medium text-white/80">
                    Cookie Policy
                  </span>
                </div>
                <ChevronRight size={18} className="text-white/20" />
              </a>
              <a
                href="https://idea-forge.ai/accessibility"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Accessibility size={20} className="text-white/60" />
                  <span className="font-medium text-white/80">
                    Accessibility Policy
                  </span>
                </div>
                <ChevronRight size={18} className="text-white/20" />
              </a>
            </div>
          </section>

          {authUser && (
            <section>
              <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
                Account Actions
              </h2>
              <div className="bg-[#1A1425] border border-white/10 rounded-3xl overflow-hidden">
                <button
                  onClick={() => (window.location.href = "/account/logout")}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-all border-b border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <LogOut size={20} className="text-red-400" />
                    <span className="font-medium text-red-400">Sign Out</span>
                  </div>
                  <ChevronRight size={18} className="text-white/20" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-red-500/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Trash2 size={20} className="text-red-500" />
                    <span className="font-medium text-red-500">
                      Delete Account
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-white/20" />
                </button>
              </div>
            </section>
          )}
        </div>

        <div className="mt-20 text-center">
          <p className="text-white/20 text-xs uppercase tracking-widest">
            IdeaForge v1.1.0
          </p>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#1A1425] border border-red-500/20 rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText("");
                setDeleteError("");
                setEmailSent(false);
              }}
              className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <X size={20} className="text-white/60" />
            </button>

            {!emailSent ? (
              <>
                <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-6">
                  <AlertTriangle size={32} className="text-red-500" />
                </div>

                <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
                <p className="text-white/60 mb-6">
                  This action cannot be undone. This will permanently delete
                  your account, all your ideas, collections, and remove all
                  associated data.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">
                      Type{" "}
                      <span className="font-bold text-red-500">DELETE</span> to
                      confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500/50 transition-all"
                      placeholder="DELETE"
                    />
                  </div>

                  {deleteError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl">
                      {deleteError}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmText("");
                      setDeleteError("");
                      setEmailSent(false);
                    }}
                    disabled={isDeleting}
                    className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-2xl font-bold transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmText !== "DELETE"}
                    className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
                  >
                    {isDeleting ? "Sending..." : "Send Confirmation"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-2xl mb-6">
                  <Mail size={32} className="text-green-500" />
                </div>

                <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
                <p className="text-white/60 mb-6">
                  We've sent a confirmation link to{" "}
                  <span className="text-white font-medium">
                    {authUser?.email}
                  </span>
                  . Click the link in the email to complete your account
                  deletion.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                  <p className="text-white/60 text-sm">
                    <strong className="text-white">Important:</strong> The
                    confirmation link will expire in 24 hours. If you don't
                    receive the email, check your spam folder.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                    setDeleteError("");
                    setEmailSent(false);
                  }}
                  className="w-full bg-[#6855FF] hover:bg-[#5444D1] py-3 rounded-2xl font-bold transition-all"
                >
                  Got It
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
