import { ghostButtonClass } from "@/lib/styles";
import type { User } from "@/types";

interface Props {
  user: User;
  onBuyFreeze: () => void;
  buyingFreeze?: boolean;
}

export function HeroCard({ user, onBuyFreeze, buyingFreeze = false }: Props) {
  const span = user.next_level_xp - user.level_start_xp;
  const gained = user.total_xp - user.level_start_xp;
  const xpPercent = span > 0 ? Math.min(100, Math.max(0, (gained / span) * 100)) : 0;
  const hpPercent = user.max_hp > 0 ? Math.min(100, Math.max(0, (user.hp / user.max_hp) * 100)) : 0;

  const canBuyFreeze =
    !buyingFreeze && user.coins >= user.freeze_price && user.streak_freezes < user.freeze_max;

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <span className="text-sm font-medium text-amber-700">Level {user.level}</span>
      </div>

      <div
        className="mt-3 h-3 overflow-hidden rounded-full bg-stone-200"
        role="progressbar"
        aria-label="XP"
        aria-valuenow={Math.round(xpPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-amber-500 transition-all" style={{ width: `${xpPercent}%` }} />
      </div>
      <p className="mt-1 text-xs text-stone-500">
        {user.total_xp} XP · {user.next_level_xp - user.total_xp} XP lagi ke level {user.level + 1}
      </p>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200"
        role="progressbar"
        aria-label="HP"
        aria-valuenow={user.hp}
        aria-valuemin={0}
        aria-valuemax={user.max_hp}
      >
        <div className="h-full bg-rose-400 transition-all" style={{ width: `${hpPercent}%` }} />
      </div>
      <p className="mt-1 text-xs text-stone-500">
        HP {user.hp}/{user.max_hp} · pulih penuh tiap hari
      </p>

      {user.sleeping && (
        <p className="mt-2 rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-600">
          Hero sedang tidur karena HP habis. Bonus XP hilang sampai besok.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <p>
          <span className="font-semibold">{user.current_streak}</span> hari streak
          <span className="text-stone-400"> (terbaik {user.longest_streak})</span>
        </p>
        <p>
          <span className="font-semibold">{user.coins}</span> koin
        </p>
        <p className="flex items-center gap-2">
          <span>
            <span className="font-semibold">{user.streak_freezes}</span>/{user.freeze_max} freeze
          </span>
          <button className={ghostButtonClass} onClick={onBuyFreeze} disabled={!canBuyFreeze}>
            Beli ({user.freeze_price} koin)
          </button>
        </p>
      </div>
    </section>
  );
}
