import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer } from 'ws';
import configViewEngine from './config/view.engine.js';
import parseJson from './middleware/parseJson.middleware.js';
import setupMethodOverride from './middleware/methodOverride.middleware.js';
import webRoutes from './routes/web.js';
import connectDB from './config/db.connect.js';
import configStaticFolders from './config/static.folder.js';
import getLocalIP from './config/local.config.js';
import cookieParser from 'cookie-parser';
import corsMiddleware from './middleware/cors.middleware.js';
import HealthData from './models/healthdata.model.js';
// import https from 'https';  // Uncomment if you want to use HTTPS
// import fs from 'fs';       // Uncomment if you want to use HTTPS

// Khởi tạo app Express
const app = express();

// Load các biến môi trường từ tệp .env
dotenv.config();

// Tạo HTTP server
const server = http.createServer(app);

// Khởi tạo WebSocket server
const wss = new WebSocketServer({ server });

// Biến để lưu trữ giá trị trước đó của nhịp tim và SpO2
let lastHeartRate = null;
let lastSpO2 = null;

// Các ngưỡng để chẩn đoán sức khỏe
const lowHeartRate = 60;
const highHeartRate = 120;
const lowSpo2 = 90;
const highTemp = 37.5;

// Hàm chẩn đoán sức khỏe
function diagnoseHealth(heart_beat, spo2, temp_obj) {
    let diagnosisArray = [];

    if (heart_beat < lowHeartRate) {
        diagnosisArray.push("Nhịp tim thấp");
    }
    if (heart_beat > highHeartRate) {
        diagnosisArray.push("Nhịp tim cao");
    }
    if (spo2 < lowSpo2) {
        diagnosisArray.push("SpO2 thấp");
    }
    if (temp_obj > highTemp) {
        diagnosisArray.push("Sốt");
    }
    if (diagnosisArray.length === 0) {
        diagnosisArray.push("Bình thường");
    }
    return diagnosisArray;  // Trả về mảng thay vì chuỗi JSON
}

// Hàm chẩn đoán trạng thái sức khỏe
function diagnoseHealthStatus(heart_beat, spo2, temp_obj) {
    if (heart_beat < lowHeartRate || heart_beat > highHeartRate ||
        spo2 < lowSpo2 || temp_obj > highTemp) {
        return "Bất thường";
    }
    return "Khỏe mạnh";  // Healthy
}

// Lắng nghe kết nối WebSocket từ client
wss.on('connection', (ws) => {
    console.log('A user connected');  // Thông báo khi client kết nối

    // Gửi tin nhắn chào mừng đến client khi kết nối
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

    // Lắng nghe tin nhắn từ client
    ws.on('message', async (message) => {
        console.log('Received data from client:', message);

        // Kiểm tra nếu message là Buffer
        if (Buffer.isBuffer(message)) {
            // Chuyển buffer thành chuỗi JSON
            message = message.toString('utf-8');
        }

        try {
            // Phân tích cú pháp chuỗi JSON nhận được
            const data = JSON.parse(message);

            // Log dữ liệu để kiểm tra
            console.log('Parsed data:', data);

            // Chẩn đoán sức khỏe và trạng thái sức khỏe
            const healthDiagnosis = diagnoseHealth(data.heartBeat, data.spo2, data.tempBody);
            const healthStatus = diagnoseHealthStatus(data.heartBeat, data.spo2, data.tempBody);

            // Thêm chẩn đoán vào dữ liệu
            data.healthDiagnosis = healthDiagnosis;
            data.healthStatus = healthStatus;

            // Kiểm tra nếu nhịp tim hoặc SpO2 thay đổi
            const heartRateChanged = data.heartBeat !== lastHeartRate;
            const spO2Changed = data.spo2 !== lastSpO2;

            if (heartRateChanged || spO2Changed) {
                // Lưu dữ liệu vào MongoDB khi có thay đổi nhịp tim hoặc SpO2
                const newHealthData = new HealthData(data);
                await newHealthData.save();

                console.log('Data saved successfully:', newHealthData);

                // Cập nhật giá trị nhịp tim và SpO2 trước đó
                lastHeartRate = data.heartBeat;
                lastSpO2 = data.spo2;
            } else {
                console.log('No significant change in heart rate or SpO2, data not saved.');
            }

            // Gửi dữ liệu mới đến tất cả các client kết nối
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    // Gửi dữ liệu dưới dạng JSON cho tất cả các client
                    client.send(JSON.stringify(data));
                }
            });

        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ status: 'error', message: error.message }));
        }
    });

    // Lắng nghe khi client ngắt kết nối
    ws.on('close', () => {
        console.log('A user disconnected');
    });

    // Gửi thông báo khi kết nối bị lỗi
    ws.on('error', (error) => {
        console.error('WebSocket error: ', error);
        ws.send(JSON.stringify({ status: 'error', message: 'WebSocket connection error' }));
    });
});

// Kết nối cơ sở dữ liệu MongoDB
connectDB();

// Cấu hình view engine 
configViewEngine(app);

// Cấu hình thư mục static 
configStaticFolders(app);

// Cấu hình middleware
parseJson(app);
setupMethodOverride(app);

// CORS middleware 
corsMiddleware(app);

// Cấu hình cookie-parser middleware
app.use(cookieParser());

// Định nghĩa các routes
webRoutes(app);

// Cấu hình và chạy server
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOST_NAME || getLocalIP() || 'localhost';

// Bắt đầu server và lắng nghe kết nối
server.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});
