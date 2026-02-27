<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ProdutoLogController;
use App\Http\Controllers\ProdutoController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::prefix('auth')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    Route::prefix('produto')->group(function (): void {
        Route::get('/logs', [ProdutoLogController::class, 'meusLogs']);
        Route::post('/', [ProdutoController::class, 'criarProduto']);
        Route::get('/', [ProdutoController::class, 'listarProdutos']);
        Route::get('/{id}', [ProdutoController::class, 'buscarProduto']);
        Route::put('/{id}', [ProdutoController::class, 'atualizarProduto']);
        Route::delete('/{id}', [ProdutoController::class, 'deleteProduto']);
    });

    Route::middleware('admin')->prefix('admin')->group(function (): void {
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::get('/produto-logs', [ProdutoLogController::class, 'logsAdmin']);
    });
});
