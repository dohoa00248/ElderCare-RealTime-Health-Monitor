import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: Number,
        required: true,
        enum: [1, 2, 3], // 1: Admin, 2: Doctor, 3: Regular User
        // default: 3 // Giá trị mặc định là Regular User
    },
    firstName: {
        type: String,
        // required: true
    },
    lastName: {
        type: String,
        // required: true
    },

    // Bac si quan ly benh nhan
    patients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Bác sĩ quản lý bệnh nhân
        }
    ],

    // Bệnh nhân có thể có nhiều bản ghi sức khỏe
    healthData: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthData', // Liên kết với model HealthData
    }],
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
    statics: {
        // Create a new user
        createUser: async function (username, password, email, role) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new this({
                username,
                password: hashedPassword,
                email,
                role
            });
            return await user.save();
        },
        // Sign in
        signIn: async function (username, password) {
            const user = await this.findOne({ username });
            if (!user) {
                throw new Error('Username does not exist.');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Password is incorrect.');
            }
            return user;
        },
        // Get user by ID
        findUserById: async function (userId) {
            return await this.findById(userId);
        },
        // Get user by emailc
        findUserByEmail: async function (email) {
            return await this.findOne({ email: email });
        },
        // Update user
        updateUserById: async function (userId, updatedUser) {
            if (updatedUser.password) {
                const hashedPassword = await bcrypt.hash(updatedUser.password, 10);
                updatedUser.password = hashedPassword;
            }
            const user = await this.findByIdAndUpdate(userId, updatedUser, { new: true });
            return user;
        },
        deleteUserById: async function (userId) {
            const user = await this.findByIdAndDelete(userId);
            return user;
        },
        // Find all users
        findAllUsers: async function () {
            return await this.find();
        },
        // Find all doctors
        findAllDoctors: async function () {
            return await this.find({ role: 2 });
        },
        findPatientsOfDoctor: async function (doctorId) {
            const doctor = await this.findById(doctorId)
                .populate({
                    path: 'patients',  // Lấy thông tin các bệnh nhân liên kết với bác sĩ
                    populate: {
                        path: 'healthData',  // Lấy thông tin từ mảng healthData của mỗi bệnh nhân
                    }
                });
            return doctor;
            // const doctor = await this.findById(doctorId)
            //     .populate({
            //         path: 'patients',  // Tìm các bệnh nhân liên kết với bác sĩ
            //         populate: {
            //             path: 'healthData',  // Populates the health data array
            //             select: 'deviceID heartBeat spo2 bodyTemp ambientTemp healthDiagnosis healthStatus'  // Các trường của healthData cần lấy
            //         }
            //     });
            // return doctor;
        }
    }
});

const User = mongoose.model('User', userSchema);

export default User;

