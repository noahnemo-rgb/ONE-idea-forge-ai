import { Cookie } from "lucide-react";

const ONE_GOLD =
  "https://raw.githubusercontent.com/noahnemo-rgb/ONE-Multiverse/main/brand/one-gold-mark.png";
const HASEOS_SEAL =
  "https://raw.githubusercontent.com/noahnemo-rgb/ONE-Multiverse/main/brand/haseos-trust-seal-gold-blue.svg";

export default function OneColophonFooter() {
  return (
    <footer className="border-t border-white/10 py-12 px-6 text-center bg-[#0F0A18] text-white">
      <div className="flex items-center justify-center gap-6 mb-8">
        <img src={ONE_GOLD} alt="ONE" width="56" height="56" className="h-14 w-14 rounded-full object-cover" />
        <img src={HASEOS_SEAL} alt="HASEOS Trust" width="160" height="90" className="h-14 w-auto" />
      </div>
      <p className="text-white/50 text-sm max-w-xl mx-auto mb-3 leading-relaxed">
        Idea Forge is a ONE-branded work. Guest intelligence here is sheathed: a named helper, not this product&apos;s self.
      </p>
      <p className="text-white/40 text-sm italic mb-6">ALL is One and ONE is All</p>
      <div className="flex justify-center flex-wrap gap-6 mb-6">
        <a href="/trust" className="text-white/40 hover:text-white transition-colors text-sm">Trust</a>
        <a href="/privacy" className="text-white/40 hover:text-white transition-colors text-sm">Privacy</a>
        <a href="/terms" className="text-white/40 hover:text-white transition-colors text-sm">Terms</a>
        <a href="/cookie-policy" className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-1"><Cookie size={14} />Cookies</a>
        <a href="/accessibility" className="text-white/40 hover:text-white transition-colors text-sm">Accessibility</a>
      </div>
      <p className="text-white/30 text-xs tracking-wide">© 2026 IdeaForge · HASEOS™ · ONE Trust Colophon</p>
    </footer>
  );
}
