-- =============================================================================
-- JarsFinance & HabitFlow VN - PostgreSQL Database Dump
-- Created At: 2026-10-14T07:04:29.594Z
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

INSERT INTO jars (id, name, percent, balance, allocated, color, border_color, bg_light, text_color, icon, description)
VALUES ('nec', 'Thiết yếu (NEC)', 50, 13250000, 19250000, 'from-amber-500 to-orange-600', 'border-amber-500/30', 'bg-amber-500/10', 'text-amber-400', 'ShoppingCart', 'Ăn uống, thuê nhà, hóa đơn, sinh hoạt hàng ngày');
INSERT INTO jars (id, name, percent, balance, allocated, color, border_color, bg_light, text_color, icon, description)
VALUES ('ffa', 'Tự do tài chính (FFA)', 15, 3500000, 3500000, 'from-emerald-500 to-teal-600', 'border-emerald-500/30', 'bg-emerald-500/10', 'text-emerald-400', 'TrendingUp', 'Đầu tư cổ phiếu, vàng, tạo nguồn thu nhập thụ động');
INSERT INTO jars (id, name, percent, balance, allocated, color, border_color, bg_light, text_color, icon, description)
VALUES ('play', 'Hưởng thụ (PLAY)', 10, 1950000, 3500000, 'from-pink-500 to-rose-600', 'border-pink-500/30', 'bg-pink-500/10', 'text-pink-400', 'PartyPopper', 'Cà phê bạn bè, du lịch xả stress, tự thưởng bản thân');
INSERT INTO jars (id, name, percent, balance, allocated, color, border_color, bg_light, text_color, icon, description)
VALUES ('edu', 'Phát triển bản thân (EDU)', 10, 2300000, 3500000, 'from-purple-500 to-violet-600', 'border-purple-500/30', 'bg-purple-500/10', 'text-purple-400', 'BookOpen', 'Sách, khóa học trực tuyến, chứng chỉ nghề nghiệp');
INSERT INTO jars (id, name, percent, balance, allocated, color, border_color, bg_light, text_color, icon, description)
VALUES ('ltss', 'Tiết kiệm dài hạn (LTSS)', 10, 3100000, 3500000, 'from-blue-500 to-indigo-600', 'border-blue-500/30', 'bg-blue-500/10', 'text-blue-400', 'ShieldCheck', 'Quỹ khẩn cấp, mua sắm lớn, bảo hiểm nhân thọ');
INSERT INTO jars (id, name, percent, balance, allocated, color, border_color, bg_light, text_color, icon, description)
VALUES ('give', 'Cho đi (GIVE)', 5, 1250000, 1750000, 'from-cyan-500 to-sky-600', 'border-cyan-500/30', 'bg-cyan-500/10', 'text-cyan-400', 'HeartHandshake', 'Làm từ thiện, quà biếu ông bà bố mẹ, chia sẻ cộng đồng');

INSERT INTO habits (id, title, category, completed_dates)
VALUES ('h-1', 'Ghi chép chi tiêu trước 22:00', 'Tài chính', '["2026-10-11","2026-10-12","2026-10-13","2026-10-14"]'::jsonb);
INSERT INTO habits (id, title, category, completed_dates)
VALUES ('h-2', 'Nấu ăn tại nhà (không gọi đồ ngoài)', 'Tiết kiệm', '["2026-10-12","2026-10-14"]'::jsonb);
INSERT INTO habits (id, title, category, completed_dates)
VALUES ('h-3', 'Đọc 20 trang sách phát triển / đầu tư', 'Học tập', '["2026-10-10","2026-10-11","2026-10-12","2026-10-13","2026-10-14"]'::jsonb);
INSERT INTO habits (id, title, category, completed_dates)
VALUES ('h-4', 'Kiểm tra ngân sách & không tiêu lẹm hũ', 'Kỷ luật', '["2026-10-13","2026-10-14"]'::jsonb);
INSERT INTO habits (id, title, category, completed_dates)
VALUES ('h-5', 'Tập thể dục 30 phút rèn luyện sức bền', 'Sức khỏe', '["2026-10-12","2026-10-13"]'::jsonb);

INSERT INTO transactions (id, date, type, jar_id, to_jar_id, amount, note)
VALUES ('tx-1791959115290', '2026-10-14', 'expense', 'nec', NULL, 500000, 'Test Luu PostgreSQL');
INSERT INTO transactions (id, date, type, jar_id, to_jar_id, amount, note)
VALUES ('tx-1791959678321', '2026-10-14', 'expense', 'edu', NULL, 500000, 'Đi mua sách');
INSERT INTO transactions (id, date, type, jar_id, to_jar_id, amount, note)
VALUES ('tx-1791960379382', '2026-10-14', 'income_distribute', 'all', NULL, 10000000, 'Thu nhập lương tháng');

INSERT INTO settings (key, value)
VALUES ('strict_lock', 'false'::jsonb);
