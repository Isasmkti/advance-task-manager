import { DIFFICULTIES } from "@/lib/constants";
import { ghostButtonClass } from "@/lib/styles";
import type { Quest } from "@/types";

interface Props {
  quest: Quest;
  categoryName?: string;
  onComplete: (id: number) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
}

export function QuestItem({ quest, categoryName, onComplete, onDelete }: Props) {
  const done = Boolean(quest.completed_at);
  const difficulty = DIFFICULTIES.find((d) => d.value === quest.difficulty);
  const overdue = !done && quest.due_at !== null && new Date(quest.due_at) < new Date();

  return (
    <li className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-3">
      <div className="min-w-0 flex-1">
        <p className={done ? "truncate text-stone-400 line-through" : "truncate font-medium"}>
          {quest.title}
        </p>
        <p className="text-xs text-stone-500">
          {difficulty?.label}
          {categoryName && ` · ${categoryName}`}
          {quest.due_at && ` · deadline ${new Date(quest.due_at).toLocaleString("id-ID")}`}
          {done && quest.xp_awarded !== null && ` · +${quest.xp_awarded} XP`}
          {overdue && <span className="text-red-600"> · lewat deadline</span>}
        </p>
      </div>

      {!done && (
        <button className={ghostButtonClass} onClick={() => onComplete(quest.id)}>Selesai</button>
      )}
      <button className={ghostButtonClass} onClick={() => onDelete(quest.id)} aria-label="Hapus quest">
        Hapus
      </button>
    </li>
  );
}
