import pg from 'pg';
import fs from 'fs';
import path from 'path';

const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'jars_finance'
});

async function exportDatabase() {
  await client.connect();
  console.log('Connected to PostgreSQL for dump export...');

  const dbDir = path.resolve('./database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Fetch jars
  const jarsRes = await client.query('SELECT * FROM jars ORDER BY percent DESC, name ASC');
  // Fetch transactions
  const txRes = await client.query('SELECT * FROM transactions ORDER BY created_at ASC');
  // Fetch habits
  const habitsRes = await client.query('SELECT * FROM habits ORDER BY created_at ASC');
  // Fetch settings
  const settingsRes = await client.query('SELECT * FROM settings');

  let dumpContent = `-- =============================================================================
-- JarsFinance & HabitFlow VN - PostgreSQL Database Dump
-- Created At: ${new Date().toISOString()}
-- =============================================================================

-- 1. DROP EXISTING TABLES
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS jars CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- 2. CREATE TABLE jars
CREATE TABLE jars (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    percent INT NOT NULL,
    balance BIGINT NOT NULL DEFAULT 0,
    allocated BIGINT NOT NULL DEFAULT 0,
    color VARCHAR(100),
    border_color VARCHAR(100),
    bg_light VARCHAR(100),
    text_color VARCHAR(100),
    icon VARCHAR(50),
    description TEXT
);

COMMENT ON TABLE jars IS 'Bảng quản lý 6 hũ chi tiêu theo phương pháp quản lý tài chính của T. Harv Eker';
COMMENT ON COLUMN jars.id IS 'Mã định danh duy nhất của hũ (VD: nec, ffa, ltss, edu, play, give)';
COMMENT ON COLUMN jars.name IS 'Tên hiển thị của hũ chi tiêu (VD: Thiết yếu (NEC), Tự do tài chính (FFA))';
COMMENT ON COLUMN jars.percent IS 'Tỷ lệ phần trăm phân bổ thu nhập mặc định (55%, 10%, 10%, 10%, 10%, 5%)';
COMMENT ON COLUMN jars.balance IS 'Số dư khả dụng hiện tại trong hũ (Đơn vị tính: VNĐ)';
COMMENT ON COLUMN jars.allocated IS 'Tổng số tiền đã được phân bổ vào hũ từ trước đến nay (Đơn vị tính: VNĐ)';
COMMENT ON COLUMN jars.color IS 'Mã màu gradient TailwindCSS đại diện cho hũ trên giao diện';
COMMENT ON COLUMN jars.border_color IS 'Mã màu viền của thẻ hũ';
COMMENT ON COLUMN jars.bg_light IS 'Mã màu nền nhạt của thẻ hũ';
COMMENT ON COLUMN jars.text_color IS 'Mã màu chữ tiêu đề của hũ';
COMMENT ON COLUMN jars.icon IS 'Tên biểu tượng Lucide Icon tương ứng';
COMMENT ON COLUMN jars.description IS 'Mô tả chi tiết mục đích chi tiêu và nguyên tắc sử dụng của hũ';

-- 3. CREATE TABLE transactions
CREATE TABLE transactions (
    id VARCHAR(100) PRIMARY KEY,
    date VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    jar_id VARCHAR(50),
    to_jar_id VARCHAR(50),
    amount BIGINT NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE transactions IS 'Bảng lưu trữ lịch sử giao dịch tài chính (Thu nhập, Chi tiêu, Điều chuyển tiền giữa các hũ)';
COMMENT ON COLUMN transactions.id IS 'Mã định danh duy nhất của giao dịch (VD: tx-1728888888888)';
COMMENT ON COLUMN transactions.date IS 'Ngày phát sinh giao dịch (Định dạng: YYYY-MM-DD)';
COMMENT ON COLUMN transactions.type IS 'Loại giao dịch: expense (chi tiêu), income_distribute (chia lương), transfer (chuyển tiền giữa các hũ)';
COMMENT ON COLUMN transactions.jar_id IS 'Mã hũ nguồn bị trừ tiền hoặc hũ chi';
COMMENT ON COLUMN transactions.to_jar_id IS 'Mã hũ đích nhận tiền';
COMMENT ON COLUMN transactions.amount IS 'Số tiền giao dịch thực tế (Đơn vị tính: VNĐ)';
COMMENT ON COLUMN transactions.note IS 'Ghi chú, nội dung chi tiết mục đích giao dịch';
COMMENT ON COLUMN transactions.created_at IS 'Thời gian tạo bản ghi giao dịch trong CSDL';

-- 4. CREATE TABLE habits
CREATE TABLE habits (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    completed_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE habits IS 'Bảng theo dõi kỷ luật thói quen tài chính hàng ngày (HabitFlow VN)';
COMMENT ON COLUMN habits.id IS 'Mã định danh duy nhất của thói quen (VD: h-1, h-1728888888888)';
COMMENT ON COLUMN habits.title IS 'Tên thói quen tài chính / phát triển bản thân cần rèn luyện';
COMMENT ON COLUMN habits.category IS 'Nhóm phân loại thói quen: Tài chính, Tiết kiệm, Học tập, Kỷ luật, Sức khỏe';
COMMENT ON COLUMN habits.completed_dates IS 'Mảng JSON lưu trữ danh sách các ngày đã hoàn thành thói quen';
COMMENT ON COLUMN habits.created_at IS 'Thời gian tạo thói quen trong hệ thống';

-- 5. CREATE TABLE settings
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL
);

COMMENT ON TABLE settings IS 'Bảng cấu hình và thiết lập tham số hệ thống ứng dụng';
COMMENT ON COLUMN settings.key IS 'Khóa định danh cấu hình (Khóa chính, VD: strict_lock)';
COMMENT ON COLUMN settings.value IS 'Giá trị cấu hình dạng JSONB (VD: true/false)';

-- =============================================================================
-- DATA INSERTIONS
-- =============================================================================

`;

  // Jars data
  for (const j of jarsRes.rows) {
    dumpContent += `INSERT INTO jars (id, name, percent, balance, allocated, color, border_color, bg_light, text_color, icon, description)\nVALUES ('${j.id}', '${j.name.replace(/'/g, "''")}', ${j.percent}, ${j.balance}, ${j.allocated}, '${j.color}', '${j.border_color}', '${j.bg_light}', '${j.text_color}', '${j.icon}', '${j.description.replace(/'/g, "''")}');\n`;
  }
  dumpContent += '\n';

  // Habits data
  for (const h of habitsRes.rows) {
    dumpContent += `INSERT INTO habits (id, title, category, completed_dates)\nVALUES ('${h.id}', '${h.title.replace(/'/g, "''")}', '${h.category.replace(/'/g, "''")}', '${JSON.stringify(h.completed_dates)}'::jsonb);\n`;
  }
  dumpContent += '\n';

  // Transactions data
  for (const t of txRes.rows) {
    const toJarVal = t.to_jar_id ? `'${t.to_jar_id}'` : 'NULL';
    dumpContent += `INSERT INTO transactions (id, date, type, jar_id, to_jar_id, amount, note)\nVALUES ('${t.id}', '${t.date}', '${t.type}', '${t.jar_id}', ${toJarVal}, ${t.amount}, '${(t.note || '').replace(/'/g, "''")}');\n`;
  }
  dumpContent += '\n';

  // Settings data
  for (const s of settingsRes.rows) {
    dumpContent += `INSERT INTO settings (key, value)\nVALUES ('${s.key}', '${JSON.stringify(s.value)}'::jsonb);\n`;
  }

  const dumpPath = path.join(dbDir, 'jars_finance_dump.sql');
  fs.writeFileSync(dumpPath, dumpContent, 'utf8');
  console.log('✅ Đã xuất database dump ra:', dumpPath);

  await client.end();
}

exportDatabase().catch(console.error);
