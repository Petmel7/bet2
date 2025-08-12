(async () => {
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

        // 3️⃣ Якщо токена немає — перекидаємо на реєстрацію
        if (!token) {
            throw new Error('Please login first.');
        }

        // 4️⃣ Запитуємо дані профілю
        const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error('Unauthorized or server error');
        }

        const data = await res.json();

        console.log("data", data);

        // 5️⃣ Заповнюємо дані в HTML
        document.getElementById('email').textContent = data.email || '-';
        document.getElementById('balance').textContent =
            data.balance !== undefined && data.balance !== null ? data.balance : '-';


    } catch (err) {
        // Якщо помилка авторизації — видаляємо токен і перекидаємо
        console.error(err);
        localStorage.removeItem('token');
        document.getElementById('email').textContent = "-";
        document.getElementById('balance').textContent =
            data.balance !== undefined && data.balance !== null ? data.balance : '-';
        document.getElementById('error').textContent = err.message;

        if (err.message === 'Please login first.' || err.message.includes('Unauthorized')) {
            alert(err.message);
            window.location.href = '/registration.html';
        }
    }
})();