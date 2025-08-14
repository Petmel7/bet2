
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1️⃣ Отримуємо токен з URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');

        // Якщо токен є в URL — зберігаємо в localStorage і чистимо адресу
        if (urlToken) {
            localStorage.setItem('token', urlToken);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 2️⃣ Отримуємо токен з localStorage
        const token = localStorage.getItem('token');

        // 3️⃣ Якщо токена немає — перекидаємо на реєстрацію і зупиняємо код
        if (!token) {
            throw new Error('Please login first.');
        }

        // 4️⃣ Запитуємо дані профілю
        const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error('Unauthorized or server error');

        const data = await res.json();

        // 5️⃣ Заповнюємо дані в HTML
        const emailEl = document.getElementById('email');
        const balanceEl = document.getElementById('balance');

        if (emailEl) emailEl.textContent = data.email || '-';
        if (balanceEl) balanceEl.textContent = (data.balance ?? 0) + ' USD';

    } catch (err) {
        console.error(err);
        localStorage.removeItem('token');

        const emailEl = document.getElementById('email');
        const balanceEl = document.getElementById('balance');
        const errorEl = document.getElementById('error');

        if (emailEl) emailEl.textContent = "-";
        if (balanceEl) balanceEl.textContent = "-";
        if (errorEl) errorEl.textContent = err.message;

        if (err.message === 'Please login first.' || err.message.includes('Unauthorized')) {
            alert(err.message);
            window.location.href = '/registration.html';
        }
    }
});
