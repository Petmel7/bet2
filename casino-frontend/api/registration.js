document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
        // 1. Реєстрація
        const registerRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const registerData = await registerRes.json();

        if (!registerRes.ok) {
            alert(`❌ Error: ${registerData.message || 'Registration failed'}`);
            return;
        }

        alert('✅ Registration successful! Please check your email to confirm.');

        // 2. Відкриваємо поштовий сервіс у новій вкладці
        const domain = email.split('@')[1];
        let mailUrl = '';
        if (domain.includes('gmail.com')) mailUrl = 'https://mail.google.com';
        else if (domain.includes('yahoo.com')) mailUrl = 'https://mail.yahoo.com';
        else if (domain.includes('outlook.com') || domain.includes('hotmail.com')) mailUrl = 'https://outlook.live.com';
        if (mailUrl) window.open(mailUrl, '_blank');

    } catch (err) {
        console.error('Error:', err);
        alert('❌ Server error. Please try again later.');
    }
}); 