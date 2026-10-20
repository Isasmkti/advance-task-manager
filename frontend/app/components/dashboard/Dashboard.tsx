"use client";

import { CategoryForm } from "@/components/categories/CategoryForm";
import { HeroCard } from "@/components/hero/HeroCard";
import { QuestForm } from "@/components/quests/QuestForm";
import { QuestList } from "@/components/quests/QuestList";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { useQuests } from "@/hooks/useQuests";
import { ghostButtonClass } from "@/lib/styles";

export function Dashboard() {
  const { user, logout } = useAuth();
  const { quests, loading, error, notice, addQuest, completeQuest, removeQuest } = useQuests();
  const { categories, error: categoryError, addCategory } = useCategories();

  if (!user) return null;

  const message = error ?? categoryError;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6 font-sans text-stone-900">
      <header className="flex items-center justify-between border-b-2 border-stone-800 pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
          Quest <span className="text-amber-600">Todo</span>
        </h1>
        <button className={ghostButtonClass} onClick={logout}>
          Keluar
        </button>
      </header>

      <HeroCard user={user} />

      {notice && (
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-[2px_2px_0px_#f59e0b]">
          {notice}
        </div>
      )}

      {message && (
        <div className="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900 shadow-[2px_2px_0px_#ef4444]">
          {message}
        </div>
      )}

      <div className="space-y-4 rounded-xl border-2 border-stone-800 bg-white p-5 shadow-[3px_3px_0px_#1c1917]">
        <CategoryForm onSubmit={addCategory} />
        <div className="my-2 border-t border-dashed border-stone-200" />
        <QuestForm categories={categories} onSubmit={addQuest} />
      </div>

      <div className="space-y-3 rounded-xl border-2 border-stone-800 bg-white p-5 shadow-[3px_3px_0px_#1c1917]">
        <h2 className="text-base font-bold text-stone-900">Daftar Quest</h2>
        {loading ? (
          <div className="py-8 text-center text-sm font-medium text-stone-500 animate-pulse">
            Memuat quest...
          </div>
        ) : (
          <QuestList 
            quests={quests} 
            categories={categories}
            onComplete={completeQuest} 
            onDelete={removeQuest} 
          />
        )}
      </div>
    </main>
  );
}