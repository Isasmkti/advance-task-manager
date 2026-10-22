import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { questsApi } from "@/lib/api/quests";
import type { Quest, QuestInput } from "@/types";

function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : "Terjadi kesalahan.";
}

export function useQuests() {
  const { setProgress } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setQuests(await questsApi.list());
      setError(null);
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addQuest = async (input: QuestInput): Promise<boolean> => {
    try {
      const quest = await questsApi.create(input);
      setQuests((prev) => [quest, ...prev]);
      setError(null);
      return true;
    } catch (e) {
      setError(messageOf(e));
      return false;
    }
  };

  const completeQuest = async (id: number): Promise<void> => {
    try {
      const res = await questsApi.complete(id);
      setQuests((prev) => prev.map((q) => (q.id === id ? res.quest : q)));
      setProgress(res.progress);

      const reward = `+${res.xp_awarded} XP, +${res.coins_awarded} koin`;
      const streak =
        res.streak_multiplier > 1 ? ` (bonus streak x${res.streak_multiplier})` : "";
      setNotice(
        res.leveled_up
          ? `Level up! Kamu sekarang level ${res.progress.level}. ${reward}${streak}`
          : `${reward}${streak}`,
      );
      setError(null);
    } catch (e) {
      setError(messageOf(e));
    }
  };

  const removeQuest = async (id: number): Promise<void> => {
    try {
      await questsApi.remove(id);
      setQuests((prev) => prev.filter((q) => q.id !== id));
      setError(null);
    } catch (e) {
      setError(messageOf(e));
    }
  };

  return { quests, loading, error, notice, addQuest, completeQuest, removeQuest };
}
