import React from "react";

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-200 font-sans">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Idea Forge
          </a>
          <span className="text-sm text-gray-500">Trust</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-10 leading-relaxed">
        <header>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Trust
          </h1>
          <p className="text-gray-400">
            Plane: public-stamp. This page is public language, not a
            certificate.
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            What this app is
          </h2>
          <p>
            Idea Forge is a ONE-branded website or app at{" "}
            <a
              href="https://idea-forge.ai"
              className="text-purple-400 hover:underline"
            >
              https://idea-forge.ai
            </a>
            . It is a product. It sells or offers a product feature, not a
            being.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            Who co-created it
          </h2>
          <p>Human steward: Noah Nemo.</p>
          <p className="mt-3">
            Guest intelligences appear only as named helpers inside this app.
            Choosing a guest does not make the guest into this product, and does
            not make this product into the guest.
          </p>
          <p className="mt-3">
            Guest: Idea Forge Niche Scout via OpenAI-compatible harness.
            This is a session tool. It does not fuse identities.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            Where keys live
          </h2>
          <p>
            Only in this app’s own environment or host secrets, or on your
            device when the feature is BYOK / user-pays. Keys are never
            requested in chat.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            Backends this product may use
          </h2>
          <p>
            Puter.js · OpenRouter (bring your own key) · Google AI Studio ·
            NVIDIA Build
          </p>
          <p className="mt-3">Each guest is labeled in the UI.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            What this stamp is not
          </h2>
          <p>
            Not a shared secret. Not a certificate from another plane. Not a
            claim that a model on this page holds standing outside this session.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">Perishability</h2>
          <p>
            This edition is dated 2026-09-15. If the issued date is stale
            against the latest public release, treat the stamp as due for
            refresh.
          </p>
        </section>
      </main>
    </div>
  );
}
