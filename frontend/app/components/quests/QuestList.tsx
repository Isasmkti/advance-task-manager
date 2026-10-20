import { QuestItem } from "./QuestItem";
import type { Category, Quest } from "@/types";

interface Props {
  quests: Quest[];
  categories: Category[];
  onComplete: (id: number) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
}

export function QuestList({ quests, categories, onComplete, onDelete }: Props) {
  const nameOf = (id: number | null) => categories.find((c) => c.id === id)?.name;
  const active = quests.filter((q) => !q.completed_at);
  const done = quests.filter((q) => q.completed_at);

  const renderList = (items: Quest[]) => (
    <ul className="space-y-2">
      {items.map((q) => (
        <QuestItem key={q.id} quest={q} categoryName={nameOf(q.category_id)}
          onComplete={onComplete} onDelete={onDelete} />
      ))}
    </ul>
  );

  return (
 <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-stone-700">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500 shadow-[1px_1px_0px_#1c1917]" />
          Quest Aktif ({active.length})
        </h2>
        {active.length ? (
          renderList(active)
        ) : (
          <div className="rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 p-6 text-center text-sm font-medium text-stone-500">
            Belum ada quest aktif. Yuk, buat quest pertamamu! ✨
          </div>
        )}
      </section>

      {done.length > 0 && (
        <section className="space-y-3 pt-4 border-t-2 border-stone-100">
          <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-stone-500">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[1px_1px_0px_#1c1917]" />
            Selesai ({done.length})
          </h2>
          {renderList(done)}
        </section>
      )}
   </div>
  );
}
