import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0F0A18] text-white flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-[#6855FF] animate-spin mb-6" />
      <h2 className="text-2xl font-bold mb-2">Forging your ideas...</h2>
      <p className="text-white/40">
        Querying multiple AI models for the best results.
      </p>
    </div>
  );
}
