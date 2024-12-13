import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
// console.log(process.env.JWT_SECRET_KEY);
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Kiểm tra token hợp lệ
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Lưu thông tin người dùng vào request
        req.user = decoded;
        next();  // Chuyển đến route tiếp theo
    });
}

export default verifyToken

