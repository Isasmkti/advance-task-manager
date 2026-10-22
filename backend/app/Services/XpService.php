<?php

namespace App\Services;

use App\Enums\Difficulty;
use App\Models\Quest;
use App\Models\User;
use DateTimeImmutable;
use DateTimeZone;
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

    /** Ambil bagian tanggal (Y-m-d) dari nilai kolom date, atau null. */
    public static function dateString(mixed $value): ?string
    {
        return $value ? substr((string) $value, 0, 10) : null;
    }

    /** Selisih hari kalender antara dua tanggal Y-m-d (to - from). */
    public static function daysBetween(string $from, string $to): int
    {
        $utc = new DateTimeZone('UTC');
        $a = DateTimeImmutable::createFromFormat('!Y-m-d', $from, $utc);
        $b = DateTimeImmutable::createFromFormat('!Y-m-d', $to, $utc);

        return (int) round(($b->getTimestamp() - $a->getTimestamp()) / 86400);
    }

    private static function timezoneOf(User $user): string
    {
        return $user->timezone ?: config('app.timezone');
    }

    /**
     * Streak yang ditampilkan. Hari yang terlewat bisa "ditutup" oleh streak freeze:
     * streak aman kalau jumlah freeze >= jumlah hari yang terlewat; kalau tidak, dianggap putus.
     */
    public static function effectiveStreak(User $user): int
    {
        $last = self::dateString($user->last_completed_on);
        if ($last === null) {
            return 0;
        }

        $today = now(self::timezoneOf($user))->toDateString();
        $gap = self::daysBetween($last, $today);

        if ($gap <= 1) {
            return $user->current_streak;
        }

        return $user->streak_freezes >= $gap - 1 ? $user->current_streak : 0;
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
            'streak_freezes' => $user->streak_freezes,
            'freeze_price' => (int) config('game.freeze_price'),
            'freeze_max' => (int) config('game.freeze_max'),
            'hp' => $user->hp,
            'max_hp' => (int) config('game.hp_max'),
            'sleeping' => $user->hp <= 0,
        ];
    }

    public function calculateReward(Quest $quest, bool $withBonus = true): int
    {
        $xp = Difficulty::from($quest->difficulty)->xp();

        if ($withBonus && $quest->due_at && now()->lte($quest->due_at)) {
            $xp += (int) round($xp * self::EARLY_BONUS);
        }

        return $xp;
    }

    /**
     * Menyelesaikan quest milik user: memberi XP, koin, memperbarui streak
     * (dengan streak freeze otomatis), dan menaikkan level.
     * Kalau HP habis (hero tidur), semua bonus XP (deadline dan streak) hilang hari itu.
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
            $asleep = $hero->hp <= 0;

            // Streak dihitung berdasarkan hari menurut zona waktu user.
            $today = now(self::timezoneOf($hero))->toDateString();
            $last = self::dateString($hero->last_completed_on);
            $freezesUsed = 0;

            if ($last === null) {
                $streak = 1;
            } else {
                $gap = self::daysBetween($last, $today);

                if ($gap <= 0) {
                    $streak = max(1, $hero->current_streak);
                } elseif ($gap === 1) {
                    $streak = $hero->current_streak + 1;
                } else {
                    $missed = $gap - 1;

                    if ($hero->streak_freezes >= $missed) {
                        $freezesUsed = $missed;
                        $streak = $hero->current_streak + 1;
                    } else {
                        $streak = 1;
                    }
                }
            }

            $multiplier = $asleep ? 1.0 : self::streakMultiplier($streak);
            $xp = (int) round($this->calculateReward($quest, ! $asleep) * $multiplier);
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
            $hero->streak_freezes -= $freezesUsed;
            $hero->last_completed_on = $today;
            $hero->save();

            return [
                'quest' => $quest->fresh(),
                'xp_awarded' => $xp,
                'coins_awarded' => $coins,
                'streak_multiplier' => $multiplier,
                'freezes_used' => $freezesUsed,
                'asleep' => $asleep,
                'leveled_up' => $hero->level > $oldLevel,
                'progress' => self::progress($hero),
            ];
        });
    }
}
