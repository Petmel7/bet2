const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

describe('Auth flow', () => {
    let testUserEmail = 'test@example.com';

    it('should register a new user and send verification email', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: testUserEmail,
            password: 'password123'
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/please verify/i);
    });

    it('should not login before verification', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: testUserEmail,
            password: 'password123'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/not verified/i);
    });

    it('should verify email with token', async () => {
        const user = await User.findOne({ email: testUserEmail });
        const token = jwt.sign({ id: user.id }, process.env.JWT_EMAIL_SECRET, { expiresIn: '1d' });
        const res = await request(app).get(`/api/auth/verify-email?token=${token}`);
        expect(res.statusCode).toBe(302); // redirect to login
        const updatedUser = await User.findOne({ email: testUserEmail });
        expect(updatedUser.isVerified).toBe(true);
    });

    it('should login after verification', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: testUserEmail,
            password: 'password123'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should throttle resend verification requests', async () => {
        const email = 'throttle@example.com';
        await request(app).post('/api/auth/register').send({ email, password: 'pass1234' });
        await request(app).post('/api/auth/resend-verification').send({ email });
        const res = await request(app).post('/api/auth/resend-verification').send({ email });
        expect(res.statusCode).toBe(429);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});