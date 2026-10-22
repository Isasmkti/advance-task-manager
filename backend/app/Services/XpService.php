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

    /** Pengali XP dari streak: 3 hari = x1.1, 7 hari = x1.25. */
    public static function streakMultiplier(int $streak): float
    {
        return match (true) {
            $streak >= 7 => 1.25,
            $streak >= 3 => 1.1,
            default => 1.0,
        };
    }

    /** Tanggal (Y-m-d) terakhir user menyelesaikan quest, atau null. */
    private static function lastDate(User $user): ?string
    {
        return $user->last_completed_on
            ? substr((string) $user->last_completed_on, 0, 10)
            : null;
    }

    private static function timezoneOf(User $user): string
    {
        return $user->timezone ?: config('app.timezone');
    }

    /**
     * Streak yang ditampilkan: kalau user tidak menyelesaikan quest
     * kemarin maupun hari ini (menurut zona waktunya), streak dianggap putus.
     */
    public static function effectiveStreak(User $user): int
    {
        $last = self::lastDate($user);
        if ($last === null) {
            return 0;
        }

        $tz = self::timezoneOf($user);
        $today = now($tz)->toDateString();
        $yesterday = now($tz)->subDay()->toDateString();

        return in_array($last, [$today, $yesterday], true) ? $user->current_streak : 0;
    }

    public static function progress(User $user): array
    {
        return [
            'level' => $user->level,
            'total_xp' => $user->total_xp,
            'level_start_xp' => self::xpForLevel($user->level),
            'next_level_xp' => self::xpForLevel($user->level + 1),
            'coins' => $user->coins,
            'current_streak' => self::effectiveStreak($user),
            'longest_streak' => $user->longest_streak,
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
     * Menyelesaikan quest milik user: memberi XP (dengan bonus streak), koin,
     * memperbarui streak, dan menaikkan level. Semua dihitung di server dalam satu transaksi.
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

            // Streak dihitung berdasarkan hari menurut zona waktu user.
            $tz = self::timezoneOf($hero);
            $today = now($tz)->toDateString();
            $yesterday = now($tz)->subDay()->toDateString();
            $last = self::lastDate($hero);

            if ($last === $today) {
                $streak = max(1, $hero->current_streak);
            } elseif ($last === $yesterday) {
                $streak = $hero->current_streak + 1;
            } else {
                $streak = 1;
            }

            $multiplier = self::streakMultiplier($streak);
            $xp = (int) round($this->calculateReward($quest) * $multiplier);
            $coins = Difficulty::from($quest->difficulty)->coins();

            $quest->forceFill([
                'completed_at' => now(),
                'xp_awarded' => $xp,
                'coins_awarded' => $coins,
            ])->save();

            $hero->total_xp += $xp;
            $hero->level = self::levelFor($hero->total_xp);
            $hero->coins += $coins;
            $hero->current_streak = $streak;
            $hero->longest_streak = max($hero->longest_streak, $streak);
            $hero->last_completed_on = $today;
            $hero->save();

            return [
                'quest' => $quest->fresh(),
                'xp_awarded' => $xp,
                'coins_awarded' => $coins,
                'streak_multiplier' => $multiplier,
                'leveled_up' => $hero->level > $oldLevel,
                'progress' => self::progress($hero),
            ];
        });
    }
}
