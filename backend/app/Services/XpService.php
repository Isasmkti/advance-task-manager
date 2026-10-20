<?php

namespace App\Services;

use App\Enums\Difficulty;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class XpService
{
    /** Level 2 = 50 XP, level 3 = 200 XP, level 4 = 450 XP, dst. */
    private const LEVEL_BASE = 50;

    /** Bonus 20% kalau quest selesai sebelum due_at. */
    private const EARLY_BONUS = 0.2;

    public static function levelFor(int $xp): int
    {
        return (int) floor(sqrt($xp / self::LEVEL_BASE)) + 1;
    }

    public static function xpForLevel(int $level): int
    {
        return self::LEVEL_BASE * (($level - 1) ** 2);
    }

    public static function progress(User $user): array
    {
        return [
            'level' => $user->level,
            'total_xp' => $user->total_xp,
            'level_start_xp' => self::xpForLevel($user->level),
            'next_level_xp' => self::xpForLevel($user->level + 1),
        ];
    }

    public function calculateReward(Quest $quest): int
    {
        $xp = Difficulty::from($quest->difficulty)->xp();

        if ($quest->due_at && now()->lte($quest->due_at)) {
            $xp += (int) round($xp * self::EARLY_BONUS);
        }

        return $xp;
    }

    /**
     * Menyelesaikan quest milik user, memberi XP, dan menaikkan level.
     * Semua perhitungan dilakukan di server dalam satu transaksi.
     */
    public function complete(User $user, int $questId): array
    {
        return DB::transaction(function () use ($user, $questId) {
            $quest = Quest::where('user_id', $user->id)
                ->lockForUpdate()
                ->findOrFail($questId);

            if ($quest->completed_at) {
                abort(422, 'Quest ini sudah diselesaikan.');
            }

            $hero = User::lockForUpdate()->findOrFail($user->id);
            $oldLevel = $hero->level;
            $xp = $this->calculateReward($quest);

            $quest->forceFill([
                'completed_at' => now(),
                'xp_awarded' => $xp,
            ])->save();

            $hero->total_xp += $xp;
            $hero->level = self::levelFor($hero->total_xp);
            $hero->save();

            return [
                'quest' => $quest->fresh(),
                'xp_awarded' => $xp,
                'leveled_up' => $hero->level > $oldLevel,
                'progress' => self::progress($hero),
            ];
        });
    }
}
