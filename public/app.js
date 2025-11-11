document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:8000/api/produto'; 
    let paginaAtual = 1; 
    let termoBuscaAtual = '';
    let idParaExcluir = null; 

   
    const debounce = (func, delay) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    
    const corpoTabela = document.getElementById('corpo-tabela');
    const btnNovoProduto = document.getElementById('btn-novo-produto');
    const modal = document.getElementById('modal-produto');
    const modalTitulo = document.getElementById('modal-titulo');
    const formProduto = document.getElementById('form-produto');
    const btnCancelar = document.getElementById('btn-cancelar');
    const produtoIdInput = document.getElementById('produto-id');
    const notificationContainer = document.getElementById('notification-container');
    const paginacaoContainer = document.getElementById('paginacao-container');
    const loadingBarContainer = document.getElementById('loading-bar-container');
    const loadingBar = document.getElementById('loading-bar');
    const tabelaProdutos = document.getElementById('tabela-produtos'); 
    const searchInfo = document.getElementById('search-info');
    const searchInfoText = document.getElementById('search-info-text');
    
    
    const inputBusca = document.getElementById('input-busca');
    const btnLimparBusca = document.getElementById('btn-limpar-busca');
    
    const toggleClearButton = () => {
        if (inputBusca.value.trim() !== '') {
            btnLimparBusca.style.display = 'flex';
        } else {
            btnLimparBusca.style.display = 'none';
        }
    };
    
    inputBusca.addEventListener('input', (e) => {
        toggleClearButton();
        if (e.target.value.trim() === '') {
            searchInfo.style.display = 'none';
            fetchProdutos(1, '');
        }
    });
    
    toggleClearButton();

    
    const modalConfirmacao = document.getElementById('modal-confirmacao');
    const btnConfirmarNao = document.getElementById('btn-confirmar-nao');
    const btnConfirmarSim = document.getElementById('btn-confirmar-sim');


    
    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        notificationContainer.appendChild(notification);
        void notification.offsetWidth; 
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => { notification.remove(); }, 500); 
        }, 4000); 
    };

    
    const atualizarInfoBusca = (termo, pagination) => {
        if (termo && termo.trim() !== '') {
            const { totalItems, currentPage, totalPages } = pagination;
            const inicio = (currentPage - 1) * 10 + 1;
            const fim = Math.min(currentPage * 10, totalItems);
            
            searchInfoText.innerHTML = `
                <strong>Buscando por:</strong> "${termo}" | 
                <strong>Resultados:</strong> ${totalItems} produto${totalItems !== 1 ? 's' : ''} encontrado${totalItems !== 1 ? 's' : ''}
                ${totalItems > 0 ? ` (Mostrando ${inicio}-${fim} de ${totalItems})` : ''}
            `;
            searchInfo.style.display = 'block';
        } else {
            searchInfo.style.display = 'none';
        }
    };

    const renderPaginacao = (meta) => {
        paginacaoContainer.innerHTML = '';
        const { currentPage, totalPages, totalItems } = meta;

        if (totalPages === 0) {
            paginacaoContainer.innerHTML = '';
            return;
        }

        const btnAnterior = document.createElement('button');
        btnAnterior.textContent = 'Anterior';
        btnAnterior.disabled = currentPage === 1;
        btnAnterior.addEventListener('click', () => {
            if (currentPage > 1) {
                fetchProdutos(currentPage - 1, termoBuscaAtual);
            }
        });
        paginacaoContainer.appendChild(btnAnterior);

        // Carrossel inteligente que mostra até 5 páginas
        const maxButtons = 5;
        let startPage, endPage;

        if (totalPages <= maxButtons) {
            // Se há 5 ou menos páginas, mostra todas
            startPage = 1;
            endPage = totalPages;
        } else {
            // Quando nas últimas páginas, mostra as páginas finais incluindo a última
            if (currentPage >= totalPages - 2) {
                // Mostra as últimas 5 páginas
                startPage = totalPages - (maxButtons - 1);
                endPage = totalPages;
            } else if (currentPage <= 3) {
                // Mostra as primeiras 5 páginas
                startPage = 1;
                endPage = maxButtons;
            } else {
                // Mostra páginas ao redor da atual (2 antes, atual, 2 depois)
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        // Adiciona primeira página se não estiver visível
        if (startPage > 1) {
            const btnFirst = document.createElement('button');
            btnFirst.textContent = '1';
            btnFirst.classList.toggle('active', 1 === currentPage);
            btnFirst.addEventListener('click', () => fetchProdutos(1, termoBuscaAtual));
            paginacaoContainer.appendChild(btnFirst);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                paginacaoContainer.appendChild(ellipsis);
            }
        }

        // Adiciona botões das páginas
        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.classList.toggle('active', i === currentPage);
            btn.addEventListener('click', () => fetchProdutos(i, termoBuscaAtual));
            paginacaoContainer.appendChild(btn);
        }

        // Adiciona última página se não estiver visível
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                paginacaoContainer.appendChild(ellipsis);
            }
            
            const btnLast = document.createElement('button');
            btnLast.textContent = totalPages;
            btnLast.classList.toggle('active', totalPages === currentPage);
            btnLast.addEventListener('click', () => fetchProdutos(totalPages, termoBuscaAtual));
            paginacaoContainer.appendChild(btnLast);
        }

        const btnProximo = document.createElement('button');
        btnProximo.textContent = 'Próximo';
        btnProximo.disabled = currentPage === totalPages;
        btnProximo.addEventListener('click', () => {
            if (currentPage < totalPages) {
                fetchProdutos(currentPage + 1, termoBuscaAtual);
            }
        });
        paginacaoContainer.appendChild(btnProximo);
        
        const resumoTexto = termoBuscaAtual 
            ? ` (Resultado para "${termoBuscaAtual}": ${totalItems} itens)`
            : ` (Página ${currentPage} de ${totalPages} - Total: ${totalItems} itens)`;
            
        const resumo = document.createElement('span');
        resumo.textContent = resumoTexto;
        paginacaoContainer.appendChild(resumo);
    };


    

    let ordenacaoAtual = { column: 'nome', order: 'asc' };

    const atualizarIconesOrdenacao = () => {
        document.querySelectorAll('.sortable').forEach(th => {
            const column = th.dataset.column;
            const icon = th.querySelector('.sort-icon');
            
            if (icon) {
                if (column === ordenacaoAtual.column) {
                    if (ordenacaoAtual.order === 'asc') {
                        icon.className = 'fa-solid fa-sort-up sort-icon';
                    } else {
                        icon.className = 'fa-solid fa-sort-down sort-icon';
                    }
                } else {
                    icon.className = 'fa-solid fa-sort sort-icon';
                }
            }
        });
    };

    const fetchProdutos = async (page = 1, search = '', sortBy = null, sortOrder = null) => {
        paginaAtual = page; 
        termoBuscaAtual = search.trim();
        
        if (sortBy) {
            ordenacaoAtual.column = sortBy;
        }
        if (sortOrder) {
            ordenacaoAtual.order = sortOrder;
        }

        let url = `${API_URL}?page=${page}&sortBy=${ordenacaoAtual.column}&sortOrder=${ordenacaoAtual.order}`;
        if (termoBuscaAtual) {
            url += `&search=${encodeURIComponent(termoBuscaAtual)}`;
        }
        
        loadingBarContainer.style.display = 'block';
        loadingBar.style.width = '0%';
        void loadingBar.offsetWidth;
        loadingBar.style.width = '100%';
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao buscar produtos');
            
            const { data: produtos, pagination } = await response.json(); 

            atualizarInfoBusca(termoBuscaAtual, pagination);
            
            corpoTabela.innerHTML = '';
            
            if (produtos.length === 0) {
                const message = termoBuscaAtual 
                    ? `Nenhum produto encontrado para o termo: "${termoBuscaAtual}"`
                    : 'Nenhum produto cadastrado.';
                corpoTabela.innerHTML = `<tr><td colspan="5" style="text-align: center;">${message}</td></tr>`;
            } else {
                 produtos.forEach(produto => {
                    renderizarProdutoNaTabela(produto);
                });
            }

            renderPaginacao(pagination);
            
            atualizarIconesOrdenacao();
            
            setTimeout(() => {
                loadingBarContainer.style.display = 'none';
            }, 300);

        } catch (error) {
            
            loadingBarContainer.style.display = 'none';
            console.error(error.message);
            showNotification('Não foi possível carregar os produtos. Verifique se o servidor está rodando na porta 8000.', 'error');
        }
    };

    
    const limparErros = () => {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.classList.remove('error');
        });
    };

    
    const exibirErros = (erros) => {
        limparErros();
        
        if (erros && typeof erros === 'object') {
            Object.keys(erros).forEach(campo => {
                const campoId = campo === 'nome_produto' ? 'nome_produto' : campo;
                const errorElement = document.getElementById(`error-${campoId}`);
                const inputElement = document.getElementById(campoId);
                
                if (errorElement && inputElement) {
                    const mensagem = Array.isArray(erros[campo]) ? erros[campo][0] : erros[campo];
                    errorElement.textContent = mensagem;
                    errorElement.style.display = 'block';
                    inputElement.classList.add('error');
                }
            });
        }
    };

    
    const validarFormulario = () => {
        limparErros();
        let valido = true;
        const erros = {};

        const nomeProduto = document.getElementById('nome_produto').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const quantidade = document.getElementById('quantidade').value;
        const preco = document.getElementById('preco').value.trim();

        if (!nomeProduto) {
            erros.nome_produto = 'Insira o nome do produto.';
            valido = false;
        }

        if (!descricao) {
            erros.descricao = 'Insira a descrição do produto.';
            valido = false;
        }

        if (!quantidade || quantidade < 0) {
            erros.quantidade = 'Insira uma quantidade válida.';
            valido = false;
        }

        const precoNumerico = desformatarMoeda(preco);
        if (!preco || precoNumerico <= 0) {
            erros.preco = 'Insira um preço válido.';
            valido = false;
        }

        if (!valido) {
            exibirErros(erros);
        }

        return valido;
    };

    const salvarProduto = async (produto) => {
        const id = produtoIdInput.value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL; 
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto),
            });

            const data = await response.json();

            if (!response.ok) {
                
                if (response.status === 422 && data.errors) {
                    exibirErros(data.errors);
                    showNotification('Por favor, corrija os erros no formulário.', 'error');
                } else {
                    const mensagem = data.message || 'Erro ao salvar produto';
                    showNotification(`Falha ao salvar produto: ${mensagem}`, 'error');
                }
                return;
            }

            showNotification(`Produto ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success');
            
            fecharModal();
            
            // Ao criar novo produto, ordena automaticamente por nome (A-Z)
            if (!id) {
                ordenacaoAtual.column = 'nome';
                ordenacaoAtual.order = 'asc';
            }
            
            fetchProdutos(paginaAtual, termoBuscaAtual); 
            
        } catch (error) {
            console.error(error.message);
            showNotification(`Falha ao salvar produto: ${error.message}`, 'error');
        }
    };

    const excluirProduto = async (id) => {
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const erro = await response.json().catch(() => ({ message: 'Erro desconhecido.' }));
                throw new Error(erro.message || 'Erro ao excluir produto');
            }

            showNotification('Produto excluído com sucesso.', 'error');
            
            fetchProdutos(paginaAtual, termoBuscaAtual);

        } catch (error) {
            console.error(error.message);
            showNotification(`Falha ao excluir produto: ${error.message}`, 'error');
        }
    };


   
    
    const renderizarProdutoNaTabela = (produto) => {
        const tr = document.createElement('tr');
        tr.id = `produto-${produto.id}`; 
        
        const precoFormatado = parseFloat(produto.preco).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        tr.innerHTML = `
            <td data-label="Nome">${produto.nome}</td>
            <td data-label="Descrição">${produto.descricao}</td>
            <td data-label="Qtd.">${produto.quantidade}</td>
            <td data-label="Preço">${precoFormatado}</td>
            <td data-label="Ações">
                <button class="btn btn-editar" data-id="${produto.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn btn-excluir" data-id="${produto.id}"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    };

    
    const formatarMoeda = (valor) => {
        if (!valor) return '';
        const numero = typeof valor === 'string' ? parseFloat(valor.replace(/[^\d,.-]/g, '').replace(',', '.')) : valor;
        if (isNaN(numero)) return '';
        return numero.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const desformatarMoeda = (valorFormatado) => {
        if (!valorFormatado) return '';
        
        const limpo = valorFormatado.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
        return parseFloat(limpo) || 0;
    };

    
    const aplicarMascaraMoeda = (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor === '') {
            e.target.value = '';
            return;
        }
        valor = (parseInt(valor, 10) / 100).toFixed(2) + '';
        valor = valor.replace('.', ',');
        valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        e.target.value = valor;
    };

    
    const formatarCampoMoeda = (e) => {
        const valor = desformatarMoeda(e.target.value);
        if (valor > 0) {
            e.target.value = formatarMoeda(valor);
        }
    };

    const abrirModalCriar = () => {
        modalTitulo.textContent = 'Novo Produto';
        formProduto.reset(); 
        produtoIdInput.value = '';
        
        
        const modalIcon = document.getElementById('modal-icon');
        const modalIconContainer = document.getElementById('modal-icon-container');
        const modalContent = document.querySelector('.modal-produto-content');
        modalIcon.className = 'fa-solid fa-plus';
        modalIconContainer.className = 'modal-icon-container modal-icon-create';
        if (modalContent) {
            modalContent.classList.remove('modal-edit');
        }
        
       
        const campoPreco = document.getElementById('preco');
        campoPreco.removeEventListener('input', aplicarMascaraMoeda);
        campoPreco.removeEventListener('blur', formatarCampoMoeda);
        campoPreco.addEventListener('input', aplicarMascaraMoeda);
        campoPreco.addEventListener('blur', formatarCampoMoeda);
        
        modal.classList.add('visivel');
    };

    const abrirModalEditar = async (id) => {
        modalTitulo.textContent = 'Editar Produto';
        
        
        const modalIcon = document.getElementById('modal-icon');
        const modalIconContainer = document.getElementById('modal-icon-container');
        const modalContent = document.querySelector('.modal-produto-content');
        modalIcon.className = 'fa-solid fa-pen-to-square';
        modalIconContainer.className = 'modal-icon-container modal-icon-edit';
        if (modalContent) {
            modalContent.classList.add('modal-edit');
        }
        
        
        formProduto.style.opacity = '0.5';
        formProduto.style.pointerEvents = 'none';
        
        try {
            
            const response = await fetch(`${API_URL}/${id}`);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Erro desconhecido.' }));
                throw new Error(error.message || 'Erro ao buscar produto');
            }
            
            const produto = await response.json();
            
            
            produtoIdInput.value = produto.id;
            document.getElementById('nome_produto').value = produto.nome;
            document.getElementById('descricao').value = produto.descricao;
            document.getElementById('quantidade').value = produto.quantidade;
            
            
            const precoFormatado = formatarMoeda(produto.preco);
            document.getElementById('preco').value = precoFormatado;
            
            
            const campoPreco = document.getElementById('preco');
            campoPreco.removeEventListener('input', aplicarMascaraMoeda);
            campoPreco.removeEventListener('blur', formatarCampoMoeda);
            campoPreco.addEventListener('input', aplicarMascaraMoeda);
            campoPreco.addEventListener('blur', formatarCampoMoeda);
            
            
            limparErros();
            
            
            modal.classList.add('visivel');
            
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            showNotification(`Falha ao carregar produto: ${error.message}`, 'error');
        } finally {
           
            formProduto.style.opacity = '1';
            formProduto.style.pointerEvents = 'auto';
        }
    };

    const fecharModal = () => {
        modal.classList.remove('visivel');
        formProduto.reset();
        limparErros();
        
        
        const campoPreco = document.getElementById('preco');
        campoPreco.removeEventListener('input', aplicarMascaraMoeda);
        campoPreco.removeEventListener('blur', formatarCampoMoeda);
    };

   
    const abrirModalConfirmacao = (id) => {
        idParaExcluir = id;
        modalConfirmacao.classList.add('visivel');
    };

    const fecharModalConfirmacao = () => {
        idParaExcluir = null;
        modalConfirmacao.classList.remove('visivel');
    };


    
    
    const liveSearch = (e) => {
        const novoTermo = e.target.value.trim();
        
        if (novoTermo !== '') {
            fetchProdutos(1, novoTermo);
        }
    };
    
    const debouncedSearch = debounce(liveSearch, 50);

  
    inputBusca.addEventListener('input', (e) => {
        if (e.target.value.trim() !== '') {
            debouncedSearch(e);
        }
    });

    
    btnLimparBusca.addEventListener('click', () => {
        inputBusca.value = ''; 
        searchInfo.style.display = 'none';
        btnLimparBusca.style.display = 'none';
        fetchProdutos(1, ''); 
    });


    btnNovoProduto.addEventListener('click', abrirModalCriar);
    btnCancelar.addEventListener('click', fecharModal);
    
    const btnFecharModal = document.getElementById('btn-fechar-modal');
    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', fecharModal);
    }

    formProduto.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validarFormulario()) {
            showNotification('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
            return;
        }
        
        const campoPreco = document.getElementById('preco');
        const precoNumerico = desformatarMoeda(campoPreco.value);
        
        const produto = {
            nome_produto: document.getElementById('nome_produto').value.trim(),
            descricao: document.getElementById('descricao').value.trim(),
            quantidade: parseInt(document.getElementById('quantidade').value),
            preco: precoNumerico,
        };
        salvarProduto(produto);
    });

    corpoTabela.addEventListener('click', (e) => {
        const targetEditar = e.target.closest('.btn-editar');
        const targetExcluir = e.target.closest('.btn-excluir');
        
        if (targetEditar) {
            const id = targetEditar.dataset.id;
            if (id) {
                abrirModalEditar(id);
            } else {
                console.error("ID do produto não encontrado no botão de editar.");
                showNotification('Erro: ID do produto não encontrado.', 'error');
            }
        }

        if (targetExcluir) {
            const id = targetExcluir.dataset.id;
            abrirModalConfirmacao(id); 
        }
    });

    btnConfirmarNao.addEventListener('click', fecharModalConfirmacao);

    btnConfirmarSim.addEventListener('click', () => {
        if (idParaExcluir) {
            excluirProduto(idParaExcluir);
        }
        fecharModalConfirmacao();
    });

    modalConfirmacao.addEventListener('click', (e) => {
        if (e.target === modalConfirmacao) {
            fecharModalConfirmacao();
        }
    });

    document.querySelectorAll('.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.dataset.column;
            let newOrder = 'asc';
            
            if (ordenacaoAtual.column === column) {
                newOrder = ordenacaoAtual.order === 'asc' ? 'desc' : 'asc';
            }
            
            fetchProdutos(1, termoBuscaAtual, column, newOrder);
        });
    });

    fetchProdutos(paginaAtual); 
});