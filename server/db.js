import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import net from 'net';
import EmbeddedPostgres from 'embedded-postgres';

dotenv.config();

const { Pool } = pg;

const PG_HOST = process.env.PG_HOST || 'localhost';
const PG_PORT = parseInt(process.env.PG_PORT || '5432', 10);
const PG_DATABASE = process.env.PG_DATABASE || 'jars_finance';
const PG_USER = process.env.PG_USER || 'postgres';
const PG_PASSWORD = process.env.PG_PASSWORD || 'postgres';

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: PG_HOST,
      port: PG_PORT,
      database: PG_DATABASE,
      user: PG_USER,
      password: PG_PASSWORD,
      connectionTimeoutMillis: 5000
    };

export const pool = new Pool(poolConfig);

export let dbStatus = {
  isConnected: false,
  error: null,
  database: PG_DATABASE,
  host: PG_HOST,
  port: PG_PORT,
  user: PG_USER
};

// Check if port is already open
function checkPortOpen(port, host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, host === 'localhost' ? '127.0.0.1' : host);
  });
}

// Auto launch embedded PostgreSQL if localhost:5432 is not running
let embeddedInstance = null;
async function ensureLocalPostgres() {
  if (PG_HOST === 'localhost' || PG_HOST === '127.0.0.1') {
    const isOpen = await checkPortOpen(PG_PORT, PG_HOST);
    if (!isOpen) {
      console.log(`⚡ Phát hiện máy tính chưa có PostgreSQL chạy tại port ${PG_PORT}. Đang tự động khởi động PostgreSQL Local Engine...`);
      try {
        const dbPath = path.resolve('./server/pgdata');
        embeddedInstance = new EmbeddedPostgres({
          databaseDir: dbPath,
          port: PG_PORT,
          user: PG_USER,
          password: PG_PASSWORD,
          persistent: true
        });

        try {
          await embeddedInstance.initialise();
        } catch (initErr) {
          // already initialized
        }

        await embeddedInstance.start();
        console.log(`🐘 PostgreSQL Local Engine đã khởi chạy thành công trên port ${PG_PORT}!`);

        try {
          const defaultClient = new pg.Client({
            host: PG_HOST,
            port: PG_PORT,
            user: PG_USER,
            password: PG_PASSWORD,
            database: 'postgres'
          });
          await defaultClient.connect();
          await defaultClient.query(`
            CREATE DATABASE ${PG_DATABASE} WITH TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C'
          `);
          await defaultClient.end();
          console.log(`📂 Đã tạo Database "${PG_DATABASE}" với chuẩn UTF-8 thành công!`);
        } catch (dbErr) {
          // database might already exist
        }
      } catch (err) {
        console.warn('Không thể khởi động embedded postgres:', err.message);
      }
    } else {
      console.log(`✅ Port ${PG_PORT} đang mở sẵn.`);
    }
  }
}

const INITIAL_JARS_DATA = [
  {
    id: 'nec',
    name: 'Thiết yếu (NEC)',
    percent: 55,
    balance: 8250000,
    allocated: 13750000,
    color: 'from-amber-500 to-orange-600',
    border_color: 'border-amber-500/30',
    bg_light: 'bg-amber-500/10',
    text_color: 'text-amber-400',
    icon: 'ShoppingCart',
    description: 'Ăn uống, thuê nhà, hóa đơn, sinh hoạt hàng ngày'
  },
  {
    id: 'ffa',
    name: 'Tự do tài chính (FFA)',
    percent: 10,
    balance: 2500000,
    allocated: 2500000,
    color: 'from-emerald-500 to-teal-600',
    border_color: 'border-emerald-500/30',
    bg_light: 'bg-emerald-500/10',
    text_color: 'text-emerald-400',
    icon: 'TrendingUp',
    description: 'Đầu tư cổ phiếu, vàng, tạo nguồn thu nhập thụ động'
  },
  {
    id: 'ltss',
    name: 'Tiết kiệm dài hạn (LTSS)',
    percent: 10,
    balance: 2100000,
    allocated: 2500000,
    color: 'from-blue-500 to-indigo-600',
    border_color: 'border-blue-500/30',
    bg_light: 'bg-blue-500/10',
    text_color: 'text-blue-400',
    icon: 'ShieldCheck',
    description: 'Quỹ khẩn cấp, mua sắm lớn, bảo hiểm nhân thọ'
  },
  {
    id: 'edu',
    name: 'Phát triển bản thân (EDU)',
    percent: 10,
    balance: 1800000,
    allocated: 2500000,
    color: 'from-purple-500 to-violet-600',
    border_color: 'border-purple-500/30',
    bg_light: 'bg-purple-500/10',
    text_color: 'text-purple-400',
    icon: 'BookOpen',
    description: 'Sách, khóa học trực tuyến, chứng chỉ nghề nghiệp'
  },
  {
    id: 'play',
    name: 'Hưởng thụ (PLAY)',
    percent: 10,
    balance: 950000,
    allocated: 2500000,
    color: 'from-pink-500 to-rose-600',
    border_color: 'border-pink-500/30',
    bg_light: 'bg-pink-500/10',
    text_color: 'text-pink-400',
    icon: 'PartyPopper',
    description: 'Cà phê bạn bè, du lịch xả stress, tự thưởng bản thân'
  },
  {
    id: 'give',
    name: 'Cho đi (GIVE)',
    percent: 5,
    balance: 750000,
    allocated: 1250000,
    color: 'from-cyan-500 to-sky-600',
    border_color: 'border-cyan-500/30',
    bg_light: 'bg-cyan-500/10',
    text_color: 'text-cyan-400',
    icon: 'HeartHandshake',
    description: 'Làm từ thiện, quà biếu ông bà bố mẹ, chia sẻ cộng đồng'
  }
];

