"use client";

import React from "react";
import {
  ArrowLeft,
  Cookie,
  ShieldCheck,
  Info,
  ExternalLink,
  Mail,
} from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0F0A18] text-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center max-w-7xl mx-auto">
        <a
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Home</span>
        </a>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#6855FF]/20 rounded-2xl flex items-center justify-center">
            <Cookie size={28} className="text-[#6855FF]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6855FF]/10 border border-[#6855FF]/20 text-[#6855FF] text-xs font-medium mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6855FF] animate-pulse"></span>
              Last updated: December 21, 2025
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-12">
          <section>
            <p className="text-lg text-white/70 leading-relaxed">
              This Cookie Policy explains how IdeaForge ("we," "us," or "our")
              uses cookies and similar technologies in our web and mobile
              application (the "App").
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Info size={20} className="text-[#6855FF]" />
              <h2 className="text-2xl font-bold">1. What Are Cookies?</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              Cookies are small text files stored on your device when you visit
              a website or use an app. They help provide functionality, remember
              preferences, and improve performance.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={20} className="text-[#6855FF]" />
              <h2 className="text-2xl font-bold">2. Cookies We Use</h2>
            </div>
            <p className="text-white/60 mb-6 leading-relaxed">
              We use only essential cookies necessary for the App to function
              properly:
            </p>
            <ul className="grid gap-4">
              <li className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <strong className="text-white block mb-1">
                  Authentication Cookies
                </strong>
                <span className="text-sm text-white/50">
                  To keep you logged in and secure your session (e.g., after
                  signing in with email or Google).
                </span>
              </li>
              <li className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <strong className="text-white block mb-1">
                  Preference Cookies
                </strong>
                <span className="text-sm text-white/50">
                  To remember your settings, such as dark/light mode or trend
                  toggle state.
                </span>
              </li>
              <li className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <strong className="text-white block mb-1">
                  Functionality Cookies
                </strong>
                <span className="text-sm text-white/50">
                  To enable core features like saving idea history or managing
                  subscriptions.
                </span>
              </li>
            </ul>
            <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
              <p className="text-sm font-bold text-red-400 uppercase tracking-widest mb-2">
                We do NOT use:
              </p>
              <ul className="text-white/60 text-sm space-y-1 list-disc list-inside">
                <li>Advertising cookies</li>
                <li>Tracking cookies for third-party analytics or marketing</li>
                <li>Social media cookies</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Cookies</h2>
            <ul className="text-white/60 space-y-3 list-disc list-inside">
              <li>To authenticate users and prevent fraudulent activity.</li>
              <li>To maintain your session and preferences across visits.</li>
              <li>
                To ensure smooth operation of features like idea generation and
                history.
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ExternalLink size={20} className="text-[#6855FF]" />
              <h2 className="text-2xl font-bold">4. Third-Party Cookies</h2>
            </div>
            <p className="text-white/60 leading-relaxed mb-4">
              While we don't use tracking cookies ourselves, some third-party
              services integrated into IdeaForge may set their own:
            </p>
            <ul className="text-white/60 space-y-3 list-disc list-inside">
              <li>
                When using your own API keys (e.g., OpenAI, Anthropic), those
                services may set cookies during requests—subject to their own
                policies.
              </li>
              <li>
                Apple/Google sign-in may use cookies for authentication per
                their policies.
              </li>
              <li>
                Payment providers (Apple In-App Purchases, Google Play Billing,
                Stripe on web) may use cookies during transactions per their
                policies.
              </li>
            </ul>
            <p className="mt-4 text-sm text-white/40 italic">
              We do not control these third-party cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Managing Cookies</h2>
            <div className="space-y-4">
              <p className="text-white/60 leading-relaxed">
                <strong>Browser Settings:</strong> You can block or delete
                cookies via your browser settings. Note: Disabling essential
                cookies may prevent the App from working properly.
              </p>
              <p className="text-white/60 leading-relaxed">
                <strong>Mobile:</strong> Cookie management depends on your
                device settings.
              </p>
              <p className="text-white/60 leading-relaxed">
                <strong>No Cookie Banner:</strong> Since we use only essential
                cookies, no consent banner is required under current
                regulations.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              6. Local Storage and Similar Technologies
            </h2>
            <p className="text-white/60 leading-relaxed">
              We may use browser local storage or device storage for similar
              purposes (e.g., saving anonymous generations before login). These
              are managed like cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              7. Changes to This Policy
            </h2>
            <p className="text-white/60 leading-relaxed">
              We may update this policy. Continued use of the App constitutes
              acceptance.
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Mail size={20} className="text-[#6855FF]" />
              <h2 className="text-2xl font-bold">8. Contact</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              Questions about cookies? Email:{" "}
              <a
                href="mailto:noahnemo@gmail.com"
                className="text-[#6855FF] hover:underline"
              >
                noahnemo@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-24 text-center">
          <p className="text-white/20 text-sm italic mb-4">
            ALL is One and ONE is All.
          </p>
          <p className="text-white/40 text-xs">
            © 2025 IdeaForge. Built for builders.
          </p>
        </div>
      </main>
    </div>
  );
}
