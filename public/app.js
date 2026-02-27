document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || 'http://localhost:8000/api';
    const API_URL = (window.APP_CONFIG && window.APP_CONFIG.API_URL) || `${API_BASE_URL}/produto`;
    const state = {
        page: 1,
        search: '',
        sortBy: 'nome',
        sortOrder: 'asc',
        deletingId: null,
    };

    const el = {
        body: document.getElementById('corpo-tabela'),
        searchInput: document.getElementById('input-busca'),
        clearSearchBtn: document.getElementById('btn-limpar-busca'),
        searchInfo: document.getElementById('search-info'),
        searchInfoText: document.getElementById('search-info-text'),
        newBtn: document.getElementById('btn-novo-produto'),
        pagination: document.getElementById('paginacao-container'),
        loading: document.getElementById('loading-bar-container'),
        loadingBar: document.getElementById('loading-bar'),
        notificationContainer: document.getElementById('notification-container'),
        form: document.getElementById('form-produto'),
        modal: document.getElementById('modal-produto'),
        modalTitle: document.getElementById('modal-titulo'),
        modalIconContainer: document.getElementById('modal-icon-container'),
        modalIcon: document.getElementById('modal-icon'),
        modalCloseBtn: document.getElementById('btn-fechar-modal'),
        modalCancelBtn: document.getElementById('btn-cancelar'),
        produtoId: document.getElementById('produto-id'),
        nome: document.getElementById('nome_produto'),
        descricao: document.getElementById('descricao'),
        quantidade: document.getElementById('quantidade'),
        preco: document.getElementById('preco'),
        modalConfirmacao: document.getElementById('modal-confirmacao'),
        confirmNoBtn: document.getElementById('btn-confirmar-nao'),
        confirmYesBtn: document.getElementById('btn-confirmar-sim'),
        modalLogoutConfirmacao: document.getElementById('modal-logout-confirmacao'),
        logoutNoBtn: document.getElementById('btn-logout-nao'),
        logoutYesBtn: document.getElementById('btn-logout-sim'),
        sortableHeaders: Array.from(document.querySelectorAll('.sortable')),
        logoutBtn: document.getElementById('btn-logout'),
        usuarioLogado: document.getElementById('usuario-logado'),
        adminBtn: document.getElementById('btn-admin'),
        logsBtn: document.getElementById('btn-logs'),
    };

    function getToken() {
        return localStorage.getItem('auth_token') || '';
    }

    function clearSession() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user_name');
        localStorage.removeItem('auth_user_is_admin');
    }

    function redirectToLogin() {
        window.location.href = 'login.html';
    }

    function setLoggedUserName(name = '') {
        if (!el.usuarioLogado) return;
        const firstName = String(name).trim().split(/\s+/)[0] || '';
        el.usuarioLogado.textContent = firstName ? `Ola, ${firstName}` : '';
    }

    function isAdminValue(value) {
        return value === true || value === 1 || value === '1' || value === 'true';
    }

    function toggleAdminButton() {
        if (!el.adminBtn) return;
        const isAdmin = isAdminValue(localStorage.getItem('auth_user_is_admin'));
        el.adminBtn.hidden = !isAdmin;
        el.adminBtn.style.display = isAdmin ? 'inline-flex' : 'none';
    }

    function showLogsButton() {
        if (!el.logsBtn) return;
        el.logsBtn.hidden = false;
        el.logsBtn.style.display = 'inline-flex';
    }

    function hideLogsButton() {
        if (!el.logsBtn) return;
        el.logsBtn.hidden = true;
        el.logsBtn.style.display = 'none';
    }

    function hideAdminButton() {
        if (!el.adminBtn) return;
        el.adminBtn.hidden = true;
        el.adminBtn.style.display = 'none';
    }

    function debounce(fn, delay) {
        let timer = null;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    function showNotification(message, type = 'info') {
        const item = document.createElement('div');
        item.className = `notification ${type}`;
        item.textContent = message;
        el.notificationContainer.appendChild(item);
        requestAnimationFrame(() => item.classList.add('show'));
        setTimeout(() => {
            item.classList.remove('show');
            setTimeout(() => item.remove(), 220);
        }, 3200);
    }

    function showLoading(show) {
        el.loading.hidden = !show;
        if (!show) {
            el.loadingBar.style.width = '0%';
            return;
        }
        el.loadingBar.style.width = '0%';
        requestAnimationFrame(() => {
            el.loadingBar.style.width = '100%';
        });
    }

    function formatCurrency(value) {
        return Number(value || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    function parseCurrency(value) {
        if (typeof value !== 'string') return 0;
        const normalized = value.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
        return Number(normalized);
    }

    function resetErrors() {
        ['nome_produto', 'descricao', 'quantidade', 'preco'].forEach((id) => {
            const input = document.getElementById(id);
            const error = document.getElementById(`error-${id}`);
            input.classList.remove('error');
            error.textContent = '';
        });
    }

    function showErrors(errors) {
        resetErrors();
        Object.keys(errors || {}).forEach((field) => {
            const inputId = field === 'nome_produto' ? 'nome_produto' : field;
            const input = document.getElementById(inputId);
            const error = document.getElementById(`error-${inputId}`);
            if (!input || !error) return;
            input.classList.add('error');
            error.textContent = Array.isArray(errors[field]) ? errors[field][0] : String(errors[field]);
        });
    }

    function updateSortIcons() {
        el.sortableHeaders.forEach((header) => {
            const icon = header.querySelector('.sort-icon');
            if (!icon) return;
            if (header.dataset.column === state.sortBy) {
                icon.className = state.sortOrder === 'asc'
                    ? 'fa-solid fa-sort-up sort-icon'
                    : 'fa-solid fa-sort-down sort-icon';
            } else {
                icon.className = 'fa-solid fa-sort sort-icon';
            }
        });
    }

    function setSearchInfo(pagination) {
        if (!state.search.trim()) {
            el.searchInfo.hidden = true;
            return;
        }

        el.searchInfo.hidden = false;
        el.searchInfoText.textContent =
            `Buscando por "${state.search}" - ${pagination.totalItems} resultado(s).`;
    }

    async function request(url, options = {}) {
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            headers,
            ...options,
        });

        if (response.status === 401) {
            clearSession();
            redirectToLogin();
            throw new Error('Sessao expirada. Faca login novamente.');
        }

        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new Error(body.message || 'Falha na requisicao.');
            error.status = response.status;
            error.body = body;
            throw error;
        }
        return body;
    }

    function renderRows(produtos) {
        if (!produtos.length) {
            const text = state.search
                ? `Nenhum produto encontrado para "${state.search}".`
                : 'Nenhum produto cadastrado.';
            el.body.innerHTML = `<tr><td colspan="5" style="text-align:center;">${text}</td></tr>`;
            return;
        }

        el.body.innerHTML = produtos.map((produto) => {
            return `
                <tr>
                    <td>${produto.nome}</td>
                    <td>${produto.descricao}</td>
                    <td class="align-right">${produto.quantidade}</td>
                    <td class="align-right">${formatCurrency(produto.preco)}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-editar" data-edit="${produto.id}" title="Editar">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn btn-excluir" data-delete="${produto.id}" title="Excluir">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderPagination(pagination) {
        el.pagination.innerHTML = '';
        if (!pagination.totalPages) return;

        const prev = document.createElement('button');
        prev.textContent = 'Anterior';
        prev.disabled = pagination.currentPage <= 1;
        prev.addEventListener('click', () => fetchProdutos(pagination.currentPage - 1));
        el.pagination.appendChild(prev);

        const start = Math.max(1, pagination.currentPage - 2);
        const end = Math.min(pagination.totalPages, start + 4);

        for (let page = start; page <= end; page += 1) {
            const button = document.createElement('button');
            button.textContent = String(page);
            button.classList.toggle('active', page === pagination.currentPage);
            button.addEventListener('click', () => fetchProdutos(page));
            el.pagination.appendChild(button);
        }

        const next = document.createElement('button');
        next.textContent = 'Proximo';
        next.disabled = pagination.currentPage >= pagination.totalPages;
        next.addEventListener('click', () => fetchProdutos(pagination.currentPage + 1));
        el.pagination.appendChild(next);
    }

    async function fetchProdutos(page = state.page) {
        state.page = page;
        const params = new URLSearchParams({
            page: String(state.page),
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
        });
        if (state.search) params.set('search', state.search);

        showLoading(true);
        try {
            const payload = await request(`${API_URL}?${params.toString()}`);
            renderRows(payload.data || []);
            renderPagination(payload.pagination || { totalPages: 0 });
            setSearchInfo(payload.pagination || { totalItems: 0 });
            updateSortIcons();
        } catch (error) {
            console.error(error);
            showNotification('Nao foi possivel carregar os produtos. Verifique a API na porta 8000.', 'error');
        } finally {
            setTimeout(() => showLoading(false), 180);
        }
    }

    async function ensureAuthenticated() {
        const token = getToken();
        if (!token) {
            redirectToLogin();
            return false;
        }

        try {
            const payload = await request(`${API_BASE_URL}/auth/me`);
            const userName = payload.user && payload.user.name ? payload.user.name : '';
            const isAdmin = payload.user ? isAdminValue(payload.user.is_admin) : false;
            if (userName) {
                localStorage.setItem('auth_user_name', userName);
            }
            localStorage.setItem('auth_user_is_admin', isAdmin ? '1' : '0');
            setLoggedUserName(localStorage.getItem('auth_user_name') || userName);
            toggleAdminButton();
            showLogsButton();
            return true;
        } catch (error) {
            hideAdminButton();
            hideLogsButton();
            return false;
        }
    }

    async function logout() {
        try {
            await request(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
        } catch (error) {
            console.error(error);
        } finally {
            clearSession();
            redirectToLogin();
        }
    }

    function openLogoutConfirm() {
        el.modalLogoutConfirmacao.classList.add('visivel');
    }

    function closeLogoutConfirm() {
        el.modalLogoutConfirmacao.classList.remove('visivel');
    }

    function openModal(editing = false, produto = null) {
        resetErrors();
        el.form.reset();
        el.produtoId.value = '';

        if (editing && produto) {
            el.modalTitle.textContent = 'Editar Produto';
            el.modalIcon.className = 'fa-solid fa-pen';
            el.modalIconContainer.style.background = '#ebbf0a';
            el.produtoId.value = produto.id;
            el.nome.value = produto.nome;
            el.descricao.value = produto.descricao;
            el.quantidade.value = produto.quantidade;
            el.preco.value = formatCurrency(produto.preco);
        } else {
            el.modalTitle.textContent = 'Novo Produto';
            el.modalIcon.className = 'fa-solid fa-plus';
            el.modalIconContainer.style.background = '#1f9d58';
            el.preco.value = '';
        }

        el.modal.classList.add('visivel');
    }

    function closeModal() {
        el.modal.classList.remove('visivel');
    }

    function openDeleteConfirm(id) {
        state.deletingId = id;
        el.modalConfirmacao.classList.add('visivel');
    }

    function closeDeleteConfirm() {
        state.deletingId = null;
        el.modalConfirmacao.classList.remove('visivel');
    }

    function validateForm() {
        const errors = {};
        const preco = parseCurrency(el.preco.value);
        if (!el.nome.value.trim()) errors.nome_produto = 'Nome obrigatorio.';
        if (!el.descricao.value.trim()) errors.descricao = 'Descricao obrigatoria.';
        if (!el.quantidade.value || Number(el.quantidade.value) < 0) errors.quantidade = 'Quantidade invalida.';
        if (!el.preco.value.trim() || Number.isNaN(preco) || preco <= 0) errors.preco = 'Preco invalido.';
        showErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function submitForm(event) {
        event.preventDefault();
        if (!validateForm()) return;

        const id = el.produtoId.value;
        const data = {
            nome_produto: el.nome.value.trim(),
            descricao: el.descricao.value.trim(),
            quantidade: Number(el.quantidade.value),
            preco: parseCurrency(el.preco.value),
        };

        try {
            if (id) {
                await request(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
                showNotification('Produto atualizado com sucesso.', 'success');
            } else {
                await request(API_URL, { method: 'POST', body: JSON.stringify(data) });
                showNotification('Produto criado com sucesso.', 'success');
            }
            closeModal();
            fetchProdutos(id ? state.page : 1);
        } catch (error) {
            if (error.status === 422 && error.body && error.body.errors) {
                showErrors(error.body.errors);
                showNotification('Corrija os campos destacados.', 'error');
                return;
            }
            showNotification(error.message || 'Falha ao salvar produto.', 'error');
        }
    }

    async function removeProduto(id) {
        try {
            await request(`${API_URL}/${id}`, { method: 'DELETE' });
            showNotification('Produto excluido com sucesso.', 'success');
            fetchProdutos(state.page);
        } catch (error) {
            showNotification(error.message || 'Falha ao excluir produto.', 'error');
        }
    }

    el.searchInput.addEventListener('input', debounce(() => {
        state.search = el.searchInput.value.trim();
        el.clearSearchBtn.style.display = state.search ? 'block' : 'none';
        fetchProdutos(1);
    }, 300));

    el.clearSearchBtn.addEventListener('click', () => {
        el.searchInput.value = '';
        state.search = '';
        el.clearSearchBtn.style.display = 'none';
        fetchProdutos(1);
    });

    el.sortableHeaders.forEach((header) => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            if (state.sortBy === column) {
                state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortBy = column;
                state.sortOrder = 'asc';
            }
            fetchProdutos(1);
        });
    });

    el.newBtn.addEventListener('click', () => openModal(false));
    el.modalCloseBtn.addEventListener('click', closeModal);
    el.modalCancelBtn.addEventListener('click', closeModal);
    el.form.addEventListener('submit', submitForm);
    el.modal.addEventListener('click', (event) => {
        if (event.target === el.modal) closeModal();
    });

    el.modalConfirmacao.addEventListener('click', (event) => {
        if (event.target === el.modalConfirmacao) closeDeleteConfirm();
    });
    el.confirmNoBtn.addEventListener('click', closeDeleteConfirm);
    el.confirmYesBtn.addEventListener('click', async () => {
        if (state.deletingId === null) return;
        const id = state.deletingId;
        closeDeleteConfirm();
        await removeProduto(id);
    });

    el.modalLogoutConfirmacao.addEventListener('click', (event) => {
        if (event.target === el.modalLogoutConfirmacao) closeLogoutConfirm();
    });
    el.logoutNoBtn.addEventListener('click', closeLogoutConfirm);
    el.logoutYesBtn.addEventListener('click', async () => {
        closeLogoutConfirm();
        await logout();
    });

    el.body.addEventListener('click', async (event) => {
        const editButton = event.target.closest('[data-edit]');
        const deleteButton = event.target.closest('[data-delete]');

        if (editButton) {
            const id = editButton.getAttribute('data-edit');
            try {
                const produto = await request(`${API_URL}/${id}`);
                openModal(true, produto);
            } catch (error) {
                showNotification(error.message || 'Falha ao buscar produto.', 'error');
            }
            return;
        }

        if (deleteButton) {
            const id = Number(deleteButton.getAttribute('data-delete'));
            openDeleteConfirm(id);
        }
    });

    el.preco.addEventListener('blur', () => {
        const value = parseCurrency(el.preco.value);
        if (!Number.isNaN(value) && value > 0) {
            el.preco.value = formatCurrency(value);
        }
    });

    if (el.logoutBtn) {
        el.logoutBtn.addEventListener('click', openLogoutConfirm);
    }

    el.clearSearchBtn.style.display = 'none';
    hideAdminButton();
    hideLogsButton();
    ensureAuthenticated().then((authenticated) => {
        if (!authenticated) return;
        fetchProdutos(1);
    });
});
