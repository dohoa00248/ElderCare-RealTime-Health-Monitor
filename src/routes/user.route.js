import express from 'express';
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import authenticateToken from '../middleware/auth.middleware.js';
import userController from '../controllers/user.controller.js';
import HealthData from '../models/healthdata.model.js';
import verifyToken from '../middleware/verifyToken.js';
const router = express.Router();

// router.get('/', userController.getAllUsers)
// Sử dụng middleware xác thực token cho các route bảo mật
router.get('/', (req, res) => {
    try {
        res.render('user.ejs');
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/admin/dashboard', async (req, res) => {
    try {
        // Tìm tất cả người dùng trong cơ sở dữ liệu
        const users = await User.find({});

        // Render trang với dữ liệu người dùng
        res.render('admin.ejs', { users: users });
    } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).json({ message: 'Error fetching users', error });
    }
})

router.get('/doctor/dashboard', async (req, res) => {
    try {
        const user = req.user; // Lấy thông tin bác sĩ từ token đã giải mã
        const latestHealthData = await HealthData.findOne().sort({ createdAt: -1 });
        res.render('doctor.ejs', { user: user, healthData: latestHealthData });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

//add patient
router.get('/addpatient', (req, res) => {
    res.render('addpatient'); // render trang đăng ký bệnh nhân
});
// API tìm kiếm bệnh nhân
router.get('/patients/search', async (req, res) => {
    try {
        const searchQuery = req.query.query;
        console.log("Searching for:", searchQuery);  // Log để kiểm tra dữ liệu đầu vào

        // Tìm bệnh nhân theo tên (firstName hoặc lastName)
        const patients = await User.find({
            $or: [
                { firstName: { $regex: searchQuery, $options: 'i' } },
                { lastName: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        if (patients.length === 0) {
            return res.json({ patients: [] });  // Nếu không có bệnh nhân
        }

        res.json({ patients });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi khi tìm kiếm bệnh nhân');
    }
});
router.post('/addpatient', userController.addPatient);
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await User.getAllDoctors();
        res.json(doctors); // Send the list of doctors as a response
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
})
// Lấy danh sách bệnh nhân của bác sĩ
router.get('/patients', async (req, res) => {
    try {
        // Bạn có thể thay thế với ID bác sĩ bạn muốn, ví dụ:
        const doctorId = '675ac0680f210f6e8847f775';  // Thay thế bằng ID của bác sĩ

        // Lấy thông tin bác sĩ từ database, với thông tin bệnh nhân liên kết
        const doctor = await User.findById(doctorId).populate('patients', 'firstName lastName email');

        if (!doctor || doctor.role !== 2) {  // Kiểm tra xem có phải là bác sĩ không
            return res.status(400).json({ message: 'Bác sĩ không tồn tại hoặc không đúng' });
        }

        // Trả về danh sách bệnh nhân của bác sĩ
        res.status(200).json({
            patients: doctor.patients  // Dữ liệu bệnh nhân sẽ được chứa trong doctor.patients
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }

});
router.get('/patients/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;  // Lấy doctorId từ URL parameter

        // Lấy thông tin bác sĩ từ database, với thông tin bệnh nhân liên kết
        const doctor = await User.findById(doctorId).populate('patients', 'firstName lastName email');

        if (!doctor || doctor.role !== 2) {  // Kiểm tra xem có phải là bác sĩ không
            return res.status(400).json({ message: 'Bác sĩ không tồn tại hoặc không đúng' });
        }

        // Trả về danh sách bệnh nhân của bác sĩ
        res.status(200).json({
            patients: doctor.patients  // Dữ liệu bệnh nhân sẽ được chứa trong doctor.patients
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});
router.get('/signup', userController.getCreateUser);

router.post('/signup', userController.createUser);

router.get('/users/:userId', userController.getUserById);
router.get('/patient/:userId', userController.getUserById);

router.get('/update/:userId', userController.getUpdatePage);
router.get('/update-patient/:userId', userController.getUpdatePatientPage);

router.get('/delete/:userId', userController.getDeletePage);

router.put('/update/:userId', userController.updateUser);

router.delete('/delete/:userId', userController.deleteUser);

export default router;