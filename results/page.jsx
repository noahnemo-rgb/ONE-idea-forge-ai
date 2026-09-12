"use client";

import React from "react";
import { useResultsData } from "@/hooks/useResultsData";
import { useIdeaActions } from "@/hooks/useIdeaActions";
import { useShareIdea } from "@/hooks/useShareIdea";
import { useComments } from "@/hooks/useComments";
import { useMarketResearch } from "@/hooks/useMarketResearch";
import { useTechStack } from "@/hooks/useTechStack";
import { usePitchDeck } from "@/hooks/usePitchDeck";
import { useCompetitors } from "@/hooks/useCompetitors";
import { useLandingPage } from "@/hooks/useLandingPage";
import { useBudget } from "@/hooks/useBudget";
import { Navigation } from "@/components/ResultsPage/Navigation";
import { LoadingState } from "@/components/ResultsPage/LoadingState";
import { ErrorState } from "@/components/ResultsPage/ErrorState";
import { IdeaCard } from "@/components/ResultsPage/IdeaCard";
import { CommentsModal } from "@/components/ResultsPage/CommentsModal";
import { MarketResearchModal } from "@/components/ResultsPage/MarketResearchModal";
import { ShareModal } from "@/components/ResultsPage/ShareModal";
import { TechStackModal } from "@/components/ResultsPage/TechStackModal";
import { PitchDeckModal } from "@/components/ResultsPage/PitchDeckModal";
import { CompetitorMapModal } from "@/components/ResultsPage/CompetitorMapModal";
import { LandingPageModal } from "@/components/ResultsPage/LandingPageModal";
import { BudgetEstimatorModal } from "@/components/ResultsPage/BudgetEstimatorModal";

export default function ResultsPage() {
  const { ideas, setIdeas, loading, error, prompt } = useResultsData();
  const { handleToggleFavorite, handleVote, handleCopyIdea, handleExportSpec } =
    useIdeaActions(ideas, setIdeas);

  const {
    sharingIdea,
    setSharingIdea,
    shareEmail,
    setShareEmail,
    isSharing,
    handleShare,
  } = useShareIdea();

  const {
    activeIdeaComments,
    setActiveIdeaComments,
    comments,
    newComment,
    setNewComment,
    isSubmittingComment,
    handleFetchComments,
    handlePostComment,
  } = useComments();

  const {
    researchingIdea,
    researchResult,
    isResearching,
    handleMarketResearch,
    setResearchResult,
    setIsResearching,
  } = useMarketResearch();

  const {
    techStackIdea,
    techStackResult,
    isGeneratingTechStack,
    handleTechStack,
    setTechStackResult,
    setIsGeneratingTechStack,
  } = useTechStack();

  const {
    pitchDeckIdea,
    pitchDeckResult,
    isGeneratingPitchDeck,
    handlePitchDeck,
    setPitchDeckResult,
    setIsGeneratingPitchDeck,
  } = usePitchDeck();

  const {
    competitorIdea,
    competitorResult,
    isGeneratingCompetitors,
    handleCompetitors,
    setCompetitorResult,
    setIsGeneratingCompetitors,
  } = useCompetitors();

  const {
    landingPageIdea,
    landingPageResult,
    isGeneratingLandingPage,
    handleLandingPage,
    setLandingPageResult,
    setIsGeneratingLandingPage,
  } = useLandingPage();

  const {
    budgetIdea,
    budgetResult,
    isGeneratingBudget,
    handleBudget,
    setBudgetResult,
    setIsGeneratingBudget,
  } = useBudget();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans pb-20">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Generated Ideas
          </h1>
          <p className="text-white/40">
            Based on your prompt:{" "}
            <span className="text-white/80 italic">"{prompt}"</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {ideas.map((idea, index) => (
            <IdeaCard
              key={index}
              idea={idea}
              index={index}
              onToggleFavorite={handleToggleFavorite}
              onCopy={handleCopyIdea}
              onShare={setSharingIdea}
              onResearch={handleMarketResearch}
              onComments={handleFetchComments}
              onVote={handleVote}
              onTechStack={handleTechStack}
              onPitchDeck={handlePitchDeck}
              onCompetitors={handleCompetitors}
              onLandingPage={handleLandingPage}
              onBudget={handleBudget}
              onExport={handleExportSpec}
            />
          ))}
        </div>
      </main>

      <CommentsModal
        activeIdeaComments={activeIdeaComments}
        comments={comments}
        newComment={newComment}
        isSubmittingComment={isSubmittingComment}
        onClose={() => setActiveIdeaComments(null)}
        onCommentChange={setNewComment}
        onSubmit={handlePostComment}
      />

      <MarketResearchModal
        isResearching={isResearching}
        researchResult={researchResult}
        researchingIdea={researchingIdea}
        onClose={() => {
          setResearchResult(null);
          setIsResearching(false);
        }}
      />

      <ShareModal
        sharingIdea={sharingIdea}
        shareEmail={shareEmail}
        isSharing={isSharing}
        onClose={() => setSharingIdea(null)}
        onEmailChange={setShareEmail}
        onSubmit={handleShare}
      />

      <TechStackModal
        isGeneratingTechStack={isGeneratingTechStack}
        techStackResult={techStackResult}
        techStackIdea={techStackIdea}
        onClose={() => {
          setTechStackResult(null);
          setIsGeneratingTechStack(false);
        }}
      />

      <PitchDeckModal
        isGeneratingPitchDeck={isGeneratingPitchDeck}
        pitchDeckResult={pitchDeckResult}
        pitchDeckIdea={pitchDeckIdea}
        onClose={() => {
          setPitchDeckResult(null);
          setIsGeneratingPitchDeck(false);
        }}
      />

      <CompetitorMapModal
        isGeneratingCompetitors={isGeneratingCompetitors}
        competitorResult={competitorResult}
        competitorIdea={competitorIdea}
        onClose={() => {
          setCompetitorResult(null);
          setIsGeneratingCompetitors(false);
        }}
      />

      <LandingPageModal
        isGeneratingLandingPage={isGeneratingLandingPage}
        landingPageResult={landingPageResult}
        landingPageIdea={landingPageIdea}
        onClose={() => {
          setLandingPageResult(null);
          setIsGeneratingLandingPage(false);
        }}
      />

      <BudgetEstimatorModal
        isGeneratingBudget={isGeneratingBudget}
        budgetResult={budgetResult}
        budgetIdea={budgetIdea}
        onClose={() => {
          setBudgetResult(null);
          setIsGeneratingBudget(false);
        }}
      />
    </div>
  );
}
