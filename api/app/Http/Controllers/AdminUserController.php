<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'is_admin', 'created_at'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'data' => $users,
        ]);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $email = mb_strtolower(trim((string) $request->input('email')));

        $user = User::query()->create([
            'name' => (string) $request->input('name'),
            'email' => $email,
            'password' => Hash::make((string) $request->input('password')),
            'is_admin' => (bool) $request->boolean('is_admin'),
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
            'created_at' => $user->created_at,
        ], 201);
    }
}
