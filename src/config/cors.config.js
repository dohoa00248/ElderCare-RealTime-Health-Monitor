
const corsOptions = {
    origin: '*',  // Mặc định cho phép tất cả các nguồn gốc (phù hợp với môi trường phát triển)
    credentials: true, // Cho phép gửi cookie
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
};

// Cấu hình cho môi trường development
// if (process.env.NODE_ENV === 'development') {
//     corsOptions.origin = 'http://192.168.2.175:8080';  // Chỉ cho phép nguồn gốc từ localhost (frontend phát triển)
// }

// Cấu hình cho môi trường production
// if (process.env.NODE_ENV === 'production') {
//     corsOptions.origin = 'https://your-production-domain.com'; // Ví dụ: miền sản xuất của bạn
// }

export default corsOptions;