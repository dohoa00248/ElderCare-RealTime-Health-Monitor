import express from 'express'
import HealthData from '../models/healthdata.model.js';
// import healthDataController from '../controllers/healthDataController.js';
// import socketController from '../controllers/socketController.js';
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('health.ejs');
})

router.get('/history', async (req, res) => {
    try {
        // Truy vấn tất cả dữ liệu lịch sử và giới hạn 10 bản ghi
        const healthDataHistory = await HealthData.find()
            .sort({ createdAt: -1 })  // Sắp xếp theo thời gian tạo, mới nhất ở trên
            .limit(10);               // Giới hạn số lượng bản ghi là 10

        res.status(200).json(healthDataHistory);  // Trả về dữ liệu dưới dạng JSON
        // Render dữ liệu vào file EJS
        // res.render('health.ejs', { healthData: healthDataHistory });
    } catch (error) {
        console.error('Error fetching health data history:', error);
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu lịch sử' });
    }
});

export default router