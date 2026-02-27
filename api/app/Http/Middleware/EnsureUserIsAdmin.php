<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null || $user->is_admin !== true) {
            return response()->json([
                'message' => 'Acesso restrito ao administrador.',
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
