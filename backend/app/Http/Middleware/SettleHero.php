<?php

namespace App\Http\Middleware;

use App\Services\HeroStateService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Menyelaraskan HP dan penalti hero di setiap request terautentikasi. */
class SettleHero
{
    public function __construct(private HeroStateService $hero)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        if ($user = $request->user()) {
            $this->hero->settle($user);
        }

        return $next($request);
    }
}
