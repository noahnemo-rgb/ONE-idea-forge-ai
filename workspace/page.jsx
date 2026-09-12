"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowLeft,
  Users,
  MessageSquare,
  Share2,
  Clock,
  ChevronRight,
  Search,
  Activity,
  FolderPlus,
  Folder,
  Plus,
  X,
  Loader2,
  ThumbsUp,
} from "lucide-react";
import useUser from "@/utils/useUser";
import { toast } from "sonner";

export default function WorkspacePage() {
  const { data: authUser } = useUser();
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [sharedByMe, setSharedByMe] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isSubmittingFolder, setIsSubmittingFolder] = useState(false);

  useEffect(() => {
    if (authUser) {
      fetchWorkspaceData();
      fetchCollections();
    }
  }, [authUser]);

  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/ideas?collections=true");
      const data = await res.json();
      setCollections(data.collections || []);
    } catch (err) {
      console.error("Collections fetch error:", err);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      setIsSubmittingFolder(true);
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_collection",
          name: newFolderName,
        }),
      });

      if (!res.ok) throw new Error("Failed to create folder");

      toast.success("Team folder created!");
      setNewFolderName("");
      setIsCreatingFolder(false);
      fetchCollections();
    } catch (err) {
      toast.error("Could not create folder");
    } finally {
      setIsSubmittingFolder(false);
    }
  };

  const fetchWorkspaceData = async () => {
    try {
      // Fetch ideas shared with me
      const resWithMe = await fetch("/api/ideas?shared=true");
      const dataWithMe = await resWithMe.json();
      setSharedWithMe(dataWithMe.ideas || []);

      // Fetch ideas I've shared (we'll need a new API or filter for this)
      // For now, let's assume we can filter by shared_by in the ideas API
      const resByMe = await fetch("/api/ideas/share");
      const dataByMe = await resByMe.json();
      setSharedByMe(dataByMe.shares || []);
    } catch (err) {
      console.error("Workspace fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (window.location.href = "/history")}
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
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Users size={14} className="text-[#6855FF]" />
          <span className="text-xs font-medium">Team Workspace</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              Team Workspace
            </h1>
            <p className="text-white/40">
              Collaborate on ideas and track shared activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
              <input
                type="text"
                placeholder="Search workspace..."
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-[#6855FF]/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed: Shared With Me */}
          <div className="lg:col-span-2 space-y-12">
            {/* Team Folders Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Folder size={16} className="text-amber-400" />
                  </div>
                  <h2 className="text-xl font-bold">Team Folders</h2>
                </div>
                <button
                  onClick={() => setIsCreatingFolder(true)}
                  className="flex items-center gap-2 text-xs font-bold text-[#6855FF] hover:text-[#5444D1] transition-colors"
                >
                  <Plus size={14} />
                  New Folder
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {collections.length === 0 ? (
                  <div className="col-span-full bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                    <FolderPlus
                      size={32}
                      className="text-white/10 mx-auto mb-2"
                    />
                    <p className="text-xs text-white/30">
                      No team folders yet.
                    </p>
                  </div>
                ) : (
                  collections.map((folder) => (
                    <div
                      key={folder.id}
                      className="bg-[#1A1425] border border-white/10 rounded-2xl p-4 hover:border-amber-500/30 transition-all cursor-pointer group"
                    >
                      <Folder
                        size={24}
                        className="text-amber-400 mb-3 group-hover:scale-110 transition-transform"
                      />
                      <h3 className="font-bold text-sm mb-1 truncate">
                        {folder.name}
                      </h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">
                        {folder.idea_count || 0} Ideas
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Shared With You Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MessageSquare size={16} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold">Shared with You</h2>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-white/5 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              ) : sharedWithMe.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                  <Users size={40} className="text-white/10 mx-auto mb-4" />
                  <p className="text-white/40">No ideas shared with you yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sharedWithMe.map((idea) => (
                    <div
                      key={idea.id}
                      onClick={() =>
                        (window.location.href = `/results?id=${idea.id}`)
                      }
                      className="bg-[#1A1425] border border-white/10 rounded-2xl p-6 hover:border-[#6855FF]/30 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold group-hover:text-[#6855FF] transition-colors">
                            {idea.title}
                          </h3>
                          <p className="text-sm text-white/40 line-clamp-1">
                            {idea.prompt}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                            Shared by {idea.owner_email?.split("@")[0]}
                          </div>
                          <div className="flex items-center gap-1 text-[#6855FF]">
                            <ThumbsUp size={12} fill="currentColor" />
                            <span className="text-xs font-bold">
                              {idea.vote_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                            <Clock size={12} />
                            {new Date(idea.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <ChevronRight
                          size={18}
                          className="text-white/20 group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: Activity & Outgoing Shares */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Activity size={16} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-bold">Recent Activity</h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                {sharedByMe.length === 0 ? (
                  <p className="text-sm text-white/30 text-center py-4">
                    No recent sharing activity.
                  </p>
                ) : (
                  sharedByMe.slice(0, 5).map((share, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                        <Share2 size={14} className="text-white/40" />
                      </div>
                      <div>
                        <p className="text-sm text-white/80">
                          You shared{" "}
                          <span className="font-bold text-white">
                            "{share.idea_title}"
                          </span>{" "}
                          with{" "}
                          <span className="text-[#6855FF]">
                            {share.shared_with_email}
                          </span>
                        </p>
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                          {new Date(share.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6855FF]/20 to-transparent border border-[#6855FF]/20 rounded-3xl p-6">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-[#6855FF]" />
                Pro Tip
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Shared ideas are collaborative. Any updates or comments will be
                visible to everyone with access.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Create Folder Modal */}
      {isCreatingFolder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">New Team Folder</h3>
              <button
                onClick={() => setIsCreatingFolder(false)}
                className="text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q1 Fintech Ideas"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-[#6855FF] focus:ring-0 transition-all"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingFolder}
                className="w-full bg-[#6855FF] hover:bg-[#5444D1] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmittingFolder ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <FolderPlus size={20} />
                )}
                Create Folder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
