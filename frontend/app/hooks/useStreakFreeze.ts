import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { heroApi } from "@/lib/api/hero";

export function useStreakFreeze() {
  const { setProgress } = useAuth();
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buy = async (): Promise<void> => {
    setBuying(true);
    try {
      setProgress(await heroApi.buyStreakFreeze());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBuying(false);
    }
  };

  return { buy, buying, error };
}
