document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || 'http://localhost:8000/api';
    const token = localStorage.getItem('auth_token');

    function isAdminValue(value) {
        return value === true || value === 1 || value === '1' || value === 'true';
    }

    if (token) {
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('login-form');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const errorMessage = document.getElementById('login-error');
    const loginButton = document.getElementById('btn-login');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.hidden = true;
        errorMessage.textContent = '';
        loginButton.disabled = true;

        try {
            const response = await fetch(`${apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.value.trim(),
                    password: password.value,
                }),
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(payload.message || 'Falha no login.');
            }

            localStorage.setItem('auth_token', payload.token || '');
            localStorage.setItem('auth_user_name', payload.user?.name || '');
            localStorage.setItem('auth_user_is_admin', isAdminValue(payload.user?.is_admin) ? '1' : '0');
            window.location.href = 'index.html';
        } catch (error) {
            errorMessage.textContent = error.message || 'Nao foi possivel entrar.';
            errorMessage.hidden = false;
        } finally {
            loginButton.disabled = false;
        }
    });
});
