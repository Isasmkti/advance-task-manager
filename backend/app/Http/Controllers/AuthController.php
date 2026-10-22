<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\HeroStateService;
use App\Services\XpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private HeroStateService $hero)
    {
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'timezone' => ['nullable', 'timezone'],
        ]);

        $user = new User([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
        $user->timezone = $data['timezone'] ?? 'Asia/Jakarta';
        $user->save();

        $this->hero->settle($user);

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $this->payload($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Pastikan HP dan penalti sudah mutakhir sebelum data hero dikirim.
        $this->hero->settle($user);

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $this->payload($user),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    public function me(Request $request)
    {
        return $this->payload($request->user());
    }

    /** PUT /me: ubah zona waktu (menentukan pergantian hari untuk streak dan HP). */
    public function update(Request $request)
    {
        $data = $request->validate([
            'timezone' => ['required', 'timezone'],
        ]);

        $user = $request->user();
        $user->timezone = $data['timezone'];
        $user->save();

        return $this->payload($user);
    }

    private function payload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'timezone' => $user->timezone,
            ...XpService::progress($user),
        ];
    }
}
