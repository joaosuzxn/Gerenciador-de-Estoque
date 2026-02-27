<?php

namespace App\Http\Controllers;

use App\Models\ProdutoLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProdutoLogController extends Controller
{
    public function meusLogs(Request $request): JsonResponse
    {
        return $this->listarLogs($request, false);
    }

    public function logsAdmin(Request $request): JsonResponse
    {
        return $this->listarLogs($request, true);
    }

    private function listarLogs(Request $request, bool $admin): JsonResponse
    {
        $page = max((int) $request->query('page', 1), 1);
        $limit = 20;
        $acao = trim((string) $request->query('acao', ''));
        $userIdFiltro = (int) $request->query('user_id', 0);

        $query = ProdutoLog::query()
            ->with([
                'user:id,name,email',
                'produto:id,nome',
            ]);

        if (!$admin) {
            $query->where('user_id', $request->user()?->id);
        } elseif ($userIdFiltro > 0) {
            $query->where('user_id', $userIdFiltro);
        }

        if ($acao !== '') {
            $query->where('acao', $acao);
        }

        $totalItems = (clone $query)->count();
        $totalPages = $totalItems === 0 ? 0 : (int) ceil($totalItems / $limit);

        $logs = $query
            ->orderByDesc('id')
            ->forPage($page, $limit)
            ->get();

        return response()->json([
            'data' => $logs,
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalItems' => $totalItems,
                'itemsPerPage' => $limit,
            ],
        ]);
    }
}
