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

module.exports = { depositBalance };