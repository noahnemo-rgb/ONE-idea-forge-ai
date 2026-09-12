import { AlertCircle } from "lucide-react";

export function ErrorState({ error }) {
  return (
    <div className="min-h-screen bg-[#0F0A18] text-white flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
      <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
      <p className="text-white/60 mb-8 max-w-md">{error}</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="bg-[#6855FF] px-8 py-3 rounded-2xl font-bold"
      >
        Try Again
      </button>
    </div>
  );
}
