const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 📌 Реєстрація
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Користувач вже існує' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id, user.role)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Логін
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Невірний email або пароль' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Невірний email або пароль' });

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id, user.role)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Отримати профіль (захищений маршрут)
const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
};

module.exports = {
    registerUser,
    loginUser,
    getProfile
};

