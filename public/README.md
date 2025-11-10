# Frontend - Controle de Estoque

Interface web para gerenciamento de produtos, desenvolvida em JavaScript vanilla, conectada à API Laravel.

## 📋 Funcionalidades

- ✅ **Listagem de produtos** com paginação (10 itens por página)
- ✅ **Busca em tempo real** por nome ou descrição (com debounce de 50ms)
- ✅ **Ordenação** por colunas (nome, descrição, quantidade, preço)
- ✅ **Criar novo produto** através de modal
- ✅ **Editar produto** existente
- ✅ **Excluir produto** com confirmação
- ✅ **Validação de formulários** (frontend e backend)
- ✅ **Notificações** de sucesso/erro
- ✅ **Barra de loading** durante requisições
- ✅ **Formatação de moeda** em Real (R$)
- ✅ **Design responsivo** e moderno
- ✅ **Feedback visual** para ações do usuário

## 🚀 Como usar

### Pré-requisitos

- API Laravel rodando em `http://localhost:8000`
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

### Opção 1: Abrir diretamente no navegador

1. Certifique-se de que a API está rodando:
```bash
cd api
php artisan serve
```

2. Abra o arquivo `index.html` diretamente no navegador:
   - Navegue até a pasta `public`
   - Clique duas vezes em `index.html`

### Opção 2: Usar servidor local (recomendado)

#### Com Python:
```bash
cd public
python -m http.server 3000
```

#### Com Node.js (http-server):
```bash
cd public
npx http-server -p 3000
```

#### Com PHP:
```bash
cd public
php -S localhost:3000
```

Depois acesse: `http://localhost:3000`

## 📁 Estrutura de Arquivos

```
public/
├── index.html      # Estrutura HTML da aplicação
├── app.js          # Lógica JavaScript principal
├── style.css       # Estilos CSS
├── config.js       # Configuração da API (opcional)
└── README.md       # Este arquivo
```

## 🔧 Configuração

### Alterar URL da API

Por padrão, a aplicação se conecta à API em `http://localhost:8000/api/produto`.

Para alterar, edite o arquivo `app.js` na linha 4:

```javascript
const API_URL = 'http://localhost:8000/api/produto';
```

Ou configure no arquivo `config.js` (se implementado):

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',
    ENDPOINT: '/api/produto'
};
```

## 📡 Endpoints Utilizados

A aplicação consome os seguintes endpoints da API Laravel:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/produto?page=1&search=termo&sortBy=nome&sortOrder=asc` | Listar produtos com paginação, busca e ordenação |
| `GET` | `/api/produto/{id}` | Buscar produto específico |
| `POST` | `/api/produto` | Criar novo produto |
| `PUT` | `/api/produto/{id}` | Atualizar produto existente |
| `DELETE` | `/api/produto/{id}` | Excluir produto |

### Parâmetros de Query

- `page`: Número da página (padrão: 1)
- `search`: Termo de busca (opcional)
- `sortBy`: Coluna para ordenação (`nome`, `descricao`, `quantidade`, `preco`)
- `sortOrder`: Direção da ordenação (`asc` ou `desc`)

## 🎨 Recursos de Interface

### Busca
- Busca em tempo real com debounce de 50ms
- Busca por nome ou descrição do produto
- Indicador de resultados encontrados
- Botão para limpar busca

### Paginação
- Navegação entre páginas
- Indicador de página atual
- Resumo de resultados (ex: "Página 1 de 5 - Total: 50 itens")
- Botões Anterior/Próximo

### Ordenação
- Clique nos cabeçalhos das colunas para ordenar
- Ícones visuais indicando direção da ordenação
- Ordenação ascendente/descendente alternável

### Modais
- Modal para criar/editar produtos
- Modal de confirmação para exclusão
- Validação em tempo real
- Formatação automática de preço

### Notificações
- Notificações de sucesso (verde)
- Notificações de erro (vermelho)
- Auto-dismiss após 4 segundos
- Posicionamento fixo no topo

## 🔍 Validação

### Frontend
- Nome do produto: obrigatório
- Descrição: obrigatória
- Quantidade: obrigatória, deve ser >= 0
- Preço: obrigatório, deve ser > 0

### Backend
- Validação adicional no servidor
- Mensagens de erro exibidas no formulário
- Campos com erro destacados visualmente

## 🐛 Troubleshooting

### Erro de CORS (Cross-Origin Resource Sharing)

Se aparecer erro de CORS no console do navegador:

1. Verifique se a API Laravel está rodando
2. Confirme que o CORS está habilitado no Laravel (`config/cors.php`)
3. Verifique se o middleware `HandleCors` está ativo

### Erro de conexão

- Verifique se a API está rodando na porta 8000
- Confirme se a URL está correta no `app.js`
- Abra o console do navegador (F12) para ver erros detalhados
- Verifique se não há firewall bloqueando a conexão

### Produtos não aparecem

- Verifique se há produtos cadastrados no banco de dados
- Confirme se a API está retornando dados corretamente
- Verifique o console do navegador para erros JavaScript

### Formatação de preço incorreta

- O campo de preço aceita apenas números
- A formatação é automática (ex: 10.50 → R$ 10,50)
- Use vírgula ou ponto como separador decimal

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilização e animações
- **JavaScript (ES6+)**: Lógica da aplicação
- **Font Awesome 6.5.2**: Ícones
- **Fetch API**: Comunicação com a API

## 📝 Notas

- A aplicação não requer build ou compilação
- Funciona como Single Page Application (SPA)
- Não utiliza frameworks ou bibliotecas externas (exceto Font Awesome)
- Compatível com navegadores modernos

## 🔗 Dependências Externas

- **Font Awesome**: Carregado via CDN
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
  ```

## 📄 Licença

Este projeto faz parte do sistema de controle de estoque.

