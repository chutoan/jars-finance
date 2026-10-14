// Chạy lệnh: node setup.mjs để tự động tạo toàn bộ cấu trúc project Vite
import fs from 'fs';
import path from 'path';

const files = {
  "package.json": "{\n  \"name\": \"jars-finance-habit-vn\",\n  \"private\": true,\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite --host\",\n    \"build\": \"vite build\",\n    \"preview\": \"vite preview\"\n  },\n  \"dependencies\": {\n    \"lucide-react\": \"^0.460.0\",\n    \"react\": \"^18.3.1\",\n    \"react-dom\": \"^18.3.1\"\n  },\n  \"devDependencies\": {\n    \"@tailwindcss/vite\": \"^4.0.0\",\n    \"@vitejs/plugin-react\": \"^4.3.4\",\n    \"tailwindcss\": \"^4.0.0\",\n    \"vite\": \"^6.0.0\"\n  }\n}",
  "vite.config.js": "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n  server: {\n    port: 5173,\n    open: true\n  }\n});\n",
  "index.html": "<!doctype html>\n<html lang=\"vi\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>JarsFinance & HabitFlow VN - Quản Lý 6 Hũ Chi Tiêu</title>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js\"></script>\n  </head>\n  <body class=\"bg-slate-950 text-slate-100 antialiased\">\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.jsx\"></script>\n  </body>\n</html>\n",
  "src/main.jsx": "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.jsx';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n",
  "src/index.css": "@import \"tailwindcss\";\n",
  "Dockerfile": "# Stage 1: Build React App\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n\n# Stage 2: Serve with Nginx\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon off;\"]\n",
  "docker-compose.yml": "services:\n  jars-finance-web:\n    build: .\n    container_name: jars_finance_vn\n    ports:\n      - \"8080:80\"\n    restart: unless-stopped\n",
  "README.md": "# 💰 JarsFinance VN (6 Hũ Chi Tiêu) & HabitFlow VN\n\nỨng dụng quản lý tài chính cá nhân theo phương pháp **6 Hũ Chi Tiêu (Jars System)** tích hợp cơ chế **Chặn Chi Tiêu Vượt Hũ (Strict Budget Lock)** và bảng **Theo Dõi Thói Quen (Habit Tracker)**.\n\n## 🚀 Cách 1: Chạy trực tiếp với Node.js (Vite)\n\n```bash\n# 1. Cài đặt dependencies\nnpm install\n\n# 2. Khởi chạy server development\nnpm run dev\n```\n\nSau đó mở trình duyệt tại: **http://localhost:5173**\n\n## 🐳 Cách 2: Chạy bằng Docker Compose\n\n```bash\ndocker compose up -d --build\n```\n\nTruy cập ứng dụng tại: **http://localhost:8080**\n\n## 🔒 Cơ chế \"Chặn Chi Tiêu Vượt Hũ\" (Strict Budget Lock)\n- Khi công tắc **\"🔒 Chặn chi tiêu vượt số dư hũ\"** được bật trên thanh công cụ:\n  - Bất kỳ giao dịch chi tiêu nào có `amount > jar.remaining` sẽ bị chặn trước khi ghi vào State.\n  - Ứng dụng sẽ hiển thị hộp thoại cảnh báo số tiền vượt mức và gợi ý nút **\"Chuyển tiền bù đắp từ hũ khác\"** ngay lập tức.\n"
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('✅ Đã tạo:', filePath);
});

console.log('\n🎉 Hoàn tất! Hãy copy nội dung file SixJarsFinanceApp.jsx vào src/App.jsx rồi chạy: npm install && npm run dev');
