<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdutoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('produto')->group(function () {
    Route::post('/', [ProdutoController::class, 'criarProduto']);
    Route::get('/', [ProdutoController::class, 'listarProdutos']);
    Route::get('/{id}', [ProdutoController::class, 'buscarProduto']);
    Route::put('/{id}', [ProdutoController::class, 'atualizarProduto']);
    Route::delete('/{id}', [ProdutoController::class, 'deleteProduto']);
});

