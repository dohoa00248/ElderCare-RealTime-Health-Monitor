import express from 'express'
import HealthData from '../models/HealthData.js';
// import healthDataController from '../controllers/healthDataController.js';
// import socketController from '../controllers/socketController.js';
import healthDataController from '../controllers/healthdataController.js';
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

// Route để lấy thông tin sức khỏe của bệnh nhân
router.get('/:userId', healthDataController.getHealthDataForUser);
// Route để tạo thông tin sức khỏe cho bệnh nhân
router.post('/create/:userId', healthDataController.createHealthDataForUser);

router.get('/update-healthdata/:userId', userController.getUpdateHealthDataPage);
// Cập nhật dữ liệu sức khỏe
router.post('/update-health-data/:patientId', async (req, res) => {
    const { patientId } = req.params;
    const { deviceID, heartBeat, spo2, bodyTemp, ambientTemp, healthDiagnosis, healthStatus } = req.body;

    try {
        const patient = await HealthData.findById(patientId);

        if (patient) {
            patient.deviceID = deviceID;
            patient.heartBeat = heartBeat;
            patient.spo2 = spo2;
            patient.bodyTemp = bodyTemp;
            patient.ambientTemp = ambientTemp;
            patient.healthDiagnosis = healthDiagnosis.split(',').map(d => d.trim());
            patient.healthStatus = healthStatus;

            await patient.save();
            res.render('updatehealthdata.ejs', { patient, message: { type: 'alert-success', text: 'Cập nhật dữ liệu sức khỏe thành công!' } });
        } else {
            res.redirect('/api/v1/user/doctor/dashboard'); 
        }
    } catch (err) {
        console.error(err);
        res.render('updateHealthData', { patient: {}, message: { type: 'alert-danger', text: 'Có lỗi xảy ra khi cập nhật dữ liệu.' } });
    }
});

export default router