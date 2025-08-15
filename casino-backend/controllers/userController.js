
const paypal = require('@paypal/checkout-server-sdk');

// 1️⃣ PayPal клієнт (Sandbox або Live)
let environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
// Якщо хочеш live:
// let environment = new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

let client = new paypal.core.PayPalHttpClient(environment);

const depositBalance = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid deposit amount' });
        }

        req.user.balance = (req.user.balance || 0) + amount;
        await req.user.save();

        res.json({
            message: 'Balance updated successfully',
            balance: req.user.balance
        });
    } catch (err) {
        console.error('Deposit error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const paypalDeposit = async (req, res) => {
    try {
        const { orderID } = req.body;
        if (!orderID) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        // Перевірка замовлення у PayPal
        let request = new paypal.orders.OrdersGetRequest(orderID);
        let order = await client.execute(request);

        if (order.statusCode !== 200 || order.result.status !== 'COMPLETED') {
            return res.status(400).json({ message: 'Payment not completed' });
        }

        // Отримуємо суму з транзакції
        const amount = parseFloat(order.result.purchase_units[0].amount.value);

        // Оновлюємо баланс користувача
        req.user.balance = (req.user.balance || 0) + amount;
        await req.user.save();

        res.json({
            message: 'Deposit successful',
            balance: req.user.balance
        });

    } catch (err) {
        console.error('PayPal deposit error:', err);
        res.status(500).json({ message: 'Server error during PayPal deposit' });
    }
};

module.exports = { depositBalance, paypalDeposit };