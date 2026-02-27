# Gerenciador de Estoque

Sistema web para controle de estoque com backend em Laravel e frontend em HTML/CSS/JavaScript.

## Stack

- API Laravel 10 (PHP 8.1+)
- PostgreSQL
- Laravel Sanctum (autenticacao por token)
- Frontend sem framework

## Funcionalidades

- Login e logout
- CRUD de produtos
- Busca, ordenacao e paginacao de produtos
- Controle de acesso por perfil (`admin` e usuario comum)
- Cadastro de usuarios (somente admin)
- Auditoria de produtos (`criado`, `atualizado`, `excluido`)

## Estrutura do projeto

```text
Gerenciador-de-Estoque-main/
|- api/      # Backend Laravel
|- public/   # Frontend
```

## Pre-requisitos

- PHP 8.1+
- Composer
- PostgreSQL

## Como executar

1. Entre na pasta da API:

```bash
cd api
```

2. Instale as dependencias:

```bash
composer install
```

3. Configure o ambiente:

- Copie `.env.example` para `.env` (se necessario).
- Ajuste as variaveis de banco no `.env`:
  - `DB_CONNECTION=pgsql`
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=5432`
  - `DB_DATABASE=seu_banco`
  - `DB_USERNAME=seu_usuario`
  - `DB_PASSWORD=sua_senha`

4. Gere a chave da aplicacao e rode migracoes + seed:

```bash
php artisan key:generate
php artisan migrate --seed
```

5. Suba a API:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

6. Abra o frontend:

- Abra `public/login.html` no navegador.

## Credenciais padrao (seed)

- Email: `admin@estoque.local`
- Senha: `12345678`

Altere essa senha em ambiente real.

## Configuracao do frontend

Arquivo: `public/config.js`

```js
window.APP_CONFIG = {
  API_BASE_URL: 'http://localhost:8000/api',
  API_URL: 'http://localhost:8000/api/produto',
};
```

## Paginas

- `public/login.html`: login
- `public/index.html`: produtos
- `public/admin.html`: usuarios (somente admin)
- `public/logs.html`: logs

## Endpoints principais

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/produto`
- `POST /api/produto`
- `PUT /api/produto/{id}`
- `DELETE /api/produto/{id}`
- `GET /api/produto/logs`
- `GET /api/admin/users` (admin)
- `POST /api/admin/users` (admin)
- `GET /api/admin/produto-logs` (admin)

## Troubleshooting

### Erro `could not find driver (pgsql)`

No `php.ini`, habilite:

- `extension=pdo_pgsql`
- `extension=pgsql`

Depois reinicie o servidor da API.

### Erro 401 no frontend

- Token expirado ou invalido
- Faca login novamente

### API nao responde

- Confirme se a API esta rodando em `http://127.0.0.1:8000`
- Confirme se `public/config.js` aponta para a URL correta
