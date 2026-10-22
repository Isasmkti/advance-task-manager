<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\QuestController;
use App\Http\Controllers\StreakFreezeController;
use App\Http\Middleware\SettleHero;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// SettleHero berjalan setelah auth: memulihkan HP harian dan menerapkan penalti quest terlambat.
Route::middleware(['auth:sanctum', SettleHero::class])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'update']);

    Route::post('/streak-freezes', [StreakFreezeController::class, 'store']);

    Route::apiResource('categories', CategoryController::class)->except(['show']);

    Route::apiResource('quests', QuestController::class);
    Route::post('/quests/{id}/complete', [QuestController::class, 'complete']);
});
