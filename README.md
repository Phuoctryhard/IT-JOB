### Các bước cần làm để chạy dự án NestJS

#### 1. Cài đặt thư viện với câu lệnh: npm i

#### 2. Chạy dự án với câu lệnh: npm run dev

ngodinhphuoc100
phuocyeuem2k3

chọn method compass
mongodb+srv://ngodinhphuoc100:phuocyeuem2k3@cluster0.2a4dm.mongodb.net/


// Note 
Kết luận:
Nếu interceptor không cần inject gì (ví dụ: chỉ log console) → dùng app.useGlobalInterceptors(new LoggingInterceptor())

Nếu interceptor cần inject (ví dụ: LoggerService, ConfigService) → nên đăng ký qua APP_INTERCEPTOR trong module.

// truyền relector vào new transform để lấy metadata