const INITIAL_HABITS_DATA = [
  {
    id: 'h-1',
    title: 'Ghi chép chi tiêu trước 22:00',
    category: 'Tài chính',
    completed_dates: [
      new Date(Date.now() - 3600000 * 24 * 3).toISOString().slice(0, 10),
      new Date(Date.now() - 3600000 * 24 * 2).toISOString().slice(0, 10),
      new Date(Date.now() - 3600000 * 24 * 1).toISOString().slice(0, 10),
      new Date().toISOString().slice(0, 10)
    ]
  },
  {
    id: 'h-2',
    title: 'Nấu ăn tại nhà (không gọi đồ ngoài)',
    category: 'Tiết kiệm',
    completed_dates: [
      new Date(Date.now() - 3600000 * 24 * 2).toISOString().slice(0, 10),
      new Date().toISOString().slice(0, 10)
    ]
  },
  {
    id: 'h-3',
    title: 'Đọc 20 trang sách phát triển / đầu tư',
    category: 'Học tập',
    completed_dates: [
      new Date(Date.now() - 3600000 * 24 * 4).toISOString().slice(0, 10),
      new Date(Date.now() - 3600000 * 24 * 3).toISOString().slice(0, 10),
      new Date(Date.now() - 3600000 * 24 * 2).toISOString().slice(0, 10),
      new Date(Date.now() - 3600000 * 24 * 1).toISOString().slice(0, 10),
      new Date().toISOString().slice(0, 10)
    ]
  },
  {
    id: 'h-4',
    title: 'Kiểm tra ngân sách & không tiêu lẹm hũ',
    category: 'Kỷ luật',
    completed_dates: [
      new Date(Date.now() - 3600000 * 24 * 1).toISOString().slice(0, 10),
      new Date().toISOString().slice(0, 10)
    ]
  },
  {
    id: 'h-5',
    title: 'Tập thể dục 30 phút rèn luyện sức bền',
    category: 'Sức khỏe',
    completed_dates: [
      new Date(Date.now() - 3600000 * 24 * 2).toISOString().slice(0, 10),
      new Date(Date.now() - 3600000 * 24 * 1).toISOString().slice(0, 10)
    ]
  }
];

