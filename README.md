## 22691291 - Nguyễn Xuân Nhật Nam
 # EProject-Phase-1

EProject Phase 1 là một hệ thống E-Commerce được xây dựng theo kiến trúc Microservices, bao gồm các dịch vụ chính như:

Authentication Service – Quản lý đăng ký, đăng nhập, xác thực người dùng.

Product Service – Quản lý sản phẩm, danh sách sản phẩm và chi tiết.

Order Service – Quản lý đơn hàng và các hoạt động mua bán.

API Gateway – Đóng vai trò trung gian giữa client và các service con.


Hệ thống được triển khai bằng Node.js, sử dụng Express, MongoDB và RabbitMQ để giao tiếp giữa các microservice.


Công nghệ sử dụng

| Thành phần       | Công nghệ                |
| ---------------- | ------------------------ |
| Backend          | Node.js, Express         |
| Database         | MongoDB                  |
| Authentication   | JWT, bcryptjs            |
| Communication    | REST API, Message Broker |
| Testing          | Mocha, Chai              |
| CI/CD            | GitHub Actions           |
| Containerization | Docker                   |

Cách chạy dự án

cd vào các folder service để thêm file .env và dùng npm install để cài thư viện.


CI/CD Pipeline

Dự án có tích hợp CI/CD với GitHub Actions và Docker, giúp tự động hóa các giai đoạn:


CI (Continuous Integration)

Kiểm tra cú pháp code.

Cài đặt dependencies.

Chạy test tự động với Mocha/Chai.

Kết nối MongoDB container để kiểm thử.


CD (Continuous Deployment)

Build Docker image cho từng service.

Push image lên Docker Hub (hoặc registry tùy chọn).

Triển khai container tự động qua Docker Compose hoặc server đích.


