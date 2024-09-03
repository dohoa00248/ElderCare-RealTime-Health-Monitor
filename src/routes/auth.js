import express from 'express';
import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('login.ejs');
});

router.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    const userToRegister = new User({ username: username, password: password, email: email });
    try {
        await userToRegister.save();
        res.status(201).json(userToRegister);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Error creating user.', error: error });
    }
})
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Xác thực người dùng
        const users = await User.signIn(username, password);

        // Nếu đăng nhập thành công, render trang người dùng
        res.render('user.ejs', {
            users: {
                id: users._id,
                username: users.username,
                email: users.email,
                role: users.role
            }
        });

    } catch (err) {
        console.error('Lỗi xử lý đăng nhập:', err.message);

        // Nếu có lỗi, có thể gửi thông báo lỗi hoặc render một trang lỗi
        res.status(401).send(err.message);
    }
})

export default router