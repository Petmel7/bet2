
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
        // 1️⃣ Пробуємо зареєструвати
        let res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        let data = await res.json();

        if (res.ok) {
            // ✅ Реєстрація успішна
            alert('✅ Registration successful! Please check your email to confirm.');

            const domain = email.split('@')[1];
            let mailUrl = '';
            if (domain.includes('gmail.com')) mailUrl = 'https://mail.google.com';
            else if (domain.includes('yahoo.com')) mailUrl = 'https://mail.yahoo.com';
            else if (domain.includes('outlook.com') || domain.includes('hotmail.com')) mailUrl = 'https://outlook.live.com';
            if (mailUrl) window.open(mailUrl, '_blank');

            return;
        }

        // 2️⃣ Якщо користувач вже існує — пробуємо логін
        if (data.message === 'User already exists') {
            res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            data = await res.json();

            if (!res.ok) {
                alert(`❌ Error: ${data.message || 'Login failed'}`);
                return;
            }

            localStorage.setItem('token', data.token);
            window.location.href = '/profile.html';
            return;
        }

        // 3️⃣ Інші помилки
        alert(`❌ Error: ${data.message || 'Registration failed'}`);

    } catch (err) {
        console.error('Error:', err);
        alert('❌ Server error. Please try again later.');
    }
});

