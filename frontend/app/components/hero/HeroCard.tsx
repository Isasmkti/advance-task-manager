import type { User } from "@/types";

export function HeroCard({ user }: { user: User }) {
  const span = user.next_level_xp - user.level_start_xp;
  const gained = user.total_xp - user.level_start_xp;
  const percent = span > 0 ? Math.min(100, Math.max(0, (gained / span) * 100)) : 0;

  return (
    <section className="rounded-xl border-2 border-stone-800 bg-amber-50/40 p-4 shadow-[3px_3px_0px_#1c1917] transition-all">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-bold tracking-tight text-stone-900">{user.name}</h2>
        <span className="inline-flex items-center rounded-md border border-amber-300 bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900 shadow-sm">
          Lv. {user.level}
        </span>
      </div>

      <div
        className="mt-3.5 h-3.5 overflow-hidden rounded-full border border-stone-800 bg-stone-100 p-0.5 shadow-inner"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div 
          className="h-full rounded-full bg-amber-500 transition-all duration-500 ease-out" 
          style={{ width: `${percent}%` }} 
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs font-medium text-stone-600">
        <span>{user.total_xp} XP</span>
        <span className="text-amber-800 font-semibold">
          {user.next_level_xp - user.total_xp} XP lagi ke Lv. {user.level + 1}
        </span>
      </div>
    </section>
  );
}