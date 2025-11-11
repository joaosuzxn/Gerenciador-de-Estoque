## Controle de Estoque

Frontend para gerenciamento de produtos conectado à API Laravel.

## 🚀 Como Iniciar o Aplicativo

Para iniciar o aplicativo, siga estes passos:

```bash
# 1. Instalar dependências do Laravel
cd api
composer install

# 2. Iniciar o servidor da API
php artisan serve
```

A API estará disponível em `http://localhost:8000`

**3. Abra o frontend**

Abra o arquivo `public/index.html` diretamente no navegador.

## Configuração

O frontend está configurado para se conectar à API Laravel em:
- **URL da API**: `http://localhost:8000/api/produto`

## Funcionalidades

- ✅ Listar produtos com paginação
- ✅ Buscar produtos por nome ou descrição
- ✅ Criar novo produto
- ✅ Editar produto existente
- ✅ Excluir produto
- ✅ Notificações de sucesso/erro

## Estrutura

```
app/
├── public/
│   ├── index.html      # Página principal
│   ├── app.js          # Lógica JavaScript
│   ├── style.css       # Estilos
│   └── config.js       # Configuração da API (opcional)
└── README.md
```

## Endpoints utilizados

- `GET /api/produto?page=1&search=termo` - Listar produtos
- `POST /api/produto` - Criar produto
- `PUT /api/produto/{id}` - Atualizar produto
- `DELETE /api/produto/{id}` - Deletar produto

## Alterar URL da API

Se precisar alterar a URL da API, edite o arquivo `public/app.js` na linha 4:

```javascript
const API_URL = 'http://localhost:8000/api/produto';
```

Ou use o arquivo `config.js` (se implementado).

## Troubleshooting

### Erro de CORS
Se aparecer erro de CORS, verifique se:
1. A API Laravel está rodando
2. O CORS está configurado no Laravel (`config/cors.php`)
3. O middleware HandleCors está ativo

### Erro de conexão
- Verifique se a API está rodando na porta 8000
- Verifique se a URL está correta no `app.js`
- Abra o console do navegador (F12) para ver erros detalhados

