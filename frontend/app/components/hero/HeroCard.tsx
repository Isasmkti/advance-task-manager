import type { User } from "@/types";

export function HeroCard({ user }: { user: User }) {
  const span = user.next_level_xp - user.level_start_xp;
  const gained = user.total_xp - user.level_start_xp;
  const percent = span > 0 ? Math.min(100, Math.max(0, (gained / span) * 100)) : 0;

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <span className="text-sm font-medium text-amber-700">Level {user.level}</span>
      </div>

      <div
        className="mt-3 h-3 overflow-hidden rounded-full bg-stone-200"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-amber-500 transition-all" style={{ width: `${percent}%` }} />
      </div>

      <p className="mt-1 text-xs text-stone-500">
        {user.total_xp} XP · {user.next_level_xp - user.total_xp} XP lagi ke level {user.level + 1}
      </p>

      <div className="mt-3 flex gap-6 text-sm">
        <p>
          <span className="font-semibold">{user.current_streak}</span> hari streak
          <span className="text-stone-400"> (terbaik {user.longest_streak})</span>
        </p>
        <p>
          <span className="font-semibold">{user.coins}</span> koin
        </p>
      </div>
    </section>
  );
}
