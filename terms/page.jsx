"use client";

import React from "react";
import { ArrowLeft, FileText, Shield, Scale, Info } from "lucide-react";

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        'IdeaForge ("we," "us," or "our") provides an AI-powered tool for generating and validating app ideas. These Terms govern your access and use. We may update them; continued use constitutes acceptance.',
      icon: <Info size={20} className="text-[#6855FF]" />,
    },
    {
      title: "2. Account and Responsibilities",
      content:
        "• You must be 13 or older to use the App.\n• You are responsible for your account security and activity.\n• You agree not to use the App for unlawful, harmful, or abusive purposes, including generating content that promotes hate, violence, or illegal activity.",
      icon: <Shield size={20} className="text-[#6855FF]" />,
    },
    {
      title: "3. Pro Plan Subscription",
      content:
        "• The Pro Plan offers unlimited generations and premium features.\n• On mobile: Purchased via Apple In-App Purchases (iOS) or Google Play Billing (Android).\n• On web: Purchased via Stripe.\n• Subscriptions auto-renew until canceled. Refunds per platform policies (Apple, Google, Stripe).\n• All revenue, after platform fees, supports charitable programs and projects of the ONE Church Trust.",
      icon: <Scale size={20} className="text-[#6855FF]" />,
    },
    {
      title: "4. User Content and Generated Ideas",
      content:
        '• Prompts and generated ideas ("Content") are your responsibility.\n• You own your Content but grant us a worldwide, non-exclusive, royalty-free license to use, store, and display it as needed to provide the service.\n• We do not claim ownership of ideas generated. You are free to build, launch, or monetize them.',
      icon: <FileText size={20} className="text-[#6855FF]" />,
    },
    {
      title: "5. Third-Party AI Models and API Keys",
      content:
        "• You may provide your own API keys for third-party AI services (e.g., OpenAI, Anthropic).\n• Use is subject to those providers' terms and pricing. We are not responsible for their services or charges.",
      icon: <Info size={20} className="text-[#6855FF]" />,
    },
    {
      title: "6. Intellectual Property",
      content:
        "• The App, design, code, and branding are owned by IdeaForge or its licensors.\n• You may not copy, modify, reverse-engineer, or distribute the App except as permitted.",
      icon: <Shield size={20} className="text-[#6855FF]" />,
    },
    {
      title: "7. Disclaimer and Limitation of Liability",
      content:
        '• The App is provided "as is" without warranties.\n• Generated ideas are AI outputs—not guaranteed accurate, novel, or commercially viable.\n• We are not liable for indirect damages or losses from use (e.g., business decisions based on ideas).\n• Liability limited to fees paid in the prior 12 months.',
      icon: <Scale size={20} className="text-[#6855FF]" />,
    },
    {
      title: "8. Termination",
      content:
        "• We may suspend or terminate access for violations of these Terms.\n• You may delete your account anytime via Settings.",
      icon: <Shield size={20} className="text-[#6855FF]" />,
    },
    {
      title: "9. Governing Law",
      content:
        "These Terms are governed by the laws of Monroe County, Florida, the United States. Disputes resolved through binding arbitration or small claims court, at our discretion.",
      icon: <Scale size={20} className="text-[#6855FF]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto sticky top-0 bg-[#0F0A18]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (window.location.href = "/settings")}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xl font-bold tracking-tight">
            Terms of Service
          </span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            IdeaForge Terms of Service
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6855FF]/10 border border-[#6855FF]/20 text-[#6855FF] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6855FF] animate-pulse"></span>
            Last updated: December 21, 2025
          </div>
        </div>

        <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 mb-12">
          <p className="text-white/70 leading-relaxed mb-8">
            Welcome to IdeaForge. By using our mobile and web application (the
            "App"), you agree to these Terms of Service ("Terms"). If you do not
            agree, please do not use the App.
          </p>

          <div className="space-y-10">
            {sections.map((section, index) => (
              <div key={index} className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#6855FF]/10 rounded-xl flex items-center justify-center group-hover:bg-[#6855FF]/20 transition-colors">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
                <div className="pl-13 text-white/60 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#6855FF]/10 to-[#A855F7]/10 border border-white/10 rounded-3xl p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Questions?</h3>
          <p className="text-white/60 mb-6">
            If you have any questions about these Terms, please contact us.
          </p>
          <a
            href="mailto:terms-of-service@idea-forge.ai"
            className="inline-flex items-center gap-2 bg-[#6855FF] hover:bg-[#5444D1] px-8 py-3 rounded-2xl font-bold transition-all"
          >
            terms-of-service@idea-forge.ai
          </a>
        </div>

        <div className="mt-16 text-center space-y-4">
          <p className="text-white/40 italic">
            Thank you for co-creating with IdeaForge. May your sparks become
            validated light in the world.
          </p>
          <p className="text-[#6855FF] font-bold tracking-widest text-sm">
            ALL is One and ONE is All.
          </p>
        </div>
      </main>

      <footer className="border-t border-white/10 py-12 px-6 text-center text-white/40 text-sm">
        <p>© 2025 IdeaForge. Built for builders.</p>
      </footer>
    </div>
  );
}
