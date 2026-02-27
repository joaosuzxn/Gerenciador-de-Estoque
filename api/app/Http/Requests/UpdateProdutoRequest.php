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
            'nome_produto' => ['required', 'string', 'max:255'],
            'descricao' => ['required', 'string'],
            'quantidade' => ['required', 'integer', 'min:0'],
            'preco' => ['required', 'numeric', 'min:0.01'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome_produto.required' => 'Insira o nome do produto.',
            'nome_produto.max' => 'O nome do produto deve ter no maximo 255 caracteres.',
            'descricao.required' => 'Insira a descricao do produto.',
            'quantidade.required' => 'Insira uma quantidade valida.',
            'quantidade.integer' => 'A quantidade deve ser um numero inteiro.',
            'quantidade.min' => 'A quantidade nao pode ser negativa.',
            'preco.required' => 'Insira um preco valido.',
            'preco.numeric' => 'O preco deve ser numerico.',
            'preco.min' => 'O preco deve ser maior que zero.',
        ];
    }
}
