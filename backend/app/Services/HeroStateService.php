<?php

namespace App\Services;

use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Menyelaraskan kondisi hero dengan waktu (secara "lazy", tanpa scheduler):
 *  1. memulihkan HP penuh saat hari berganti (menurut zona waktu user)
 *  2. menerapkan penalti HP untuk quest yang lewat deadline (sekali per quest)
 */
class HeroStateService
{
    public function settle(User $user): void
    {
        DB::transaction(function () use ($user) {
            $hero = User::lockForUpdate()->findOrFail($user->id);

            $tz = $hero->timezone ?: config('app.timezone');
            $today = now($tz)->toDateString();
            $dirty = false;

            // 1. Pemulihan HP harian.
            if (XpService::dateString($hero->hp_date) !== $today) {
                $hero->hp = (int) config('game.hp_max');
                $hero->hp_date = $today;
                $dirty = true;
            }

            // 2. Penalti quest lewat deadline.
            $now = now();
            $startOfToday = now($tz)->startOfDay()->setTimezone(config('app.timezone'));

            $overdue = Quest::where('user_id', $hero->id)
                ->whereNull('completed_at')
                ->whereNull('penalized_at')
                ->where('due_at', '<=', $now);

            // Jatuh tempo sebelum hari ini: HP sudah pulih, cukup ditandai.
            (clone $overdue)
                ->where('due_at', '<', $startOfToday)
                ->update(['penalized_at' => $now]);

            // Jatuh tempo hari ini: kurangi HP hari ini. Update dengan syarat penalized_at null
            // menjamin tiap quest hanya "diklaim" oleh satu request.
            $overdueToday = (clone $overdue)
                ->where('due_at', '>=', $startOfToday)
                ->update(['penalized_at' => $now]);

            if ($overdueToday > 0) {
                $hero->hp = max(0, $hero->hp - $overdueToday * (int) config('game.hp_penalty'));
                $dirty = true;
            }

            if ($dirty) {
                $hero->save();
            }
        });

        $user->refresh();
    }
}
