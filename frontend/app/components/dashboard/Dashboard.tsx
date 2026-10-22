"use client";

import { CategoryForm } from "@/components/categories/CategoryForm";
import { HeroCard } from "@/components/hero/HeroCard";
import { QuestForm } from "@/components/quests/QuestForm";
import { QuestList } from "@/components/quests/QuestList";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { useQuests } from "@/hooks/useQuests";
import { useStreakFreeze } from "@/hooks/useStreakFreeze";
import { ghostButtonClass } from "@/lib/styles";

export function Dashboard() {
  const { user, logout } = useAuth();
  const { quests, loading, error, notice, addQuest, completeQuest, removeQuest } = useQuests();
  const { categories, error: categoryError, addCategory } = useCategories();
  const { buy: buyFreeze, buying: buyingFreeze, error: freezeError } = useStreakFreeze();

  if (!user) return null;

  const message = error ?? categoryError ?? freezeError;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quest Todo</h1>
        <button className={ghostButtonClass} onClick={logout}>Keluar</button>
      </header>

      <HeroCard user={user} onBuyFreeze={buyFreeze} buyingFreeze={buyingFreeze} />

      {notice && (
        <p className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800">{notice}</p>
      )}
      {message && <p className="text-sm text-red-600">{message}</p>}

      <CategoryForm onSubmit={addCategory} />
      <QuestForm categories={categories} onSubmit={addQuest} />

      {loading ? (
        <p className="text-sm text-stone-500">Memuat quest...</p>
      ) : (
        <QuestList quests={quests} categories={categories}
          onComplete={completeQuest} onDelete={removeQuest} />
      )}
    </main>
  );
}
