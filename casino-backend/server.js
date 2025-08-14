
const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require('cors');

const app = express();
connectDB();
app.use(express.json());

// Дозволити запити з фронтенду
app.use(cors({
    origin: ['http://127.0.0.1:63910', 'http://localhost:5500'], // твої адреси фронтенду
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Сервер запущено на порті ${process.env.PORT}`);
    });
}

module.exports = app;
