import express from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
// import authenticateToken from '../middleware/testtoken.js';
import HealthData from '../models/healthdata.model.js';
import { configDotenv } from 'dotenv';
// configDotenv({ path: '../../.env' });
// console.log(process.env.JWT_SECRET_KEY)
const router = express.Router();

// Route mặc định
router.get('/', async (req, res) => {
    res.render('index.ejs');
});
// router.get('/signin', (req, res) => {
//     res.render('testsignin.ejs');
// })

// Route để lấy lịch sử sức khỏe
// router.get('/history', async (req, res) => {
//     try {
//         // Truy vấn tất cả dữ liệu lịch sử và giới hạn 10 bản ghi
//         const healthDataHistory = await HealthData.find()
//             .sort({ createdAt: -1 })  // Sắp xếp theo thời gian tạo, mới nhất ở trên
//             .limit(10);               // Giới hạn số lượng bản ghi là 10

//         res.status(200).json(healthDataHistory);  // Trả về dữ liệu dưới dạng JSON
//         // Render dữ liệu vào file EJS
//         // res.render('history', { healthData: healthDataHistory });
//     } catch (error) {
//         console.error('Error fetching health data history:', error);
//         res.status(500).json({ message: 'Lỗi khi lấy dữ liệu lịch sử' });
//     }
// });


export default router