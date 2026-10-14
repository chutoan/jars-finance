# 💰 JarsFinance VN (6 Hũ Chi Tiêu) & HabitFlow VN

Ứng dụng quản lý tài chính cá nhân theo phương pháp **6 Hũ Chi Tiêu (Jars System)** tích hợp cơ chế **Chặn Chi Tiêu Vượt Hũ (Strict Budget Lock)** và bảng **Theo Dõi Thói Quen (Habit Tracker)**.

## 🚀 Cách 1: Chạy trực tiếp với Node.js (Vite)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy server development
npm run dev
```

Sau đó mở trình duyệt tại: **http://localhost:5173**

## 🐳 Cách 2: Chạy bằng Docker Compose

```bash
docker compose up -d --build
```

Truy cập ứng dụng tại: **http://localhost:8080**

## 🔒 Cơ chế "Chặn Chi Tiêu Vượt Hũ" (Strict Budget Lock)
- Khi công tắc **"🔒 Chặn chi tiêu vượt số dư hũ"** được bật trên thanh công cụ:
  - Bất kỳ giao dịch chi tiêu nào có `amount > jar.remaining` sẽ bị chặn trước khi ghi vào State.
  - Ứng dụng sẽ hiển thị hộp thoại cảnh báo số tiền vượt mức và gợi ý nút **"Chuyển tiền bù đắp từ hũ khác"** ngay lập tức.
