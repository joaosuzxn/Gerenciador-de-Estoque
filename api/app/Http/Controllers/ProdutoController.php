<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProdutoRequest;
use App\Http\Requests\UpdateProdutoRequest;
use App\Http\Resources\ProdutoResource;
use App\Models\Produto;
use App\Models\ProdutoLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    public function criarProduto(StoreProdutoRequest $request): JsonResponse
    {
        $produto = Produto::create([
            'nome' => (string) $request->input('nome_produto'),
            'descricao' => (string) $request->input('descricao'),
            'preco' => $request->input('preco'),
            'quantidade' => (int) $request->input('quantidade'),
        ]);

        $this->registrarLog(
            $request,
            'criado',
            (int) $produto->id,
            null,
            $this->dadosProduto($produto)
        );

        return response()->json(new ProdutoResource($produto), 201);
    }

    public function listarProdutos(Request $request): JsonResponse
    {
        $page = max((int) $request->query('page', 1), 1);
        $search = trim((string) $request->query('search', ''));
        $sortBy = (string) $request->query('sortBy', 'nome');
        $sortOrder = strtolower((string) $request->query('sortOrder', 'asc')) === 'desc' ? 'desc' : 'asc';
        $limit = 10;

        $allowedColumns = ['id', 'nome', 'descricao', 'quantidade', 'preco'];
        if (!in_array($sortBy, $allowedColumns, true)) {
            $sortBy = 'nome';
        }

        $query = Produto::query();

        if ($search !== '') {
            $term = '%' . mb_strtolower($search) . '%';
            $query->where(function ($builder) use ($term): void {
                $builder
                    ->whereRaw('LOWER(nome) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(descricao) LIKE ?', [$term]);
            });
        }

        $totalItems = $query->count();
        $totalPages = $totalItems === 0 ? 0 : (int) ceil($totalItems / $limit);

        $produtos = $query
            ->orderBy($sortBy, $sortOrder)
            ->forPage($page, $limit)
            ->get();

        return response()->json([
            'data' => ProdutoResource::collection($produtos),
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalItems' => $totalItems,
                'itemsPerPage' => $limit,
            ],
        ]);
    }

    public function buscarProduto(int $id): JsonResponse
    {
        $produto = Produto::find($id);

        if ($produto === null) {
            return response()->json([
                'message' => 'Produto nao encontrado.',
            ], 404);
        }

        return response()->json(new ProdutoResource($produto));
    }

    public function atualizarProduto(UpdateProdutoRequest $request, int $id): JsonResponse
    {
        $produto = Produto::find($id);

        if ($produto === null) {
            return response()->json([
                'message' => 'Produto nao encontrado.',
            ], 404);
        }

        $dadosAnteriores = $this->dadosProduto($produto);

        $produto->update([
            'nome' => (string) $request->input('nome_produto'),
            'descricao' => (string) $request->input('descricao'),
            'preco' => $request->input('preco'),
            'quantidade' => (int) $request->input('quantidade'),
        ]);

        $produtoAtualizado = $produto->fresh();

        $this->registrarLog(
            $request,
            'atualizado',
            (int) $produto->id,
            $dadosAnteriores,
            $this->dadosProduto($produtoAtualizado)
        );

        return response()->json(new ProdutoResource($produtoAtualizado));
    }

    public function deleteProduto(Request $request, int $id): JsonResponse
    {
        $produto = Produto::find($id);

        if ($produto === null) {
            return response()->json([
                'message' => 'Produto nao encontrado.',
            ], 404);
        }

        $dadosAnteriores = $this->dadosProduto($produto);

        $this->registrarLog(
            $request,
            'excluido',
            (int) $produto->id,
            $dadosAnteriores,
            null
        );

        $produto->delete();

        return response()->json(null, 204);
    }

    /**
     * @return array<string, mixed>
     */
    private function dadosProduto(?Produto $produto): array
    {
        if ($produto === null) {
            return [];
        }

        return [
            'id' => $produto->id,
            'nome' => $produto->nome,
            'descricao' => $produto->descricao,
            'quantidade' => $produto->quantidade,
            'preco' => $produto->preco,
        ];
    }

    /**
     * @param  array<string, mixed>|null  $dadosAnteriores
     * @param  array<string, mixed>|null  $dadosNovos
     */
    private function registrarLog(
        Request $request,
        string $acao,
        ?int $produtoId,
        ?array $dadosAnteriores,
        ?array $dadosNovos
    ): void {
        ProdutoLog::query()->create([
            'user_id' => $request->user()?->id,
            'produto_id' => $produtoId,
            'acao' => $acao,
            'dados_anteriores' => $dadosAnteriores,
            'dados_novos' => $dadosNovos,
            'ip_address' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);
    }
}
