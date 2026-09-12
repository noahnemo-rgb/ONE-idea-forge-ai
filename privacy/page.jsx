import React from "react";
import {
  Shield,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  Database,
  Share2,
  UserCheck,
  AlertCircle,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-200 font-sans selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/settings"
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Settings
          </a>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            <span className="font-bold text-white tracking-tight">
              IdeaForge
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            Last updated: December 21, 2025
          </div>
        </header>

        {/* Content */}
        <div className="space-y-12 text-gray-300 leading-relaxed">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-lg">
              IdeaForge ("we," "us," or "our") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, store,
              and protect your information when you use our mobile and web
              application (the "App").
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                1. Information We Collect
              </h2>
            </div>
            <ul className="space-y-4 ml-4">
              <li className="flex gap-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>
                  <strong>Account Information:</strong> When you create an
                  account, we collect your email address and any information you
                  provide during sign-up (via email/password or Google sign-in).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>
                  <strong>Usage Data:</strong> We collect anonymous data about
                  your app ideas and generations (prompts and results) to
                  provide the service. This data starts anonymous and may be
                  migrated to your account with your explicit consent (see
                  Section 4).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>
                  <strong>User-Provided API Keys:</strong> If you enter API keys
                  for third-party AI models (e.g., OpenAI, Anthropic, Gemini),
                  these are stored securely on your device only.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>
                  <strong>Analytics:</strong> Aggregated, anonymized usage
                  statistics to improve the App (no personal identifiers).
                </span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200/80 italic">
                We do NOT collect sensitive personal information, payment
                details (handled by Apple In-App Purchases or Stripe on web),
                precise location, or any data beyond what's necessary for core
                functionality.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                2. How We Use Your Information
              </h2>
            </div>
            <ul className="space-y-3 ml-4">
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  To provide and maintain the App (generating ideas, saving
                  history, managing subscriptions).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  To migrate anonymous generations to your account (only with
                  consent).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  To process Pro Plan subscriptions (via Apple In-App Purchases
                  on mobile; Stripe on web).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  To communicate updates, support responses, or security alerts.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>For anonymized analytics to enhance features.</span>
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Database className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                3. Data Storage and Security
              </h2>
            </div>
            <ul className="space-y-3 ml-4">
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">•</span>
                <span>
                  Account and usage data is stored securely in our database
                  (PostgreSQL via Neon).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">•</span>
                <span>
                  User-provided API keys are encrypted on your device using
                  platform-secure storage (iOS Keychain / Android Keystore) and
                  never transmitted to our servers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">•</span>
                <span>
                  We use industry-standard encryption and security practices.
                  However, no method is 100% secure.
                </span>
              </li>
            </ul>
          </section>

          <section className="p-8 bg-purple-500/5 border border-purple-500/20 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Anonymous Data Migration
            </h2>
            <p>
              When you log in, previously generated ideas (stored anonymously)
              can be associated with your account for persistence. We will ask
              for your explicit consent before migrating. You can decline, and
              anonymous data remains separate.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Share2 className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                5. Sharing Your Information
              </h2>
            </div>
            <p className="mb-4">We do not sell your data. We may share:</p>
            <ul className="space-y-3 ml-4 mb-4">
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <span>
                  With service providers (e.g., database hosting, analytics)
                  under strict confidentiality.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <span>As required by law or to protect rights/safety.</span>
              </li>
            </ul>
            <p className="text-sm text-gray-400 italic">
              Third-party AI providers (via your API keys) process prompts on
              their servers per their policies.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <Lock className="w-6 h-6 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">6. Your Rights</h2>
            </div>
            <ul className="space-y-3 ml-4">
              <li className="flex gap-3">
                <span className="text-pink-500 font-bold">•</span>
                <span>
                  <strong>Access, correct, or delete your data:</strong> Contact
                  us or use in-app features.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-500 font-bold">•</span>
                <span>
                  <strong>Withdraw consent:</strong> Decline migration or delete
                  account.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-500 font-bold">•</span>
                <span>
                  <strong>Opt-out:</strong> Limited, as data is essential for
                  core use.
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm">
              For GDPR/CCPA requests, email{" "}
              <a
                href="mailto:privacy@idea-forge.ai"
                className="text-purple-400 hover:underline"
              >
                privacy@idea-forge.ai
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Children's Privacy
            </h2>
            <p>
              The App is not for users under 13. We do not knowingly collect
              data from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Changes</h2>
            <p>
              We may update this policy; continued use constitutes acceptance.
            </p>
          </section>

          <footer className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Questions?</p>
                <a
                  href="mailto:privacy@idea-forge.ai"
                  className="text-white font-medium hover:text-purple-400 transition-colors"
                >
                  privacy@idea-forge.ai
                </a>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Thank you for trusting IdeaForge.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
