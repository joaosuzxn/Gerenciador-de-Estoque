document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || 'http://localhost:8000/api';
    const token = localStorage.getItem('auth_token') || '';

    const el = {
        form: document.getElementById('form-user'),
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        isAdmin: document.getElementById('is_admin'),
        usersBody: document.getElementById('users-body'),
        message: document.getElementById('form-message'),
    };

    function clearSession() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user_name');
        localStorage.removeItem('auth_user_is_admin');
    }

    function redirectToLogin() {
        window.location.href = 'login.html';
    }

    function formatDate(value) {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleString('pt-BR');
    }

    function showMessage(message, type = 'success') {
        el.message.hidden = false;
        el.message.textContent = message;
        el.message.className = `form-message ${type}`;
    }

    async function request(path, options = {}) {
        if (!token) {
            redirectToLogin();
            return null;
        }

        const response = await fetch(`${apiBaseUrl}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...(options.headers || {}),
            },
            ...options,
        });

        if (response.status === 401) {
            clearSession();
            redirectToLogin();
            throw new Error('Sessao expirada. Faca login novamente.');
        }

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
            const error = new Error(payload.message || 'Falha na requisicao.');
            error.status = response.status;
            error.body = payload;
            throw error;
        }

        return payload;
    }

    function renderUsers(users) {
        if (!Array.isArray(users) || users.length === 0) {
            el.usersBody.innerHTML = '<tr><td colspan="5">Nenhum usuario encontrado.</td></tr>';
            return;
        }

        el.usersBody.innerHTML = users.map((user) => {
            const roleClass = user.is_admin ? 'role-admin' : 'role-user';
            const roleText = user.is_admin ? 'Administrador' : 'Usuario';
            return `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="role-chip ${roleClass}">${roleText}</span></td>
                    <td>${formatDate(user.created_at)}</td>
                </tr>
            `;
        }).join('');
    }

    async function loadUsers() {
        const payload = await request('/admin/users');
        renderUsers(payload?.data || []);
    }

    async function ensureAdmin() {
        try {
            const payload = await request('/auth/me');
            const user = payload?.user || null;
            if (!user || user.is_admin !== true) {
                window.location.href = 'index.html';
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    async function submitForm(event) {
        event.preventDefault();
        el.message.hidden = true;

        try {
            await request('/admin/users', {
                method: 'POST',
                body: JSON.stringify({
                    name: el.name.value.trim(),
                    email: el.email.value.trim(),
                    password: el.password.value,
                    is_admin: el.isAdmin.checked,
                }),
            });
            el.form.reset();
            showMessage('Usuario criado com sucesso.', 'success');
            await loadUsers();
        } catch (error) {
            if (error.status === 422 && error.body && error.body.errors) {
                const firstError = Object.values(error.body.errors)[0];
                const text = Array.isArray(firstError) ? firstError[0] : 'Dados invalidos.';
                showMessage(text, 'error');
                return;
            }
            showMessage(error.message || 'Nao foi possivel criar usuario.', 'error');
        }
    }

    el.form.addEventListener('submit', submitForm);

    ensureAdmin().then(async (ok) => {
        if (!ok) return;
        await loadUsers();
    });
});
