<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\XpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StreakFreezeController extends Controller
{
    /** POST /streak-freezes: beli satu streak freeze dengan koin. */
    public function store(Request $request)
    {
        $price = (int) config('game.freeze_price');
        $max = (int) config('game.freeze_max');

        $progress = DB::transaction(function () use ($request, $price, $max) {
            $hero = User::lockForUpdate()->findOrFail($request->user()->id);

            if ($hero->streak_freezes >= $max) {
                abort(422, "Streak freeze sudah penuh (maks {$max}).");
            }

            if ($hero->coins < $price) {
                abort(422, "Koin tidak cukup (butuh {$price}).");
            }

            $hero->coins -= $price;
            $hero->streak_freezes += 1;
            $hero->save();

            return XpService::progress($hero);
        });

        return response()->json($progress);
    }
}
