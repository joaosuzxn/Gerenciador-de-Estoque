# API Laravel - Gerenciador de Estoque

API REST com autenticacao e auditoria para o sistema de estoque.

## Stack

- PHP 8.1+
- Laravel 10
- PostgreSQL
- Laravel Sanctum (token)

## Como executar

```bash
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

## Banco (tabelas)

- `users`
- `produtos`
- `produto_logs`
- `personal_access_tokens`
- `migrations`

## Autenticacao

### Login
`POST /api/auth/login`

Body:
```json
{
  "email": "admin@estoque.local",
  "password": "12345678"
}
```

### Usuario autenticado
`GET /api/auth/me`

### Logout
`POST /api/auth/logout`

> Rotas protegidas exigem header:
> `Authorization: Bearer <token>`

## Produtos

Base: `/api/produto`

- `GET /` -> lista (paginacao/busca/ordenacao)
- `GET /{id}` -> detalhe
- `POST /` -> cria
- `PUT /{id}` -> atualiza
- `DELETE /{id}` -> exclui

Query params na listagem:
- `page`
- `search`
- `sortBy` (`id`, `nome`, `descricao`, `quantidade`, `preco`)
- `sortOrder` (`asc`, `desc`)

## Usuarios (admin)

Base: `/api/admin/users`

- `GET /api/admin/users` -> listar usuarios
- `POST /api/admin/users` -> criar usuario

Body de criacao:
```json
{
  "name": "Novo Usuario",
  "email": "novo@email.com",
  "password": "123456",
  "is_admin": false
}
```

## Logs de produtos

### Logs do usuario autenticado
`GET /api/produto/logs`

### Logs gerais (admin)
`GET /api/admin/produto-logs`

Filtros opcionais:
- `acao` (`criado`, `atualizado`, `excluido`)
- `user_id` (somente no endpoint admin)

## Credencial padrao

Seed cria:
- Email: `admin@estoque.local`
- Senha: `12345678`

## Troubleshooting

### `could not find driver (pgsql)`
No `php.ini` habilite:
- `extension=pdo_pgsql`
- `extension=pgsql`

Depois reinicie o servidor.

### Conferir rotas
```bash
php artisan route:list
```

### Ver logs de erro
Arquivo:
- `storage/logs/laravel.log`
