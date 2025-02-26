import express from 'express';
import User from '../models/User.js';
import mongoose from 'mongoose';
import userController from '../controllers/userController.js';
import HealthData from '../models/HealthData.js';

import authenticateToken from '../middleware/authMiddleware.js';


const router = express.Router();

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
        const users = await User.findAllUsers();

        // Render trang với dữ liệu người dùng
        res.render('admin.ejs', { users: users });
    } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).json({ message: 'Error fetching users', error });
    }
})

router.get('/doctor/dashboard', async (req, res) => {
    try {
        // Lấy thông tin bác sĩ từ token đã giải mã
        const doctor = req.user; // Thay vì 'user', dùng 'doctor' để rõ ràng hơn
        const latestHealthData = await HealthData.findOne().sort({ createdAt: -1 });
        res.render('doctor.ejs', { doctor: doctor, healthData: latestHealthData });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/addpatient', (req, res) => {
    res.render('addpatient');
});

router.get('/addpatient-doctor', (req, res) => {
    res.render('addpatientfordoctor');
});

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

        // Trả về toàn bộ thông tin của bệnh nhân tìm thấy
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
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
})

router.get('/:doctorId/patients', userController.getPatientsOfDoctor);
router.get('/signup', userController.getCreateUser);

router.post('/signup', userController.createUser);

router.get('/users/:userId', userController.getUserById);

router.get('/update/:userId', userController.getUpdatePage);
router.put('/update/:userId', userController.updateUser);

router.get('/patient/:userId', userController.getUserById);
router.get('/update-patient/:userId', userController.getUpdatePatientPage);

router.get('/update-password/:userId', userController.getUpdatePasswordPage);
router.put('/update-password/:userId', userController.updatePassword);

router.get('/delete/:userId', userController.getDeletePage);
router.delete('/delete/:userId', userController.deleteUser);


router.get('/users', userController.getAllUsers)

export default router;