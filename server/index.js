import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, dbStatus, initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health check & DB Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    database: dbStatus
  });
});

// 2. JARS ENDPOINTS
app.get('/api/jars', async (req, res) => {
  try {
    if (!dbStatus.isConnected) {
      return res.status(503).json({ error: 'Database chưa kết nối', details: dbStatus.error });
    }
    const result = await pool.query('SELECT * FROM jars ORDER BY percent DESC, name ASC');
    // Map column names for frontend compatibility
    const jars = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      percent: Number(row.percent),
      balance: Number(row.balance),
      allocated: Number(row.allocated),
      color: row.color,
      borderColor: row.border_color,
      bgLight: row.bg_light,
      textColor: row.text_color,
      icon: row.icon,
      desc: row.description
    }));
    res.json(jars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Distribute Income to 6 Jars
app.post('/api/jars/income', async (req, res) => {
  const { amount, note } = req.body;
  const numAmount = Number(amount);

  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ error: 'Số tiền thu nhập không hợp lệ' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get current jars
    const jarsRes = await client.query('SELECT id, percent, balance, allocated FROM jars');
    const jars = jarsRes.rows;

    for (const jar of jars) {
      const share = Math.round((numAmount * jar.percent) / 100);
      await client.query(
        'UPDATE jars SET balance = balance + $1, allocated = allocated + $1 WHERE id = $2',
        [share, jar.id]
      );
    }

    // Record transaction
    const txId = `tx-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    const txNote = note || 'Phân bổ thu nhập tự động theo tỷ lệ 6 Hũ';

    await client.query(
      `INSERT INTO transactions (id, date, type, jar_id, amount, note)
       VALUES ($1, $2, 'income_distribute', 'all', $3, $4)`,
      [txId, today, numAmount, txNote]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Phân bổ thu nhập thành công' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Transfer funds between jars
app.post('/api/jars/transfer', async (req, res) => {
  const { fromJarId, toJarId, amount, note } = req.body;
  const numAmount = Number(amount);

  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ error: 'Số tiền chuyển không hợp lệ' });
  }
  if (fromJarId === toJarId) {
    return res.status(400).json({ error: 'Hũ nguồn và hũ đích không được trùng nhau' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Deduct from source
    await client.query('UPDATE jars SET balance = balance - $1 WHERE id = $2', [numAmount, fromJarId]);
    // Add to destination
    await client.query('UPDATE jars SET balance = balance + $1 WHERE id = $2', [numAmount, toJarId]);

    // Record transaction
    const txId = `tx-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    await client.query(
      `INSERT INTO transactions (id, date, type, jar_id, to_jar_id, amount, note)
       VALUES ($1, $2, 'transfer', $3, $4, $5, $6)`,
      [txId, today, fromJarId, toJarId, numAmount, note || 'Chuyển tiền giữa các hũ']
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Chuyển tiền giữa các hũ thành công' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// 3. TRANSACTIONS ENDPOINTS
app.get('/api/transactions', async (req, res) => {
  try {
    if (!dbStatus.isConnected) {
      return res.status(503).json({ error: 'Database chưa kết nối', details: dbStatus.error });
    }
    const { jarId, search } = req.query;
    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params = [];

    if (jarId && jarId !== 'all') {
      params.push(jarId);
      query += ` AND (jar_id = $${params.length} OR to_jar_id = $${params.length})`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (note ILIKE $${params.length} OR CAST(amount AS TEXT) LIKE $${params.length})`;
    }

    query += ' ORDER BY date DESC, created_at DESC LIMIT 100';

    const result = await pool.query(query, params);
    const transactions = result.rows.map(row => ({
      id: row.id,
      date: row.date,
      type: row.type,
      jarId: row.jar_id,
      toJarId: row.to_jar_id,
      amount: Number(row.amount),
      note: row.note
    }));

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { jarId, amount, note, date } = req.body;
  const numAmount = Number(amount);

  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ error: 'Số tiền chi không hợp lệ' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Deduct from jar balance
    await client.query('UPDATE jars SET balance = balance - $1 WHERE id = $2', [numAmount, jarId]);

    // Insert expense
    const txId = `tx-${Date.now()}`;
    const txDate = date || new Date().toISOString().slice(0, 10);

    await client.query(
      `INSERT INTO transactions (id, date, type, jar_id, amount, note)
       VALUES ($1, $2, 'expense', $3, $4, $5)`,
      [txId, txDate, jarId, numAmount, note || 'Chi tiêu']
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Đã lưu khoản chi tiêu', id: txId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
    res.json({ success: true, message: 'Đã xóa giao dịch' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. HABITS ENDPOINTS
app.get('/api/habits', async (req, res) => {
  try {
    if (!dbStatus.isConnected) {
      return res.status(503).json({ error: 'Database chưa kết nối', details: dbStatus.error });
    }
    const result = await pool.query('SELECT * FROM habits ORDER BY created_at ASC');
    const habits = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      completedDates: Array.isArray(row.completed_dates) ? row.completed_dates : []
    }));
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/habits', async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Tiêu đề thói quen không được để trống' });
    }

    const id = `h-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    const completedDates = [today];

    await pool.query(
      `INSERT INTO habits (id, title, category, completed_dates)
       VALUES ($1, $2, $3, $4)`,
      [id, title.trim(), category || 'Tài chính', JSON.stringify(completedDates)]
    );

    res.json({ success: true, habit: { id, title: title.trim(), category, completedDates } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/habits/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const habitRes = await pool.query('SELECT completed_dates FROM habits WHERE id = $1', [id]);
    if (habitRes.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thói quen' });
    }

    let dates = habitRes.rows[0].completed_dates || [];
    if (!Array.isArray(dates)) dates = [];

    if (dates.includes(date)) {
      dates = dates.filter(d => d !== date);
    } else {
      dates.push(date);
    }

    await pool.query('UPDATE habits SET completed_dates = $1 WHERE id = $2', [JSON.stringify(dates), id]);
    res.json({ success: true, completedDates: dates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/habits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM habits WHERE id = $1', [id]);
    res.json({ success: true, message: 'Đã xóa thói quen' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. SETTINGS ENDPOINTS
app.get('/api/settings', async (req, res) => {
  try {
    if (!dbStatus.isConnected) {
      return res.status(503).json({ error: 'Database chưa kết nối', details: dbStatus.error });
    }
    const result = await pool.query('SELECT key, value FROM settings');
    const settings = {};
    result.rows.forEach(r => {
      settings[r.key] = r.value;
    });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings/strict-lock', async (req, res) => {
  try {
    const { value } = req.body;
    await pool.query(
      `INSERT INTO settings (key, value)
       VALUES ('strict_lock', $1)
       ON CONFLICT (key) DO UPDATE SET value = $1`,
      [JSON.stringify(Boolean(value))]
    );
    res.json({ success: true, strictLock: Boolean(value) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start DB & Express Server
initDatabase().finally(() => {
  app.listen(PORT, () => {
    console.log(`🚀 JarsFinance API Server đang chạy tại http://localhost:${PORT}`);
  });
});
