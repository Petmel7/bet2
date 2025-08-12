
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const generateEmailToken = (id) =>
    jwt.sign({ id }, process.env.JWT_EMAIL_SECRET, { expiresIn: '1d' });

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

    const html = `
        <h1>Welcome to Our Casino 🎰</h1>
        <p>Please confirm your email by clicking the link below:</p>
        <a href="${verifyUrl}" target="_blank" 
           style="background-color: #28a745; color: white; padding: 10px 20px; 
           text-decoration: none; border-radius: 5px;">
           ✅ Confirm Email
        </a>
        <p>This link will expire in 24 hours.</p>
    `;

    await transporter.sendMail({
        from: `"No Reply" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Confirm your email',
        html
    });
};

const registerUser = async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const finalUsername = username?.trim() || email.split('@')[0];
    const user = await User.create({
        username: finalUsername,
        email,
        password,
        role: 'user'
    });

    const emailToken = generateEmailToken(user.id);
    user.lastVerificationEmailSentAt = new Date();
    await user.save();

    await sendVerificationEmail(user.email, emailToken);

    res.status(201).json({
        message: 'Registration successful, please verify your email'
    });
};

const resendVerification = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

    const now = new Date();
    if (user.lastVerificationEmailSentAt && (now - user.lastVerificationEmailSentAt) / 1000 < 60) {
        return res.status(429).json({ message: 'Please wait before requesting another verification email' });
    }

    const emailToken = generateEmailToken(user.id);
    user.lastVerificationEmailSentAt = now;
    await user.save();

    await sendVerificationEmail(user.email, emailToken);

    res.json({ message: 'Verification email resent' });
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send('Invalid verification link');
        }

        const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).send('User not found');
        }

        if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
        }

        const authToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.redirect(`${process.env.FRONTEND_URL}/profile.html?token=${authToken}`);

    } catch (err) {
        console.error('Email verification error:', err);
        return res.status(400).send('Verification link expired or invalid');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(400).json({ message: 'Email not verified' });

    if (await bcrypt.compare(password, user.password)) {
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: generateToken(user.id)
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

const getMe = async (req, res) => {
    try {
        // Отримуємо користувача з бази без пароля
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, verifyEmail, resendVerification, getMe };