# API Laravel - CRUD de Produtos

API REST desenvolvida em Laravel para gerenciamento de produtos. Esta é a implementação em Laravel da API Express original.

## 📋 Endpoints

Todos os endpoints estão disponíveis em `/api/produto`:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **POST** | `http://localhost:8000/api/produto` | Criar novo produto |
| **GET** | `http://localhost:8000/api/produto` | Listar produtos (com paginação, busca e ordenação) |
| **GET** | `http://localhost:8000/api/produto/{id}` | Buscar produto específico |
| **PUT** | `http://localhost:8000/api/produto/{id}` | Atualizar produto existente |
| **DELETE** | `http://localhost:8000/api/produto/{id}` | Deletar produto |

### Parâmetros de Query (GET /api/produto)

- `page` (opcional): Número da página (padrão: 1)
- `search` (opcional): Termo de busca (busca em nome e descrição)
- `sortBy` (opcional): Coluna para ordenação (`nome`, `descricao`, `quantidade`, `preco`)
- `sortOrder` (opcional): Direção da ordenação (`asc` ou `desc`)

**Exemplo:**
```
GET /api/produto?page=1&search=notebook&sortBy=nome&sortOrder=asc
```

### Estrutura de Requisição (POST/PUT)

```json
{
  "nome_produto": "Nome do Produto",
  "descricao": "Descrição do produto",
  "quantidade": 10,
  "preco": 99.90
}
```

### Estrutura de Resposta (GET - Listagem)

```json
{
  "data": [
    {
      "id": 1,
      "nome": "Produto Exemplo",
      "descricao": "Descrição do produto",
      "quantidade": 10,
      "preco": "99.90",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

## 🚀 Configuração

### Pré-requisitos

- PHP >= 8.1
- Composer
- PostgreSQL
- Laravel 10.x

### Instalação

1. **Instale as dependências:**
```bash
composer install
```

2. **Configure o arquivo `.env`:**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Configure a conexão com o banco de dados no `.env`:**
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=produtos
DB_USERNAME=postgres
DB_PASSWORD=Jj212230
```

4. **Execute as migrations:**
```bash
php artisan migrate
```

5. **Inicie o servidor:**
```bash
php artisan serve
```

A API estará disponível em `http://localhost:8000`

### Configuração do CORS

O CORS está configurado para permitir requisições de qualquer origem. Para ajustar, edite o arquivo `config/cors.php`.

## 📁 Estrutura do Projeto

```
api/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── ProdutoController.php    # Controller principal
│   └── Models/
│       └── Produto.php                  # Model do produto
├── database/
│   └── migrations/
│       └── *_create_produtos_table.php  # Migration da tabela
├── routes/
│   └── api.php                          # Rotas da API
├── config/
│   └── cors.php                         # Configuração CORS
└── README.md
```

## ✨ Funcionalidades

- ✅ **CORS habilitado** para todas as origens
- ✅ **Validação de dados** nos endpoints (Request Validation)
- ✅ **Paginação** na listagem (10 itens por página)
- ✅ **Busca** por nome ou descrição
- ✅ **Ordenação** por colunas (nome, descrição, quantidade, preço)
- ✅ **Tratamento de erros** padronizado
- ✅ **Endpoints abertos** (sem autenticação)
- ✅ **Respostas JSON** padronizadas
- ✅ **Validação de tipos** e valores

## 🔍 Validação

### Regras de Validação

- `nome_produto`: obrigatório, string, máximo 255 caracteres
- `descricao`: obrigatório, string
- `quantidade`: obrigatório, integer, mínimo 0
- `preco`: obrigatório, numeric, mínimo 0.01

### Exemplo de Resposta de Erro

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "nome_produto": ["O campo nome do produto é obrigatório."],
    "preco": ["O campo preço deve ser um número válido."]
  }
}
```

## 🧪 Testes

Para executar os testes:

```bash
php artisan test
```

Ou usando PHPUnit diretamente:

```bash
./vendor/bin/phpunit
```

## 📊 Estrutura do Banco de Dados

### Tabela: `produtos`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | bigint | Chave primária (auto-increment) |
| `nome` | varchar(255) | Nome do produto |
| `descricao` | text | Descrição do produto |
| `quantidade` | integer | Quantidade em estoque |
| `preco` | decimal(10,2) | Preço do produto |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

## 🔧 Comandos Úteis

```bash
# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Recriar banco de dados
php artisan migrate:fresh

# Ver rotas disponíveis
php artisan route:list

# Executar em modo de desenvolvimento com hot reload
php artisan serve --host=0.0.0.0 --port=8000
```

## 🐛 Troubleshooting

### Erro de conexão com banco de dados

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `php artisan tinker` e depois `DB::connection()->getPdo();`

### Erro 500 (Internal Server Error)

- Verifique os logs em `storage/logs/laravel.log`
- Execute `php artisan config:clear`
- Verifique as permissões da pasta `storage`

### Erro de CORS

- Verifique se o middleware `HandleCors` está ativo em `bootstrap/app.php`
- Confirme a configuração em `config/cors.php`
- Limpe o cache: `php artisan config:clear`

## 📝 Notas

- A API não requer autenticação (endpoints públicos)
- Todas as respostas são em formato JSON
- A paginação padrão é de 10 itens por página
- A busca é case-insensitive e busca em `nome` e `descricao`

## 🔗 Dependências Principais

- Laravel Framework 10.x
- PostgreSQL Driver (pgsql)
- Composer (gerenciador de dependências)

## 📄 Licença

Este projeto faz parte do sistema de controle de estoque.

