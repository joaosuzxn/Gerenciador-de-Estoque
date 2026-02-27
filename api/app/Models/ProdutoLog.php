<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProdutoLog extends Model
{
    protected $table = 'produto_logs';

    protected $fillable = [
        'user_id',
        'produto_id',
        'acao',
        'dados_anteriores',
        'dados_novos',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'dados_anteriores' => 'array',
        'dados_novos' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function produto(): BelongsTo
    {
        return $this->belongsTo(Produto::class);
    }
}
