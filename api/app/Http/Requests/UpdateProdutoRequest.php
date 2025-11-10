<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProdutoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome_produto' => 'required|string|max:255',
            'descricao' => 'required|string',
            'preco' => 'required|numeric|min:0.01',
            'quantidade' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'nome_produto.required' => 'Insira o nome do produto.',
            'nome_produto.string' => 'O nome do produto deve ser um texto.',
            'nome_produto.max' => 'O nome do produto não pode ter mais de 255 caracteres.',
            'descricao.required' => 'Insira a descrição do produto.',
            'descricao.string' => 'A descrição deve ser um texto.',
            'preco.required' => 'Insira um preço válido.',
            'preco.numeric' => 'O preço deve ser um número.',
            'preco.min' => 'Insira um preço válido.',
            'quantidade.required' => 'Insira uma quantidade válida.',
            'quantidade.integer' => 'A quantidade deve ser um número inteiro.',
            'quantidade.min' => 'Insira uma quantidade válida.',
        ];
    }
}
