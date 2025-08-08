require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));

app.listen(process.env.PORT, () => {
    console.log(`🚀 Сервер запущено на порті ${process.env.PORT}`);
});
