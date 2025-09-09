import { HeartPulse } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <HeartPulse className="w-16 h-16 text-emerald-400 animate-pulse" />
      <p className="mt-4 text-emerald-400 text-xl font-semibold animate-bounce">
        Loading...
      </p>
    </div>
  );
}
