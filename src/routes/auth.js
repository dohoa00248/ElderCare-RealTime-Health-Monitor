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
    // const { username, password } = req.body;

    // try {
    //     // Tìm người dùng theo username
    //     const user = await User.findOne({ username });

    //     if (!user) {
    //         return res.status(401).send('Tài khoản không tồn tại');
    //     }

    //     // So sánh mật khẩu
    //     user.comparePassword(password, (err, isMatch) => {
    //         if (err) {
    //             console.error('Lỗi so sánh mật khẩu:', err); // Ghi lỗi vào log
    //             return res.status(500).send('Lỗi hệ thống');
    //         }
    //         if (!isMatch) {
    //             return res.status(401).send('Mật khẩu không chính xác');
    //         }

    //         // Nếu đăng nhập thành công, chuyển hướng đến trang người dùng
    //         res.redirect('/api/v1/user');
    //     });
    // } catch (err) {
    //     console.error('Lỗi xử lý đăng nhập:', err); // Ghi lỗi vào log
    //     res.status(500).send('Lỗi hệ thống');
    // }

    const { username, password } = req.body;
    try {
        // Tìm người dùng theo username
        const userToSingin = await User.findOne({ username: username });

        if (!userToSingin) {
            return res.status(401).send('Username does not exist');
        }

        // So sánh mật khẩu
        if (userToSingin.password === password) {
            // Nếu mật khẩu khớp, chuyển hướng đến trang người dùng
            // return res.redirect('/api/v1/user');
            res.render('user.ejs', { users: userToSingin });
        } else {
            // res.status(401).send('Mật khẩu không chính xác');
            return res.status(401).send('Password is incorrect');
        }
    } catch (err) {
        console.error('Lỗi xử lý đăng nhập:', err);
        // res.status(500).send('Lỗi hệ thống');
        res.status(500).send('Error server: ' + err.message);
    }
})

export default router