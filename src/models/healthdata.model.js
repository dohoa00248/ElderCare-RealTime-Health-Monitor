import mongoose from "mongoose";

// Tạo schema cho dữ liệu sức khỏe
const healthDataSchema = new mongoose.Schema({
    deviceID: {
        type: String,  // Mỗi bệnh nhân sẽ có một thiết bị riêng
        required: true,
        unique: true,
    },
    // patientID: {
    //     type: mongoose.Schema.Types.ObjectId, // Sử dụng ObjectId để tham chiếu tới User
    //     ref: 'User', // Tên model User
    //     required: true
    // },
    heartBeat: {
        type: Number,
        default: 0,
        required: true
    },
    spo2: {
        type: Number,
        default: 0,
        require: true
    },
    tempBody: {
        type: Number,
        required: true
    },
    ambientTemp: {
        type: Number,
        required: true
    },
    healthDiagnosis: {
        type: [String],
        required: true
    },
    healthStatus: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    });


const HealthData = mongoose.model('HealthData', healthDataSchema);

export default HealthData
