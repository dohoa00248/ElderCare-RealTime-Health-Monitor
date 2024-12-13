import express from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authenticateToken from '../middleware/auth.middleware.js';

import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {
    res.render('signin.ejs');
});

router.post('/signin', async (req, res) => {

    const { username, password } = req.body;

    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findOne({ username });

        if (!user) {
            // Nếu người dùng không tồn tại
            return res.status(400).json({ message: 'Username does not exist.' });
        }

        // Kiểm tra mật khẩu đã nhập có khớp với mật khẩu đã mã hóa trong cơ sở dữ liệu không
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Nếu mật khẩu không khớp
            return res.status(400).json({ message: 'Password is incorrect.' });
        }

        // Tạo payload cho JWT (Token)
        const payload = {
            _id: user._id,              // ID của người dùng
            username: user.username,    // Tên đăng nhập của người dùng
            firstName: user.firstName,  // Họ
            lastName: user.lastName,    // Tên
            email: user.email,          // Email người dùng
            role: user.role,            // Vai trò (Admin, Bác sĩ, Người dùng)
            doctorId: user.doctorId,    // (Nếu có) ID của bác sĩ (nếu người dùng là bệnh nhân)
            patients: user.patients     // (Nếu có) Danh sách bệnh nhân mà bác sĩ quản lý
        };

        // Tạo token JWT, set thời gian hết hạn
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        //c1
        // Gửi token qua header Authorization
        res.setHeader('Authorization', `Bearer ${token}`);

        //c2
        // Gửi token qua cookie với các thuộc tính bảo mật
        // res.cookie('token', token, {
        //     httpOnly: true,           // Cookie không thể truy cập qua JavaScript
        //     // secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường sản xuất
        //     sameSite: 'None',         // CORS yêu cầu sameSite=None nếu bạn làm việc với API ở khác domain
        //     maxAge: 3600000,          // Cookie sống trong 1 giờ (1h)
        //     path: '/',                // Đảm bảo cookie có thể truy cập ở mọi trang trên site
        // });

        // Trả về phản hồi sau khi đăng nhập thành công
        res.status(200).json({
            message: 'Login successful',
            token: token // Trả về token nếu cần thiết
        });

    } catch (error) {
        // Xử lý lỗi nếu có lỗi trong quá trình đăng nhập
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router