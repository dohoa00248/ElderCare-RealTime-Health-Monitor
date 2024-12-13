// authMiddleware.js
import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Cấu hình dotenv để tải các biến môi trường từ file .env
configDotenv(); // Chỉ cần gọi 1 lần

function authenticateToken(req, res, next) {
    // Lấy token từ header Authorization
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization header is required. Token missing.' });
    }

    // Xác thực và giải mã token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token', error: err.message });
        }

        try {
            // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu hay không
            const user = await User.findById(decoded._id);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Lưu thông tin người dùng đã giải mã vào req.user
            req.user = decoded; // Lưu thông tin user vào request để các route có thể sử dụng
            next();  // Chuyển sang middleware hoặc route tiếp theo
        } catch (err) {
            return res.status(500).json({ message: 'Server error while checking user', error: err.message });
        }
    });
}

export default authenticateToken;
