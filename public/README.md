# Frontend - Gerenciador de Estoque

Frontend em HTML/CSS/JavaScript consumindo a API Laravel.

## Paginas

- `login.html` -> autenticacao
- `index.html` -> estoque (CRUD de produtos)
- `admin.html` -> cadastro/lista de usuarios (somente admin)
- `logs.html` -> historico de logs de produtos

## Requisitos

- API rodando em `http://127.0.0.1:8000`
- Navegador moderno

## Como usar

1. Suba a API:

```bash
cd api
php artisan serve --host=127.0.0.1 --port=8000
```

2. Abra no navegador:
- `public/login.html`

## Configuracao da API

Arquivo: `public/config.js`

```js
window.APP_CONFIG = {
  API_BASE_URL: 'http://localhost:8000/api',
  API_URL: 'http://localhost:8000/api/produto',
};
```

## Funcionalidades de UI

- Busca por nome/descricao
- Ordenacao por colunas
- Paginacao
- Modal de criacao/edicao/exclusao
- Botao de logout com confirmacao
- Controle de botoes por perfil:
  - `Admin` so para admin
  - `Logs` para usuario autenticado

## Endpoints consumidos

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/produto`
- `GET /api/produto/{id}`
- `POST /api/produto`
- `PUT /api/produto/{id}`
- `DELETE /api/produto/{id}`
- `GET /api/produto/logs`
- `GET /api/admin/users` (admin)
- `POST /api/admin/users` (admin)
- `GET /api/admin/produto-logs` (admin)

## Troubleshooting

### Tela nao carrega dados
- Confirme API online em `127.0.0.1:8000`
- Verifique console do navegador (F12)

### 401 (nao autorizado)
- Sessao/token expirado
- Faca login novamente