export async function initDatabase() {
  try {
    // 1. Ensure Postgres is running
    await ensureLocalPostgres();

    console.log(`📡 Đang kết nối tới PostgreSQL (${poolConfig.user}@${poolConfig.host}:${poolConfig.port}/${poolConfig.database})...`);
    
    // 2. Test connection
    const client = await pool.connect();
    await client.query("SET CLIENT_ENCODING TO 'UTF8'");
    console.log('✅ Kết nối PostgreSQL thành công!');
    dbStatus.isConnected = true;
    dbStatus.error = null;

    try {
      // 3. Create tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS jars (
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

        CREATE TABLE IF NOT EXISTS transactions (
          id VARCHAR(100) PRIMARY KEY,
          date VARCHAR(20) NOT NULL,
          type VARCHAR(50) NOT NULL,
          jar_id VARCHAR(50),
          to_jar_id VARCHAR(50),
          amount BIGINT NOT NULL,
          note TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS habits (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          completed_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS settings (
          key VARCHAR(100) PRIMARY KEY,
          value JSONB NOT NULL
        );

        -- Comments for jars
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

        -- Comments for transactions
        COMMENT ON TABLE transactions IS 'Bảng lưu trữ lịch sử giao dịch tài chính (Thu nhập, Chi tiêu, Điều chuyển tiền giữa các hũ)';
        COMMENT ON COLUMN transactions.id IS 'Mã định danh duy nhất của giao dịch (VD: tx-1728888888888)';
        COMMENT ON COLUMN transactions.date IS 'Ngày phát sinh giao dịch (Định dạng: YYYY-MM-DD)';
        COMMENT ON COLUMN transactions.type IS 'Loại giao dịch: expense (chi tiêu), income_distribute (chia lương), transfer (chuyển tiền giữa các hũ)';
        COMMENT ON COLUMN transactions.jar_id IS 'Mã hũ nguồn bị trừ tiền hoặc hũ chi (giá trị all nếu là phân bổ thu nhập)';
        COMMENT ON COLUMN transactions.to_jar_id IS 'Mã hũ đích nhận tiền (chỉ áp dụng cho giao dịch chuyển tiền transfer)';
        COMMENT ON COLUMN transactions.amount IS 'Số tiền giao dịch thực tế (Đơn vị tính: VNĐ)';
        COMMENT ON COLUMN transactions.note IS 'Ghi chú, nội dung chi tiết mục đích giao dịch';
        COMMENT ON COLUMN transactions.created_at IS 'Thời gian tạo bản ghi giao dịch trong CSDL';

        -- Comments for habits
        COMMENT ON TABLE habits IS 'Bảng theo dõi kỷ luật thói quen tài chính hàng ngày (HabitFlow VN)';
        COMMENT ON COLUMN habits.id IS 'Mã định danh duy nhất của thói quen (VD: h-1, h-1728888888888)';
        COMMENT ON COLUMN habits.title IS 'Tên thói quen tài chính / phát triển bản thân cần rèn luyện';
        COMMENT ON COLUMN habits.category IS 'Nhóm phân loại thói quen: Tài chính, Tiết kiệm, Học tập, Kỷ luật, Sức khỏe';
        COMMENT ON COLUMN habits.completed_dates IS 'Mảng JSON lưu trữ danh sách các ngày đã hoàn thành thói quen (VD: ["2026-10-14"])';
        COMMENT ON COLUMN habits.created_at IS 'Thời gian tạo thói quen trong hệ thống';

        -- Comments for settings
        COMMENT ON TABLE settings IS 'Bảng cấu hình và thiết lập tham số hệ thống ứng dụng';
        COMMENT ON COLUMN settings.key IS 'Khóa định danh cấu hình (Khóa chính, VD: strict_lock)';
        COMMENT ON COLUMN settings.value IS 'Giá trị cấu hình dạng JSONB (VD: true/false)';
      `);

      // 4. Check and seed jars
      const jarsCountRes = await client.query('SELECT COUNT(*) FROM jars');
      if (parseInt(jarsCountRes.rows[0].count, 10) === 0) {
        console.log('🌱 Đang khởi tạo dữ liệu mẫu cho 6 Hũ Chi Tiêu...');
        for (const jar of INITIAL_JARS_DATA) {
          await client.query(
            `INSERT INTO jars (id, name, percent, balance, allocated, color, border_color, bg_light, text_color, icon, description)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
              jar.id,
              jar.name,
              jar.percent,
              jar.balance,
              jar.allocated,
              jar.color,
              jar.border_color,
              jar.bg_light,
              jar.text_color,
              jar.icon,
              jar.description
            ]
          );
        }
      }

      // 5. Check and seed habits
      const habitsCountRes = await client.query('SELECT COUNT(*) FROM habits');
      if (parseInt(habitsCountRes.rows[0].count, 10) === 0) {
        console.log('🌱 Đang khởi tạo dữ liệu thói quen HabitFlow...');
        for (const h of INITIAL_HABITS_DATA) {
          await client.query(
            `INSERT INTO habits (id, title, category, completed_dates)
             VALUES ($1, $2, $3, $4)`,
            [h.id, h.title, h.category, JSON.stringify(h.completed_dates)]
          );
        }
      }

      // 6. Default settings
      await client.query(`
        INSERT INTO settings (key, value)
        VALUES ('strict_lock', 'true'::jsonb)
        ON CONFLICT (key) DO NOTHING;
      `);

      console.log('🎉 Khởi tạo cấu trúc bảng PostgreSQL hoàn tất!');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ Lỗi kết nối PostgreSQL:', err.message);
    dbStatus.isConnected = false;
    dbStatus.error = err.message;
  }
}
