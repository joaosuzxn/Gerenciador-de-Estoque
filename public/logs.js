document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || 'http://localhost:8000/api';
    const token = localStorage.getItem('auth_token') || '';

    const el = {
        body: document.getElementById('logs-body'),
        acao: document.getElementById('filtro-acao'),
        filtrar: document.getElementById('btn-filtrar'),
    };

    function clearSession() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user_name');
        localStorage.removeItem('auth_user_is_admin');
    }

    function redirectToLogin() {
        window.location.href = 'login.html';
    }

    function isAdmin() {
        return localStorage.getItem('auth_user_is_admin') === '1';
    }

    function formatDate(value) {
        if (!value) return '-';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '-';
        return d.toLocaleString('pt-BR');
    }

    function formatJson(data) {
        if (!data) return '-';
        if (typeof data === 'string') return data;
        return JSON.stringify(data);
    }

    function acaoClass(acao) {
        if (acao === 'criado') return 'acao-criado';
        if (acao === 'atualizado') return 'acao-atualizado';
        return 'acao-excluido';
    }

    async function request(path) {
        if (!token) {
            redirectToLogin();
            return null;
        }

        const response = await fetch(`${apiBaseUrl}${path}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            clearSession();
            redirectToLogin();
            throw new Error('Sessao expirada.');
        }

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(payload.message || 'Falha ao carregar logs.');
        }
        return payload;
    }

    function renderRows(logs) {
        if (!Array.isArray(logs) || logs.length === 0) {
            el.body.innerHTML = '<tr><td colspan="5">Nenhum log encontrado.</td></tr>';
            return;
        }

        el.body.innerHTML = logs.map((item) => {
            const userName = item.user?.name || '-';
            const productName = item.produto?.nome || item.dados_novos?.nome || item.dados_anteriores?.nome || '-';
            const detalhes = `Antes: ${formatJson(item.dados_anteriores)} | Depois: ${formatJson(item.dados_novos)}`;
            return `
                <tr>
                    <td>${formatDate(item.created_at)}</td>
                    <td><span class="acao-chip ${acaoClass(item.acao)}">${item.acao}</span></td>
                    <td>${userName}</td>
                    <td>${productName}</td>
                    <td>${detalhes}</td>
                </tr>
            `;
        }).join('');
    }

    async function loadLogs() {
        const endpointBase = isAdmin() ? '/admin/produto-logs' : '/produto/logs';
        const params = new URLSearchParams();
        if (el.acao.value) params.set('acao', el.acao.value);
        const suffix = params.toString() ? `?${params.toString()}` : '';
        const payload = await request(`${endpointBase}${suffix}`);
        renderRows(payload?.data || []);
    }

    el.filtrar.addEventListener('click', () => {
        loadLogs().catch(() => {
            el.body.innerHTML = '<tr><td colspan="5">Erro ao carregar logs.</td></tr>';
        });
    });

    loadLogs().catch(() => {
        el.body.innerHTML = '<tr><td colspan="5">Erro ao carregar logs.</td></tr>';
    });
});
