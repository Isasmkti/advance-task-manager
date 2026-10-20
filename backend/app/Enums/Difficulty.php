<?php

namespace App\Enums;

enum Difficulty: string
{
    case Easy = 'easy';
    case Medium = 'medium';
    case Hard = 'hard';
    case Epic = 'epic';

    /** XP dasar per tingkat kesulitan. */
    public function xp(): int
    {
        return match ($this) {
            self::Easy => 10,
            self::Medium => 25,
            self::Hard => 50,
            self::Epic => 100,
        };
    }
}
