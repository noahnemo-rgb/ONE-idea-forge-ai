"use client";

import React from "react";
import { ArrowLeft, Accessibility, ShieldCheck, Clock } from "lucide-react";

export default function AccessibilityPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans pb-20">
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="flex items-center gap-2 hover:text-[#6855FF] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-bold">Back to Home</span>
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#6855FF]/20 rounded-2xl flex items-center justify-center">
            <Accessibility size={28} className="text-[#6855FF]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Accessibility Policy
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={10} />
                  Last updated: December 21, 2025
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-white/70 leading-relaxed">
          <section>
            <p className="text-lg text-white/90">
              IdeaForge is committed to making our application accessible to as
              many people as possible, including those with disabilities. We
              believe creativity and inspiration should be available to everyone
              on the Path.
            </p>
            <p className="mt-4">
              We strive to follow Web Content Accessibility Guidelines (WCAG)
              2.1 Level AA standards where feasible for a small independent
              team.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#6855FF]" />
              Current Accessibility Features
            </h2>
            <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
              {[
                "High contrast dark mode with readable typography",
                "Keyboard-navigable interface on web",
                "Touch targets sized for mobile accessibility",
                "Semantic HTML structure for screen readers",
                "Alt text on key images and icons",
                "Support for system-level accessibility settings",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 bg-[#6855FF] rounded-full mt-1.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Ongoing Efforts</h2>
            <p>
              We are continuously working to improve accessibility, including:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Adding descriptive labels to interactive elements</li>
              <li>Ensuring color contrast meets standards</li>
              <li>Supporting dynamic text resizing</li>
              <li>Providing text alternatives for non-text content</li>
              <li>Testing with screen readers and assistive technologies</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Limitations and Known Issues
            </h2>
            <p>
              As a newly launched application built by a small team, some areas
              may not yet be fully accessible. We welcome feedback on specific
              barriers you encounter.
            </p>
          </section>

          <section className="bg-[#6855FF]/10 border border-[#6855FF]/20 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Feedback and Support
            </h2>
            <p className="mb-6">
              If you experience accessibility issues or have suggestions, please
              contact us at:
            </p>
            <a
              href="mailto:accessibility@idea-forge.ai"
              className="text-xl font-bold text-[#6855FF] hover:underline"
            >
              accessibility@idea-forge.ai
            </a>
            <p className="mt-6 text-sm italic">
              We will respond promptly and work to resolve reported problems.
            </p>
          </section>

          <div className="pt-12 border-t border-white/10 text-center space-y-4">
            <p className="text-white/40 italic">
              We appreciate your help in making IdeaForge more inclusive.
            </p>
            <p className="text-white/60 font-medium">
              Thank you for co-creating with us.
            </p>
            <p className="text-[#6855FF] font-bold tracking-widest text-xs uppercase">
              ALL is One and ONE is All.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
