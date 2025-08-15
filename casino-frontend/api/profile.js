
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        if (urlToken) {
            localStorage.setItem('token', urlToken);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Please login first.');

        const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Unauthorized or server error');

        const data = await res.json();
        document.getElementById('email').textContent = data.email || '-';
        document.getElementById('balance').textContent = (data.balance ?? 0) + ' USD';

        // ✅ Завантажуємо PayPal SDK динамічно
        const paypalConfigRes = await fetch('http://localhost:5000/api/config/paypal');
        const { clientId } = await paypalConfigRes.json();
        const paypalScript = document.createElement('script');
        paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
        paypalScript.onload = initPayPal;
        document.body.appendChild(paypalScript);

    } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        alert(err.message);
        window.location.href = '/registration.html';
    }
});

// 🎯 Віртуальне поповнення
document.getElementById('depositForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const amount = Number(document.getElementById('depositAmount').value);
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('http://localhost:5000/api/user/deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Deposit failed');
        document.getElementById('depositMessage').textContent = '✅ Balance updated!';
        document.getElementById('balance').textContent = data.balance + ' USD';
        document.getElementById('depositAmount').value = '';
    } catch (err) {
        document.getElementById('depositMessage').textContent = '❌ ' + err.message;
    }
});

// 🎯 PayPal інтеграція
async function initPayPal() {
    try {
        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{ amount: { value: '10.00' } }]
                });
            },
            onApprove: async (data, actions) => {
                const details = await actions.order.capture();
                alert('✅ Transaction completed by ' + details.payer.name.given_name);

                const res = await fetch('http://localhost:5000/api/user/paypal-deposit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ orderID: data.orderID })
                });
                const resp = await res.json();
                if (resp.balance !== undefined) {
                    document.getElementById('balance').textContent = resp.balance + ' USD';
                }
            }
        }).render('#paypal-button-container');
    } catch (err) {
        console.error('PayPal init error:', err);
    }
}

// 🎯 Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('You have been logged out.');
    window.location.href = '/registration.html';
});