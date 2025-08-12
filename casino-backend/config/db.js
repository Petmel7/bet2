
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Перевірка назви бази
        if (conn.connection.name !== 'casinoDB') {
            console.error(`❌ Помилка: Підключено до бази "${conn.connection.name}" замість "casinoDB"`);
            process.exit(1);
        }

        console.log(`✅ MongoDB Connected: ${conn.connection.host} / DB: ${conn.connection.name}`);
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

