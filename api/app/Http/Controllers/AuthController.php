<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $email = mb_strtolower(trim((string) $request->input('email')));
        $password = (string) $request->input('password');

        $user = User::query()
            ->whereRaw('LOWER(email) = ?', [$email])
            ->first();

        if ($user === null) {
            return response()->json([
                'message' => 'Email ou senha invalidos.',
            ], 401);
        }

        $isValid = Hash::check($password, (string) $user->password);

        // Compatibilidade com usuarios criados antes do hash da senha.
        if (!$isValid && hash_equals((string) $user->password, $password)) {
            $user->password = Hash::make($password);
            $user->save();
            $isValid = true;
        }

        if (!$isValid) {
            return response()->json([
                'message' => 'Email ou senha invalidos.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => (bool) $user->is_admin,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso.',
        ]);
    }
}
