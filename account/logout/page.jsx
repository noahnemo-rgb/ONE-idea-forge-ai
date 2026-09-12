import { useEffect } from "react";
import useAuth from "@/utils/useAuth";
import { Sparkles } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  useEffect(() => {
    const performSignOut = async () => {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    };
    performSignOut();
  }, [signOut]);

  return (
    <div className="min-h-screen bg-[#0F0A18] text-white flex items-center justify-center p-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6855FF] rounded-2xl mb-6 animate-pulse">
          <Sparkles size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Signing you out...</h1>
        <p className="text-white/60">See you soon for more ideas!</p>
      </div>
    </div>
  );
}
