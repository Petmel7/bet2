const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Немає токена, доступ заборонено' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Невірний токен' });
    }
};

module.exports = { protect };
