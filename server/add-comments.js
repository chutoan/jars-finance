import pg from 'pg';

const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'jars_finance'
});

async function run() {
  await client.connect();
  console.log('Connected to jars_finance');

  await client.query(`
    -- =========================================================================
    -- 1. BẢNG JARS (6 HŨ CHI TIÊU)
    -- =========================================================================
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
    COMMENT ON COLUMN jars.icon IS 'Tên biểu tượng Lucide Icon tương ứng (ShoppingCart, TrendingUp, ShieldCheck,...)';
    COMMENT ON COLUMN jars.description IS 'Mô tả chi tiết mục đích chi tiêu và nguyên tắc sử dụng của hũ';

    -- =========================================================================
    -- 2. BẢNG TRANSACTIONS (SỔ GIAO DỊCH THU/CHI)
    -- =========================================================================
    COMMENT ON TABLE transactions IS 'Bảng lưu trữ lịch sử giao dịch tài chính (Thu nhập, Chi tiêu, Điều chuyển tiền giữa các hũ)';
    COMMENT ON COLUMN transactions.id IS 'Mã định danh duy nhất của giao dịch (VD: tx-1728888888888)';
    COMMENT ON COLUMN transactions.date IS 'Ngày phát sinh giao dịch (Định dạng: YYYY-MM-DD)';
    COMMENT ON COLUMN transactions.type IS 'Loại giao dịch: expense (chi tiêu), income_distribute (chia lương), transfer (chuyển tiền giữa các hũ)';
    COMMENT ON COLUMN transactions.jar_id IS 'Mã hũ nguồn bị trừ tiền hoặc hũ chi (giá trị all nếu là phân bổ thu nhập)';
    COMMENT ON COLUMN transactions.to_jar_id IS 'Mã hũ đích nhận tiền (chỉ áp dụng cho giao dịch chuyển tiền transfer)';
    COMMENT ON COLUMN transactions.amount IS 'Số tiền giao dịch thực tế (Đơn vị tính: VNĐ)';
    COMMENT ON COLUMN transactions.note IS 'Ghi chú, nội dung chi tiết mục đích giao dịch';
    COMMENT ON COLUMN transactions.created_at IS 'Thời gian tạo bản ghi giao dịch trong CSDL';

    -- =========================================================================
    -- 3. BẢNG HABITS (THEO DÕI THÓI QUEN HABITFLOW)
    -- =========================================================================
    COMMENT ON TABLE habits IS 'Bảng theo dõi kỷ luật thói quen tài chính hàng ngày (HabitFlow VN)';
    COMMENT ON COLUMN habits.id IS 'Mã định danh duy nhất của thói quen (VD: h-1, h-1728888888888)';
    COMMENT ON COLUMN habits.title IS 'Tên thói quen tài chính / phát triển bản thân cần rèn luyện';
    COMMENT ON COLUMN habits.category IS 'Nhóm phân loại thói quen: Tài chính, Tiết kiệm, Học tập, Kỷ luật, Sức khỏe';
    COMMENT ON COLUMN habits.completed_dates IS 'Mảng JSON lưu trữ danh sách các ngày đã hoàn thành thói quen (VD: ["2026-10-14"])';
    COMMENT ON COLUMN habits.created_at IS 'Thời gian tạo thói quen trong hệ thống';

    -- =========================================================================
    -- 4. BẢNG SETTINGS (CẤU HÌNH HỆ THỐNG)
    -- =========================================================================
    COMMENT ON TABLE settings IS 'Bảng cấu hình và thiết lập tham số hệ thống ứng dụng';
    COMMENT ON COLUMN settings.key IS 'Khóa định danh cấu hình (Khóa chính, VD: strict_lock)';
    COMMENT ON COLUMN settings.value IS 'Giá trị cấu hình dạng JSONB (VD: true/false)';
  `);

  console.log('✅ Đã cập nhật thành công toàn bộ COMMENT Description cho tables và columns trong PostgreSQL!');
  await client.end();
}

run().catch(console.error);
