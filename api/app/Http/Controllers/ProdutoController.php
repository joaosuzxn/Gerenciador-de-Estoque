<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Http\Requests\StoreProdutoRequest;
use App\Http\Requests\UpdateProdutoRequest;
use App\Http\Resources\ProdutoResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProdutoController extends Controller
{
    public function criarProduto(StoreProdutoRequest $request): JsonResponse
    {
        try {
            $produto = Produto::create([
                'nome' => $request->nome_produto,
                'descricao' => $request->descricao,
                'preco' => $request->preco,
                'quantidade' => $request->quantidade,
            ]);

            return response()->json([
                'id' => $produto->id,
                'nome' => $produto->nome,
                'descricao' => $produto->descricao,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao criar produto (controladorCreateProduct): ' . $e->getMessage()
            ], 500);
        }
    }

    public function listarProdutos(Request $request): JsonResponse
    {
        try {
            $page = $request->query('page', 1);
            $search = $request->query('search');
            $sortBy = $request->query('sortBy', 'nome');
            $sortOrder = $request->query('sortOrder', 'asc');
            $limit = 10;

            $allowedColumns = ['id', 'nome', 'descricao', 'quantidade', 'preco'];
            if (!in_array($sortBy, $allowedColumns)) {
                $sortBy = 'id';
            }

            $sortOrder = strtolower($sortOrder) === 'desc' ? 'desc' : 'asc';

            $query = Produto::select('id', 'nome', 'descricao', 'quantidade', 'preco');

            if ($search && trim($search) !== '') {
                $searchTerm = '%' . trim($search) . '%';
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereRaw('nome ILIKE ?', [$searchTerm])
                      ->orWhereRaw('descricao ILIKE ?', [$searchTerm]);
                });
            }

            $totalItems = $query->count();
            $totalPages = ceil($totalItems / $limit);

            $produtos = $query->orderBy($sortBy, $sortOrder)
                             ->skip(($page - 1) * $limit)
                             ->take($limit)
                             ->get();

            return response()->json([
                'data' => ProdutoResource::collection($produtos),
                'pagination' => [
                    'currentPage' => (int)$page,
                    'pageSize' => $limit,
                    'totalItems' => $totalItems,
                    'totalPages' => $totalPages,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao listar produtos (controladorReadProduct): ' . $e->getMessage()
            ], 500);
        }
    }

    public function buscarProduto(int $id): JsonResponse
    {
        try {
            $produto = Produto::find($id);

            if (!$produto) {
                return response()->json([
                    'message' => 'Produto não encontrado.'
                ], 404);
            }

            return response()->json(
                new ProdutoResource($produto),
                200
            );
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar produto: ' . $e->getMessage()
            ], 500);
        }
    }

    public function atualizarProduto(UpdateProdutoRequest $request, int $id): JsonResponse
    {
        try {
            $produto = Produto::find($id);

            if (!$produto) {
                return response()->json([
                    'message' => 'Produto não encontrado.'
                ], 404);
            }

            $produto->update([
                'nome' => $request->nome_produto,
                'descricao' => $request->descricao,
                'quantidade' => $request->quantidade,
                'preco' => $request->preco,
            ]);

            return response()->json([
                'message' => 'Produto atualizado'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao atualizar produto (controladorUpdateProduct): ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteProduto(int $id): JsonResponse
    {
        try {
            $produto = Produto::find($id);

            if (!$produto) {
                return response()->json([
                    'message' => 'Produto não encontrado.'
                ], 404);
            }

            $produto->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao deletar produto (controladorDeleteProduct): ' . $e->getMessage()
            ], 500);
        }
    }
}

