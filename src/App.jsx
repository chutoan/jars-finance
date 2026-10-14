import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Wallet,
  Lock,
  Unlock,
  ShieldAlert,
  ArrowRightLeft,
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  Circle,
  Flame,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  PieChart,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  HeartHandshake,
  BookOpen,
  PartyPopper,
  ShieldCheck,
  ShoppingCart,
  Award,
  Database,
  Server,
  Check,
  X,
  FileCode2,
  SlidersHorizontal,
  Settings,
  History,
  Eye,
  Search,
  ExternalLink,
  ArrowRight,
  Clock,
  RotateCcw
} from 'lucide-react';

const STORAGE_KEY = 'jars_finance_habit_vn_v1';

const FALLBACK_JARS = [
  {
    id: 'nec',
    name: 'Thiết yếu (NEC)',
    percent: 55,
    balance: 8250000,
    allocated: 13750000,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
    bgLight: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    icon: 'ShoppingCart',
    desc: 'Ăn uống, thuê nhà, hóa đơn, sinh hoạt hàng ngày'
  },
  {
    id: 'ffa',
    name: 'Tự do tài chính (FFA)',
    percent: 10,
    balance: 2500000,
    allocated: 2500000,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    bgLight: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    icon: 'TrendingUp',
    desc: 'Đầu tư cổ phiếu, vàng, tạo nguồn thu nhập thụ động'
  },
  {
    id: 'ltss',
    name: 'Tiết kiệm dài hạn (LTSS)',
    percent: 10,
    balance: 2100000,
    allocated: 2500000,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500/30',
    bgLight: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    icon: 'ShieldCheck',
    desc: 'Quỹ khẩn cấp, mua sắm lớn, bảo hiểm nhân thọ'
  },
  {
    id: 'edu',
    name: 'Phát triển bản thân (EDU)',
    percent: 10,
    balance: 1800000,
    allocated: 2500000,
    color: 'from-purple-500 to-violet-600',
    borderColor: 'border-purple-500/30',
    bgLight: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    icon: 'BookOpen',
    desc: 'Sách, khóa học trực tuyến, chứng chỉ nghề nghiệp'
  },
  {
    id: 'play',
    name: 'Hưởng thụ (PLAY)',
    percent: 10,
    balance: 950000,
    allocated: 2500000,
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500/30',
    bgLight: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    icon: 'PartyPopper',
    desc: 'Cà phê bạn bè, du lịch xả stress, tự thưởng bản thân'
  },
  {
    id: 'give',
    name: 'Cho đi (GIVE)',
    percent: 5,
    balance: 750000,
    allocated: 1250000,
    color: 'from-cyan-500 to-sky-600',
    borderColor: 'border-cyan-500/30',
    bgLight: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    icon: 'HeartHandshake',
    desc: 'Làm từ thiện, quà biếu ông bà bố mẹ, chia sẻ cộng đồng'
  }
];

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

function getJarIcon(iconName) {
  switch (iconName) {
    case 'ShoppingCart': return <ShoppingCart className="w-5 h-5" />;
    case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
    case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
    case 'BookOpen': return <BookOpen className="w-5 h-5" />;
    case 'PartyPopper': return <PartyPopper className="w-5 h-5" />;
    case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
    default: return <Wallet className="w-5 h-5" />;
  }
}

// Calendar-Only Date Picker Component (Chỉ cho phép chọn lịch, không cho nhập bàn phím)
function DatePickerInput({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  min = '2000-01-01',
  max = '2099-12-31',
  className = '',
  accentColor = 'emerald'
}) {
  const inputRef = useRef(null);

  const handleOpenPicker = () => {
    try {
      if (inputRef.current?.showPicker) {
        inputRef.current.showPicker();
      } else {
        inputRef.current?.focus();
      }
    } catch (_) {
      inputRef.current?.focus();
    }
  };

  const formattedDate = useMemo(() => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return value;
  }, [value]);

  const colorStyles = {
    emerald: {
      active: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 hover:border-emerald-400',
      icon: 'text-emerald-400'
    },
    indigo: {
      active: 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200 hover:border-indigo-400',
      icon: 'text-indigo-400'
    },
    rose: {
      active: 'bg-rose-950/60 border-rose-500/50 text-rose-200 hover:border-rose-400',
      icon: 'text-rose-400'
    }
  };

  const currentTheme = colorStyles[accentColor] || colorStyles.emerald;

  return (
    <div
      onClick={handleOpenPicker}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer select-none transition-all group ${
        value
          ? currentTheme.active
          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
      } ${className}`}
      title="Bấm để mở lịch chọn ngày"
    >
      <Calendar className={`w-3.5 h-3.5 flex-shrink-0 ${value ? currentTheme.icon : 'text-slate-400 group-hover:text-slate-300'}`} />

      <span className="text-xs font-semibold tracking-wide">
        {formattedDate || placeholder}
      </span>

      {/* Hidden input overlay that handles calendar picker */}
      <input
        ref={inputRef}
        type="date"
        value={value || ''}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // Chặn hoàn toàn việc gõ phím để chỉ cho chọn bằng lịch
          if (e.key !== 'Tab') {
            e.preventDefault();
          }
        }}
        onClick={(e) => {
          try {
            e.target.showPicker();
          } catch (_) {}
        }}
        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        tabIndex={0}
      />

      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange('');
          }}
          className="ml-auto p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors z-10 cursor-pointer"
          title="Xóa ngày đã chọn"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export default function App() {
  // DB Connection State
  const [dbInfo, setDbInfo] = useState({
    isConnected: false,
    database: 'jars_finance',
    host: 'localhost',
    error: null,
    loading: true
  });
  const [showDbConfigModal, setShowDbConfigModal] = useState(false);

  // App State
  const [jars, setJars] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_jars`);
    return saved ? JSON.parse(saved) : FALLBACK_JARS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_txs`);
    return saved ? JSON.parse(saved) : [];
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_habits`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isStrictLock, setIsStrictLock] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_lock`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState('jars');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isPercentModalOpen, setIsPercentModalOpen] = useState(false);
  const [editingPercents, setEditingPercents] = useState({});
  const [overdraftAlert, setOverdraftAlert] = useState(null);

  // Jar detail transactions modal state
  const [selectedDetailJar, setSelectedDetailJar] = useState(null);
  const [jarDetailSearch, setJarDetailSearch] = useState('');
  const [jarDetailTypeFilter, setJarDetailTypeFilter] = useState('all');
  const [jarTimePreset, setJarTimePreset] = useState('all');
  const [jarStartDate, setJarStartDate] = useState('');
  const [jarEndDate, setJarEndDate] = useState('');
  const [jarFilterMonth, setJarFilterMonth] = useState('all');
  const [jarFilterYear, setJarFilterYear] = useState('all');

  // Form states
  const [selectedJarId, setSelectedJarId] = useState('nec');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNote, setExpenseNote] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeNote, setIncomeNote] = useState('Thu nhập lương tháng');

  const [fromJarId, setFromJarId] = useState('nec');
  const [toJarId, setToJarId] = useState('play');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');

  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Tài chính');

  // Filter (Tab 3: Sổ Giao Dịch)
  const [txFilterJar, setTxFilterJar] = useState('all');
  const [txSearch, setTxSearch] = useState('');
  const [txTimePreset, setTxTimePreset] = useState('all'); // 'all', 'today', 'yesterday', 'week', 'this_month', 'last_month', 'this_year', 'custom'
  const [txStartDate, setTxStartDate] = useState('');
  const [txEndDate, setTxEndDate] = useState('');
  const [txFilterMonth, setTxFilterMonth] = useState('all'); // 'all', '1'..'12'
  const [txFilterYear, setTxFilterYear] = useState('all'); // 'all', '2025', '2026', ...

  // Toast
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check DB & Load Data from PostgreSQL
  const checkDatabaseAndSync = useCallback(async () => {
    setDbInfo((prev) => ({ ...prev, loading: true }));
    try {
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        const isConn = healthData?.database?.isConnected || false;

        setDbInfo({
          isConnected: isConn,
          database: healthData?.database?.database || 'jars_finance',
          host: healthData?.database?.host || 'localhost',
          error: healthData?.database?.error,
          loading: false
        });

        if (isConn) {
          // Fetch real data from PostgreSQL tables
          const [jarsRes, txsRes, habitsRes, settingsRes] = await Promise.all([
            fetch('/api/jars'),
            fetch('/api/transactions'),
            fetch('/api/habits'),
            fetch('/api/settings')
          ]);

          if (jarsRes.ok) {
            const jarsData = await jarsRes.json();
            if (Array.isArray(jarsData) && jarsData.length > 0) {
              setJars(jarsData);
            }
          }
          if (txsRes.ok) {
            const txsData = await txsRes.json();
            if (Array.isArray(txsData)) {
              setTransactions(txsData);
            }
          }
          if (habitsRes.ok) {
            const habitsData = await habitsRes.json();
            if (Array.isArray(habitsData)) {
              setHabits(habitsData);
            }
          }
          if (settingsRes.ok) {
            const settingsData = await settingsRes.json();
            if (settingsData && settingsData.strict_lock !== undefined) {
              setIsStrictLock(Boolean(settingsData.strict_lock));
            }
          }
          showToast('✅ Đã kết nối và đồng bộ dữ liệu với PostgreSQL thành công!');
        } else {
          showToast('⚠️ PostgreSQL chưa kết nối. Đang dùng bộ nhớ cục bộ.', 'error');
        }
      } else {
        setDbInfo((prev) => ({ ...prev, isConnected: false, loading: false }));
      }
    } catch (err) {
      setDbInfo((prev) => ({ ...prev, isConnected: false, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    checkDatabaseAndSync();
  }, [checkDatabaseAndSync]);

  // Persist local cache
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_jars`, JSON.stringify(jars));
  }, [jars]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_txs`, JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_habits`, JSON.stringify(habits));
  }, [habits]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_lock`, JSON.stringify(isStrictLock));
  }, [isStrictLock]);

  // Calculations
  const totalBalance = useMemo(() => {
    return jars.reduce((sum, j) => sum + (Number(j.balance) || 0), 0);
  }, [jars]);

  const totalAllocated = useMemo(() => {
    return jars.reduce((sum, j) => sum + (Number(j.allocated) || 0), 0);
  }, [jars]);

  const totalSpent = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions]);

  // 1. ADD EXPENSE (With PostgreSQL API + Strict Lock)
  const handleAddExpense = async (e) => {
    e?.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (!amount || amount <= 0) {
      showToast('Vui lòng nhập số tiền hợp lệ!', 'error');
      return;
    }

    const targetJar = jars.find((j) => j.id === selectedJarId);
    if (!targetJar) return;

    // Strict lock check
    if (isStrictLock && amount > targetJar.balance) {
      const deficit = amount - targetJar.balance;
      setOverdraftAlert({
        targetJar,
        attemptedAmount: amount,
        deficit,
        currentBalance: targetJar.balance,
        note: expenseNote
      });
      setIsExpenseModalOpen(false);
      return;
    }

    if (dbInfo.isConnected) {
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jarId: selectedJarId,
            amount,
            note: expenseNote.trim() || `Chi tiêu từ hũ ${targetJar.name}`,
            date: expenseDate || new Date().toISOString().slice(0, 10)
          })
        });

        if (res.ok) {
          const [updatedJars, updatedTxs] = await Promise.all([
            fetch('/api/jars').then((r) => r.json()),
            fetch('/api/transactions').then((r) => r.json())
          ]);
          setJars(updatedJars);
          setTransactions(updatedTxs);
          showToast(`Đã lưu chi tiêu ${formatVND(amount)} vào PostgreSQL!`);
        } else {
          const err = await res.json();
          showToast(`Lỗi: ${err.error}`, 'error');
        }
      } catch (err) {
        showToast(`Lỗi lưu vào DB: ${err.message}`, 'error');
      }
    } else {
      // Local fallback
      setJars((prev) =>
        prev.map((j) =>
          j.id === selectedJarId ? { ...j, balance: j.balance - amount } : j
        )
      );
      const newTx = {
        id: `tx-${Date.now()}`,
        date: expenseDate || new Date().toISOString().slice(0, 10),
        type: 'expense',
        jarId: selectedJarId,
        amount,
        note: expenseNote.trim() || `Chi tiêu từ hũ ${targetJar.name}`
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(`Đã ghi nhận chi tiêu ${formatVND(amount)} (Lưu cục bộ)`);
    }

    setIsExpenseModalOpen(false);
    setExpenseAmount('');
    setExpenseNote('');
    setExpenseDate(new Date().toISOString().slice(0, 10));
  };

  // 2. DISTRIBUTE INCOME
  const handleDistributeIncome = async (e) => {
    e?.preventDefault();
    const amount = parseFloat(incomeAmount);
    if (!amount || amount <= 0) {
      showToast('Vui lòng nhập số tiền thu nhập hợp lệ!', 'error');
      return;
    }

    if (dbInfo.isConnected) {
      try {
        const res = await fetch('/api/jars/income', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            note: incomeNote.trim() || 'Phân bổ thu nhập tự động theo tỷ lệ 6 Hũ'
          })
        });

        if (res.ok) {
          const [updatedJars, updatedTxs] = await Promise.all([
            fetch('/api/jars').then((r) => r.json()),
            fetch('/api/transactions').then((r) => r.json())
          ]);
          setJars(updatedJars);
          setTransactions(updatedTxs);
          showToast(`Đã phân bổ ${formatVND(amount)} và lưu vào PostgreSQL!`);
        } else {
          const err = await res.json();
          showToast(`Lỗi: ${err.error}`, 'error');
        }
      } catch (err) {
        showToast(`Lỗi: ${err.message}`, 'error');
      }
    } else {
      setJars((prev) =>
        prev.map((jar) => {
          const share = Math.round((amount * jar.percent) / 100);
          return {
            ...jar,
            balance: jar.balance + share,
            allocated: (jar.allocated || 0) + share
          };
        })
      );
      const newTx = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        type: 'income_distribute',
        jarId: 'all',
        amount,
        note: incomeNote.trim() || 'Phân bổ thu nhập tự động theo tỷ lệ 6 Hũ'
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(`Đã tự động phân bổ ${formatVND(amount)} vào 6 hũ (Lưu cục bộ)!`);
    }

    setIsIncomeModalOpen(false);
    setIncomeAmount('');
  };

  // 3. TRANSFER
  const handleTransfer = async (e) => {
    e?.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      showToast('Vui lòng nhập số tiền hợp lệ!', 'error');
      return;
    }
    if (fromJarId === toJarId) {
      showToast('Hũ nguồn và hũ đích không được trùng nhau!', 'error');
      return;
    }

    const sourceJar = jars.find((j) => j.id === fromJarId);
    const destJar = jars.find((j) => j.id === toJarId);

    if (isStrictLock && amount > sourceJar.balance) {
      showToast(`Hũ ${sourceJar.name} không đủ số dư để chuyển ${formatVND(amount)}!`, 'error');
      return;
    }

    if (dbInfo.isConnected) {
      try {
        const res = await fetch('/api/jars/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromJarId,
            toJarId,
            amount,
            note: transferNote.trim() || `Chuyển từ ${sourceJar.name} sang ${destJar.name}`
          })
        });

        if (res.ok) {
          const [updatedJars, updatedTxs] = await Promise.all([
            fetch('/api/jars').then((r) => r.json()),
            fetch('/api/transactions').then((r) => r.json())
          ]);
          setJars(updatedJars);
          setTransactions(updatedTxs);
          showToast(`Đã chuyển ${formatVND(amount)} và ghi nhận vào PostgreSQL!`);
        }
      } catch (err) {
        showToast(`Lỗi: ${err.message}`, 'error');
      }
    } else {
      setJars((prev) =>
        prev.map((j) => {
          if (j.id === fromJarId) return { ...j, balance: j.balance - amount };
          if (j.id === toJarId) return { ...j, balance: j.balance + amount };
          return j;
        })
      );
      const newTx = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        type: 'transfer',
        jarId: fromJarId,
        toJarId: toJarId,
        amount,
        note: transferNote.trim() || `Chuyển từ ${sourceJar.name} sang ${destJar.name}`
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(`Đã chuyển ${formatVND(amount)} từ ${sourceJar.name} sang ${destJar.name}`);
    }

    setIsTransferModalOpen(false);
    setTransferAmount('');
    setTransferNote('');
  };

  // 3.5. SAVE CUSTOM JARS PERCENTAGES
  const handleSavePercentages = async (e) => {
    e?.preventDefault();
    const total = Object.values(editingPercents).reduce(
      (sum, v) => sum + (parseInt(v, 10) || 0),
      0
    );
    if (total !== 100) {
      showToast(`Tổng tỷ lệ phải bằng đúng 100%! Hiện tại là ${total}%`, 'error');
      return;
    }

    const payload = Object.entries(editingPercents).map(([id, percent]) => ({
      id,
      percent: parseInt(percent, 10)
    }));

    if (dbInfo.isConnected) {
      try {
        const res = await fetch('/api/jars/percentages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ percentages: payload })
        });
        if (res.ok) {
          const updatedJars = await fetch('/api/jars').then((r) => r.json());
          setJars(updatedJars);
          showToast('✅ Đã lưu cấu hình tỷ lệ phân bổ vào PostgreSQL!');
          setIsPercentModalOpen(false);
        } else {
          const err = await res.json();
          showToast(`Lỗi: ${err.error}`, 'error');
        }
      } catch (err) {
        showToast(`Lỗi: ${err.message}`, 'error');
      }
    } else {
      setJars((prev) =>
        prev.map((j) => ({
          ...j,
          percent: parseInt(editingPercents[j.id] ?? j.percent, 10)
        }))
      );
      showToast('✅ Đã lưu cấu hình tỷ lệ phân bổ (Cục bộ)!');
      setIsPercentModalOpen(false);
    }
  };

  // 4. HABITS
  const todayStr = new Date().toISOString().slice(0, 10);

  const toggleHabitDate = async (habitId, dateStr) => {
    if (dbInfo.isConnected) {
      try {
        const res = await fetch(`/api/habits/${habitId}/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: dateStr })
        });
        if (res.ok) {
          const { completedDates } = await res.json();
          setHabits((prev) =>
            prev.map((h) => (h.id === habitId ? { ...h, completedDates } : h))
          );
        }
      } catch (err) {
        showToast(`Lỗi cập nhật thói quen: ${err.message}`, 'error');
      }
    } else {
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h;
          const exists = h.completedDates.includes(dateStr);
          const updated = exists
            ? h.completedDates.filter((d) => d !== dateStr)
            : [...h.completedDates, dateStr];
          return { ...h, completedDates: updated };
        })
      );
    }
  };

  const handleAddHabit = async (e) => {
    e?.preventDefault();
    if (!newHabitTitle.trim()) return;

    if (dbInfo.isConnected) {
      try {
        const res = await fetch('/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newHabitTitle.trim(),
            category: newHabitCategory
          })
        });
        if (res.ok) {
          const { habit } = await res.json();
          setHabits((prev) => [...prev, habit]);
          showToast('Đã thêm thói quen mới vào PostgreSQL!');
        }
      } catch (err) {
        showToast(`Lỗi: ${err.message}`, 'error');
      }
    } else {
      const newHabit = {
        id: `h-${Date.now()}`,
        title: newHabitTitle.trim(),
        category: newHabitCategory,
        completedDates: [todayStr]
      };
      setHabits((prev) => [...prev, newHabit]);
      showToast('Đã thêm thói quen mới!');
    }

    setNewHabitTitle('');
    setIsHabitModalOpen(false);
  };

  const handleDeleteHabit = async (id) => {
    if (dbInfo.isConnected) {
      try {
        await fetch(`/api/habits/${id}`, { method: 'DELETE' });
      } catch (e) {
        console.error(e);
      }
    }
    setHabits((prev) => prev.filter((h) => h.id !== id));
    showToast('Đã xóa thói quen');
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Xác nhận xóa giao dịch này khỏi CSDL?')) {
      if (dbInfo.isConnected) {
        try {
          await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
        } catch (e) {
          console.error(e);
        }
      }
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast('Đã xóa giao dịch');
    }
  };

  const handleToggleStrictLock = async () => {
    const next = !isStrictLock;
    setIsStrictLock(next);

    if (dbInfo.isConnected) {
      try {
        await fetch('/api/settings/strict-lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: next })
        });
      } catch (e) {
        console.error(e);
      }
    }

    showToast(
      next
        ? '🔒 Đã kích hoạt Chặn chi tiêu vượt hũ!'
        : '🔓 Đã mở khóa tự do chi tiêu (cho phép âm số dư)'
    );
  };

  const last7Days = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - 3600000 * 24 * i);
      list.push({
        dateStr: d.toISOString().slice(0, 10),
        dayName: i === 0 ? 'Hôm nay' : `T${d.getDay() === 0 ? 'CN' : d.getDay() + 1}`,
        formatted: `${d.getDate()}/${d.getMonth() + 1}`
      });
    }
    return list;
  }, []);

  // Date & Time filter helper function
  const isDateInRange = useCallback((dateStr, timePreset, customStart, customEnd, filterMonth, filterYear) => {
    if (!dateStr) return true;

    // Month & Year explicit filter
    if (filterYear && filterYear !== 'all') {
      if (!dateStr.startsWith(filterYear)) return false;
    }
    if (filterMonth && filterMonth !== 'all') {
      const monthNum = parseInt(dateStr.slice(5, 7), 10);
      if (monthNum !== parseInt(filterMonth, 10)) return false;
    }

    // Time preset filter
    if (!timePreset || timePreset === 'all') return true;

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    if (timePreset === 'today') {
      return dateStr === todayStr;
    }

    if (timePreset === 'yesterday') {
      const yest = new Date(today);
      yest.setDate(yest.getDate() - 1);
      return dateStr === yest.toISOString().slice(0, 10);
    }

    if (timePreset === 'week') {
      const past7 = new Date(today);
      past7.setDate(past7.getDate() - 7);
      const past7Str = past7.toISOString().slice(0, 10);
      return dateStr >= past7Str && dateStr <= todayStr;
    }

    if (timePreset === 'this_month') {
      const curMonthStr = today.toISOString().slice(0, 7);
      return dateStr.startsWith(curMonthStr);
    }

    if (timePreset === 'last_month') {
      const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);
      return dateStr.startsWith(lastMonthStr);
    }

    if (timePreset === 'this_year') {
      const curYearStr = String(today.getFullYear());
      return dateStr.startsWith(curYearStr);
    }

    if (timePreset === 'custom') {
      if (customStart && dateStr < customStart) return false;
      if (customEnd && dateStr > customEnd) return false;
      return true;
    }

    return true;
  }, []);

  // Dynamically extract available years from transaction history
  const availableYears = useMemo(() => {
    const curY = new Date().getFullYear();
    const setY = new Set([curY, curY - 1, curY + 1]);
    transactions.forEach((t) => {
      if (t.date && t.date.length >= 4) {
        const y = parseInt(t.date.slice(0, 4), 10);
        if (!isNaN(y)) setY.add(y);
      }
    });
    return Array.from(setY).sort((a, b) => b - a);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchJar =
        txFilterJar === 'all' ||
        t.jarId === txFilterJar ||
        t.toJarId === txFilterJar;
      const matchSearch =
        !txSearch ||
        (t.note && t.note.toLowerCase().includes(txSearch.toLowerCase())) ||
        String(t.amount).includes(txSearch);
      const matchDate = isDateInRange(
        t.date,
        txTimePreset,
        txStartDate,
        txEndDate,
        txFilterMonth,
        txFilterYear
      );
      return matchJar && matchSearch && matchDate;
    });
  }, [transactions, txFilterJar, txSearch, isDateInRange, txTimePreset, txStartDate, txEndDate, txFilterMonth, txFilterYear]);

  // Current selected jar reactive to jars updates
  const currentDetailJar = useMemo(() => {
    if (!selectedDetailJar) return null;
    return jars.find((j) => j.id === selectedDetailJar.id) || selectedDetailJar;
  }, [jars, selectedDetailJar]);

  // Calculations for the selected jar detail modal
  const detailJarStats = useMemo(() => {
    if (!selectedDetailJar) {
      return { totalIn: 0, totalOut: 0, expenseCount: 0, incomeCount: 0, transferInCount: 0, transferOutCount: 0, transferCount: 0, allCount: 0 };
    }

    let totalIn = 0;
    let totalOut = 0;
    let expenseCount = 0;
    let incomeCount = 0;
    let transferInCount = 0;
    let transferOutCount = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'expense' && tx.jarId === selectedDetailJar.id) {
        totalOut += Number(tx.amount) || 0;
        expenseCount++;
      } else if (tx.type === 'transfer') {
        if (tx.jarId === selectedDetailJar.id) {
          totalOut += Number(tx.amount) || 0;
          transferOutCount++;
        } else if (tx.toJarId === selectedDetailJar.id) {
          totalIn += Number(tx.amount) || 0;
          transferInCount++;
        }
      } else if (tx.type === 'income_distribute') {
        const share = Math.round(((Number(tx.amount) || 0) * selectedDetailJar.percent) / 100);
        totalIn += share;
        incomeCount++;
      }
    });

    const transferCount = transferInCount + transferOutCount;
    const allCount = expenseCount + incomeCount + transferCount;

    return {
      totalIn,
      totalOut,
      expenseCount,
      incomeCount,
      transferInCount,
      transferOutCount,
      transferCount,
      allCount
    };
  }, [transactions, selectedDetailJar]);

  // Detailed transactions list for selected jar with date/month/year/time filter
  const detailJarTransactions = useMemo(() => {
    if (!selectedDetailJar) return [];

    return transactions
      .map((tx) => {
        let isRelated = false;
        let displayAmount = Number(tx.amount) || 0;
        let txCategory = tx.type; // 'expense', 'income', 'transfer_in', 'transfer_out'
        let flowType = 'negative'; // 'positive' or 'negative'

        if (tx.type === 'expense' && tx.jarId === selectedDetailJar.id) {
          isRelated = true;
          txCategory = 'expense';
          flowType = 'negative';
          displayAmount = Number(tx.amount) || 0;
        } else if (tx.type === 'transfer') {
          if (tx.jarId === selectedDetailJar.id) {
            isRelated = true;
            txCategory = 'transfer_out';
            flowType = 'negative';
            displayAmount = Number(tx.amount) || 0;
          } else if (tx.toJarId === selectedDetailJar.id) {
            isRelated = true;
            txCategory = 'transfer_in';
            flowType = 'positive';
            displayAmount = Number(tx.amount) || 0;
          }
        } else if (tx.type === 'income_distribute') {
          isRelated = true;
          txCategory = 'income';
          flowType = 'positive';
          displayAmount = Math.round(((Number(tx.amount) || 0) * selectedDetailJar.percent) / 100);
        }

        if (!isRelated) return null;

        return {
          ...tx,
          txCategory,
          flowType,
          displayAmount
        };
      })
      .filter(Boolean)
      .filter((item) => {
        // Type filter
        if (jarDetailTypeFilter === 'expense' && item.txCategory !== 'expense') return false;
        if (jarDetailTypeFilter === 'income' && item.txCategory !== 'income') return false;
        if (jarDetailTypeFilter === 'transfer' && !item.txCategory.startsWith('transfer')) return false;

        // Date/Time filter
        const matchDate = isDateInRange(
          item.date,
          jarTimePreset,
          jarStartDate,
          jarEndDate,
          jarFilterMonth,
          jarFilterYear
        );
        if (!matchDate) return false;

        // Search filter
        if (jarDetailSearch) {
          const s = jarDetailSearch.toLowerCase();
          const matchNote = item.note && item.note.toLowerCase().includes(s);
          const matchAmount = String(item.displayAmount).includes(s) || String(item.amount).includes(s);
          const matchDateStr = item.date && item.date.includes(s);
          if (!matchNote && !matchAmount && !matchDateStr) return false;
        }
        return true;
      });
  }, [transactions, selectedDetailJar, jarDetailTypeFilter, jarDetailSearch, isDateInRange, jarTimePreset, jarStartDate, jarEndDate, jarFilterMonth, jarFilterYear]);

  const handleOpenTransferForOverdraft = () => {
    if (!overdraftAlert) return;
    const destId = overdraftAlert.targetJar.id;
    const viableSource = [...jars]
      .filter((j) => j.id !== destId)
      .sort((a, b) => b.balance - a.balance)[0];

    setFromJarId(viableSource ? viableSource.id : 'nec');
    setToJarId(destId);
    setTransferAmount(overdraftAlert.deficit.toString());
    setTransferNote(`Bù đắp thiếu hụt ${formatVND(overdraftAlert.deficit)} cho ${overdraftAlert.targetJar.name}`);
    setOverdraftAlert(null);
    setIsTransferModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-medium backdrop-blur-md transition-all ${
            toastMessage.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Database Connection Banner */}
      <div
        className={`px-4 py-2 text-xs border-b flex flex-wrap items-center justify-between gap-3 ${
          dbInfo.isConnected
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Database className={`w-4 h-4 ${dbInfo.isConnected ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
          {dbInfo.isConnected ? (
            <span>
              <strong>🟢 PostgreSQL Đã Kết Nối</strong>
            </span>
          ) : (
            <span>
              <strong>⚠️ Chưa kết nối được PostgreSQL:</strong> Đang chạy chế độ nhớ đệm. Hãy cấu hình tài khoản PostgreSQL trong file <code>.env</code> để lưu trữ vĩnh viễn vào CSDL.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={checkDatabaseAndSync}
            disabled={dbInfo.loading}
            className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${dbInfo.loading ? 'animate-spin' : ''}`} />
            <span>{dbInfo.loading ? 'Đang kiểm tra...' : 'Thử kết nối lại'}</span>
          </button>

          <button
            onClick={() => setShowDbConfigModal(true)}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <FileCode2 className="w-3 h-3" />
            <span>Xem Cấu Hình .env</span>
          </button>
        </div>
      </div>

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-200">
                Dashboard
              </h1>
              <p className="text-xs text-slate-400">
                Quản Lý 6 Hũ Chi Tiêu
              </p>
            </div>
          </div>

          {/* Right Action Bar & Strict Lock Toggle */}
          <div className="flex items-center gap-3">
            <div
              onClick={handleToggleStrictLock}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full cursor-pointer border transition-all select-none text-xs font-semibold ${
                isStrictLock
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
              title="Cơ chế bảo vệ: Khi bật, các khoản chi vượt số dư hũ sẽ bị chặn và kích hoạt gợi ý chuyển tiền từ hũ khác"
            >
              {isStrictLock ? (
                <>
                  <Lock className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>🔒 Chặn chi tiêu vượt hũ: BẬT</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-slate-400" />
                  <span>🔓 Chặn chi tiêu vượt hũ: TẮT</span>
                </>
              )}
            </div>

            <button
              onClick={() => setIsIncomeModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nhận Lương / Thu Nhập</span>
            </button>

            <button
              onClick={() => {
                setSelectedJarId('nec');
                setIsExpenseModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Ghi Chi Tiêu</span>
            </button>

            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
              title="Chuyển tiền giữa các hũ"
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Chuyển Tiền Hũ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 text-sm border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('jars')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'jars'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>6 Hũ Chi Tiêu</span>
          </button>

          <button
            onClick={() => setActiveTab('habits')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'habits'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>HabitFlow (Theo Dõi Thói Quen)</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'transactions'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Sổ Giao Dịch CSDL ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'stats'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Báo Cáo & Cơ Sở Dữ Liệu</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Tổng Số Dư Khả Dụng</span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100">{formatVND(totalBalance)}</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Nằm an toàn trong 6 hũ
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Tổng Đã Phân Bổ</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100">{formatVND(totalAllocated)}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Từ các đợt chia thu nhập
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Tổng Đã Chi Tiêu</span>
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400">{formatVND(totalSpent)}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {transactions.filter((t) => t.type === 'expense').length} khoản chi đã ghi nhận
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Kỷ Luật Thói Quen</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">
              {habits.filter((h) => h.completedDates && h.completedDates.includes(todayStr)).length} / {habits.length}
            </div>
            <div className="text-xs text-amber-300/80 mt-1 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Thói quen hoàn thành hôm nay
            </div>
          </div>
        </div>

        {/* TAB 1: 6 JARS VIEW */}
        {activeTab === 'jars' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Phương Pháp 6 Hũ Chi Tiêu (T. Harv Eker)</span>
                  {isStrictLock && (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <Lock className="w-3 h-3" /> Khóa Vượt Chi Hoạt Động
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400">
                  Tự do tài chính bắt đầu từ việc kiểm soát từng đồng tiền đúng mục đích. Nhấp vào từng hũ để xem danh sách chi tiết các giao dịch.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const initial = {};
                    jars.forEach((j) => { initial[j.id] = j.percent; });
                    setEditingPercents(initial);
                    setIsPercentModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Tùy chỉnh tỷ lệ % phân bổ cho từng hũ"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cài Đặt Tỷ Lệ %</span>
                </button>

                <button
                  onClick={() => setIsIncomeModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Phân Bổ Lương</span>
                </button>
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chuyển Quỹ Giữa Hũ</span>
                </button>
              </div>
            </div>

            {/* 6 Jars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jars.map((jar) => {
                const percentSpent =
                  jar.allocated > 0
                    ? Math.min(
                        100,
                        Math.round(((jar.allocated - jar.balance) / jar.allocated) * 100)
                      )
                    : 0;
                const isOverdraft = jar.balance < 0;

                return (
                  <div
                    key={jar.id}
                    onClick={() => {
                      setSelectedDetailJar(jar);
                      setJarDetailTypeFilter('all');
                      setJarDetailSearch('');
                      setJarTimePreset('all');
                      setJarStartDate('');
                      setJarEndDate('');
                      setJarFilterMonth('all');
                      setJarFilterYear('all');
                    }}
                    className={`rounded-2xl p-5 border bg-slate-900/70 hover:bg-slate-900 transition-all shadow-xl flex flex-col justify-between relative group cursor-pointer hover:shadow-2xl hover:border-slate-500 hover:-translate-y-1 duration-200 ${
                      isOverdraft
                        ? 'border-rose-500/60 bg-rose-950/20 hover:border-rose-400'
                        : jar.borderColor || 'border-slate-800'
                    }`}
                  >
                    <div>
                      {/* Jar Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${jar.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                          >
                            {getJarIcon(jar.icon)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white text-base group-hover:text-indigo-200 transition-colors">
                                {jar.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                                Tỷ lệ chuẩn: {jar.percent}%
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                <History className="w-3 h-3 text-indigo-400" />
                                <span>Xem lịch sử</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {isOverdraft ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-300 font-bold border border-rose-500/50">
                            BỊ THÂM HỤT!
                          </span>
                        ) : (
                          <span className={`text-xs font-semibold ${jar.textColor || 'text-emerald-400'}`}>
                            {100 - percentSpent}% còn lại
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-3 line-clamp-2 min-h-[32px]">
                        {jar.desc}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-800/80">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-400">Số dư hiện tại</span>
                          <span
                            className={`text-xl font-extrabold ${
                              isOverdraft ? 'text-rose-400' : 'text-white'
                            }`}
                          >
                            {formatVND(jar.balance)}
                          </span>
                        </div>

                        <div className="w-full bg-slate-800 rounded-full h-2 mt-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isOverdraft
                                ? 'bg-rose-500 w-full'
                                : percentSpent > 85
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${isOverdraft ? 100 : Math.max(5, percentSpent)}%`
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                          <span>Đã dùng: {formatVND((jar.allocated || 0) - jar.balance)}</span>
                          <span>Đã phân bổ: {formatVND(jar.allocated || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJarId(jar.id);
                          setIsExpenseModalOpen(true);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                        <span>Chi Tiêu Hũ Này</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setToJarId(jar.id);
                          setFromJarId(jar.id === 'nec' ? 'ffa' : 'nec');
                          setIsTransferModalOpen(true);
                        }}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all cursor-pointer"
                        title="Nạp tiền vào hũ này từ hũ khác"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 2: HABITFLOW TRACKER */}
        {activeTab === 'habits' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                  <span>HabitFlow VN - Bảng Kỷ Luật Thói Quen Tài Chính</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Ghi chép đều đặn mỗi ngày là bí quyết xây dựng nền tảng tài chính thịnh vượng.
                </p>
              </div>

              <button
                onClick={() => setIsHabitModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Thói Quen Mới</span>
              </button>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase border-b border-slate-700/60">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Thói Quen</th>
                      <th className="px-4 py-4 font-semibold">Phân Loại</th>
                      {last7Days.map((d) => (
                        <th
                          key={d.dateStr}
                          className={`px-3 py-4 text-center font-semibold ${
                            d.dateStr === todayStr ? 'text-amber-400 bg-amber-500/10' : ''
                          }`}
                        >
                          <div>{d.dayName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {d.formatted}
                          </div>
                        </th>
                      ))}
                      <th className="px-4 py-4 text-center font-semibold">Streak 🔥</th>
                      <th className="px-4 py-4 text-center font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {habits.map((habit) => {
                      let streak = 0;
                      const completedList = habit.completedDates || [];
                      for (let i = 0; i < 30; i++) {
                        const checkDate = new Date(Date.now() - 3600000 * 24 * i)
                          .toISOString()
                          .slice(0, 10);
                        if (completedList.includes(checkDate)) {
                          streak++;
                        } else if (i === 0) {
                          continue;
                        } else {
                          break;
                        }
                      }

                      return (
                        <tr key={habit.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-4 font-medium text-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>{habit.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs">
                            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                              {habit.category}
                            </span>
                          </td>

                          {last7Days.map((d) => {
                            const isDone = completedList.includes(d.dateStr);
                            const isToday = d.dateStr === todayStr;

                            return (
                              <td
                                key={d.dateStr}
                                className={`px-3 py-4 text-center ${isToday ? 'bg-amber-500/5' : ''}`}
                              >
                                <button
                                  onClick={() => toggleHabitDate(habit.id, d.dateStr)}
                                  className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                    isDone
                                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                                      : 'bg-slate-800 text-slate-600 hover:bg-slate-700 border border-slate-700'
                                  }`}
                                  title={`Bấm để chuyển đổi trạng thái ngày ${d.formatted}`}
                                >
                                  {isDone ? (
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  ) : (
                                    <Circle className="w-2.5 h-2.5" />
                                  )}
                                </button>
                              </td>
                            );
                          })}

                          <td className="px-4 py-4 text-center font-bold text-amber-400">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs">
                              <Flame className="w-3.5 h-3.5 text-amber-500" />
                              {streak} ngày
                            </span>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleDeleteHabit(habit.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Xóa thói quen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: TRANSACTIONS LIST */}
        {activeTab === 'transactions' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span>Sổ Giao Dịch Chi Tiết ({filteredTransactions.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {dbInfo.isConnected
                    ? 'Dữ liệu giao dịch được lưu trực tiếp trong bảng transactions của PostgreSQL.'
                    : 'Dữ liệu giao dịch lưu tạm trên Local Cache.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Chi Tiêu</span>
                </button>
              </div>
            </div>

            {/* ADVANCED FILTER PANEL: SEARCH + JARS + DATE/MONTH/YEAR/TIME */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
              {/* Row 1: Search & Jar Filter */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-7 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo ghi chú, số tiền..."
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-5 flex gap-2">
                  <div className="flex-1 relative">
                    <select
                      value={txFilterJar}
                      onChange={(e) => setTxFilterJar(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="all">📦 Tất cả 6 hũ</option>
                      {jars.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(txSearch || txFilterJar !== 'all' || txTimePreset !== 'all' || txFilterMonth !== 'all' || txFilterYear !== 'all' || txStartDate || txEndDate) && (
                    <button
                      onClick={() => {
                        setTxSearch('');
                        setTxFilterJar('all');
                        setTxTimePreset('all');
                        setTxStartDate('');
                        setTxEndDate('');
                        setTxFilterMonth('all');
                        setTxFilterYear('all');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Đặt lại toàn bộ bộ lọc"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                      <span className="hidden sm:inline">Đặt lại</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Date & Time Filter Bar */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  {/* Quick Time Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-slate-400 flex items-center gap-1 mr-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Thời gian:</span>
                    </span>

                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'today', label: 'Hôm nay' },
                      { id: 'yesterday', label: 'Hôm qua' },
                      { id: 'week', label: '7 ngày qua' },
                      { id: 'this_month', label: 'Tháng này' },
                      { id: 'last_month', label: 'Tháng trước' },
                      { id: 'this_year', label: 'Năm nay' },
                      { id: 'custom', label: 'Khoảng ngày 📅' }
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setTxTimePreset(preset.id);
                          if (preset.id !== 'custom') {
                            setTxStartDate('');
                            setTxEndDate('');
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          txTimePreset === preset.id
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Month & Year Selectors */}
                  <div className="flex items-center gap-2">
                    {/* Month Select */}
                    <select
                      value={txFilterMonth}
                      onChange={(e) => {
                        setTxFilterMonth(e.target.value);
                        if (e.target.value !== 'all' && txTimePreset !== 'all') {
                          setTxTimePreset('all');
                        }
                      }}
                      className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="all">Tất cả tháng</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={String(m)}>
                          Tháng {m}
                        </option>
                      ))}
                    </select>

                    {/* Year Select */}
                    <select
                      value={txFilterYear}
                      onChange={(e) => {
                        setTxFilterYear(e.target.value);
                        if (e.target.value !== 'all' && txTimePreset !== 'all') {
                          setTxTimePreset('all');
                        }
                      }}
                      className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="all">Tất cả năm</option>
                      {availableYears.map((yr) => (
                        <option key={yr} value={String(yr)}>
                          Năm {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom Date Range Inputs (when 'custom' preset is active) */}
                {txTimePreset === 'custom' && (
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-wrap items-center gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Từ ngày:</span>
                      <DatePickerInput
                        value={txStartDate}
                        onChange={setTxStartDate}
                        placeholder="Chọn ngày bắt đầu"
                        accentColor="emerald"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Đến ngày:</span>
                      <DatePickerInput
                        value={txEndDate}
                        onChange={setTxEndDate}
                        placeholder="Chọn ngày kết thúc"
                        accentColor="emerald"
                      />
                    </div>

                    {(txStartDate || txEndDate) && (
                      <button
                        onClick={() => {
                          setTxStartDate('');
                          setTxEndDate('');
                        }}
                        className="text-xs text-slate-400 hover:text-rose-400 underline cursor-pointer ml-auto"
                      >
                        Xóa khoảng ngày
                      </button>
                    )}
                  </div>
                )}

                {/* Filter Stats & Summary */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/50">
                  <div>
                    Đang tìm thấy <strong>{filteredTransactions.length}</strong> giao dịch
                    {txFilterMonth !== 'all' && ` • Tháng ${txFilterMonth}`}
                    {txFilterYear !== 'all' && ` • Năm ${txFilterYear}`}
                    {txTimePreset === 'today' && ' • Hôm nay'}
                    {txTimePreset === 'yesterday' && ' • Hôm qua'}
                    {txTimePreset === 'week' && ' • 7 ngày qua'}
                    {txTimePreset === 'this_month' && ' • Tháng này'}
                    {txTimePreset === 'last_month' && ' • Tháng trước'}
                    {txTimePreset === 'this_year' && ' • Năm nay'}
                    {txTimePreset === 'custom' && (txStartDate || txEndDate) && ` • Từ ${txStartDate || '...'} đến ${txEndDate || '...'}`}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-rose-400">
                      Tổng chi: -{formatVND(
                        filteredTransactions
                          .filter((t) => t.type === 'expense' || t.type === 'transfer')
                          .reduce((sum, t) => sum + (t.type === 'expense' ? Number(t.amount) : 0), 0)
                      )}
                    </span>
                    <span className="text-emerald-400">
                      Tổng thu: +{formatVND(
                        filteredTransactions
                          .filter((t) => t.type === 'income_distribute')
                          .reduce((sum, t) => sum + Number(t.amount), 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {filteredTransactions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Chưa có giao dịch nào được ghi nhận.
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {filteredTransactions.map((tx) => {
                    const jar = jars.find((j) => j.id === tx.jarId);
                    const toJar = jars.find((j) => j.id === tx.toJarId);

                    return (
                      <div
                        key={tx.id}
                        className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              tx.type === 'income_distribute'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : tx.type === 'transfer'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {tx.type === 'income_distribute' ? (
                              <ArrowUpRight className="w-5 h-5" />
                            ) : tx.type === 'transfer' ? (
                              <ArrowRightLeft className="w-5 h-5" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="font-semibold text-slate-200 text-sm">
                              {tx.note}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span>{tx.date}</span>
                              <span>•</span>
                              {tx.type === 'income_distribute' ? (
                                <span className="text-emerald-400">Chia đều 6 Hũ</span>
                              ) : tx.type === 'transfer' ? (
                                <span className="text-amber-400">
                                  {jar?.name} ➔ {toJar?.name}
                                </span>
                              ) : (
                                <span className={jar?.textColor || 'text-slate-300'}>{jar?.name}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`font-bold text-sm sm:text-base ${
                              tx.type === 'income_distribute'
                                ? 'text-emerald-400'
                                : tx.type === 'transfer'
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {tx.type === 'income_distribute' ? '+' : '-'}
                            {formatVND(tx.amount)}
                          </div>
                          <button
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="text-[11px] text-slate-500 hover:text-rose-400 mt-0.5 underline cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 4: STATS & DB CONFIG */}
        {activeTab === 'stats' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>Cơ Sở Dữ Liệu PostgreSQL & Báo Cáo Tài Chính</span>
              </h2>
              <p className="text-xs text-slate-400">
                Quản lý trạng thái lưu trữ CSDL và tỷ lệ tài sản.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distribution */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-400" />
                  <span>Tỷ Lệ Số Dư Khả Dụng Trong Các Hũ</span>
                </h3>
                <div className="space-y-3">
                  {jars.map((j) => {
                    const ratio =
                      totalBalance > 0
                        ? Math.max(0, Math.round((j.balance / totalBalance) * 100))
                        : 0;
                    return (
                      <div key={j.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">{j.name}</span>
                          <span className="text-slate-400">
                            {formatVND(j.balance)} ({ratio}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${j.color}`}
                            style={{ width: `${Math.min(100, ratio)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DB Status Box */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span>Trạng Thái CSDL PostgreSQL</span>
                </h3>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trạng thái kết nối:</span>
                    <span className={`font-bold ${dbInfo.isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {dbInfo.isConnected ? '🟢 ĐÃ KẾT NỐI' : '🔴 CHƯA KẾT NỐI'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Database Name:</span>
                    <code className="text-slate-200">{dbInfo.database}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Host / Server:</span>
                    <code className="text-slate-200">{dbInfo.host}:5432</code>
                  </div>
                  {dbInfo.error && (
                    <div className="pt-2 text-rose-400 border-t border-slate-700/60">
                      <strong>Chi tiết lỗi:</strong> {dbInfo.error}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setShowDbConfigModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FileCode2 className="w-4 h-4" />
                    <span>Hướng Dẫn Cấu Hình File .env Kết Nối PostgreSQL</span>
                  </button>

                  <button
                    onClick={checkDatabaseAndSync}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                    <span>Tải Lại & Đồng Bộ Với PostgreSQL</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ================= MODALS ================= */}

      {/* MODAL DB CONFIG GUIDE */}
      {showDbConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowDbConfigModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>Cấu Hình Kết Nối PostgreSQL Trong File .env</span>
            </h3>

            <div className="text-xs text-slate-300 space-y-3">
              <p>
                File cấu hình <code>.env</code> nằm ở thư mục gốc của dự án:
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto">
                PORT=5000<br />
                PG_HOST=localhost<br />
                PG_PORT=5432<br />
                PG_DATABASE=jars_finance<br />
                PG_USER=postgres<br />
                PG_PASSWORD=mật_khẩu_của_bạn<br />
              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-200">
                <strong>💡 Lưu ý:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>Khi PostgreSQL kết nối thành công, hệ thống sẽ tự động tạo bảng <code>jars</code>, <code>transactions</code>, <code>habits</code>, <code>settings</code>.</li>
                  <li>Nếu bạn sử dụng Docker, bạn có thể chạy: <code className="bg-slate-800 px-1 py-0.5 rounded">docker run --name pg-jars -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=jars_finance -p 5432:5432 -d postgres</code>.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowDbConfigModal(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                Đã Hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD EXPENSE */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsExpenseModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <ArrowDownRight className="w-5 h-5 text-rose-400" />
              <span>Ghi Nhận Khoản Chi Mới</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isStrictLock
                ? '🔒 Chế độ khóa nghiêm ngặt đang bật: không thể chi quá số dư hũ.'
                : '🔓 Chế độ tự do: có thể ghi chi tiêu vượt mức.'}
            </p>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Chọn Hũ Chi Tiêu
                </label>
                <select
                  value={selectedJarId}
                  onChange={(e) => setSelectedJarId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {jars.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} (Còn {formatVND(j.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Số Tiền Chi (VNĐ)
                </label>
                <input
                  type="number"
                  placeholder="Ví dụ: 250000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  autoFocus
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ngày Ghi Nhận Chi Tiêu
                </label>
                <DatePickerInput
                  value={expenseDate}
                  onChange={setExpenseDate}
                  placeholder="Chọn ngày chi tiêu"
                  accentColor="rose"
                  className="w-full justify-between py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nội Dung / Mục Đích Chi
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Mua đồ gia dụng, ăn trưa với đồng nghiệp..."
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  Lưu Khoản Chi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INCOME DISTRIBUTE */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsIncomeModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Phân Bổ Thu Nhập Tự Động (6 Hũ)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Nhập tổng thu nhập, hệ thống sẽ tự động tính và cộng đúng tỷ lệ vào từng hũ theo công thức 55 - 10 - 10 - 10 - 10 - 5.
            </p>

            <form onSubmit={handleDistributeIncome} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tổng Thu Nhập Nhận Được (VNĐ)
                </label>
                <input
                  type="number"
                  placeholder="Ví dụ: 20000000"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  autoFocus
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ghi Chú Nguồn Thu
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lương tháng, thưởng dự án..."
                  value={incomeNote}
                  onChange={(e) => setIncomeNote(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {incomeAmount && parseFloat(incomeAmount) > 0 && (
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
                    <span>Dự kiến phân bổ theo tỷ lệ:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const initial = {};
                        jars.forEach((j) => { initial[j.id] = j.percent; });
                        setEditingPercents(initial);
                        setIsIncomeModalOpen(false);
                        setIsPercentModalOpen(true);
                      }}
                      className="text-amber-400 hover:text-amber-300 underline text-[11px] font-normal cursor-pointer flex items-center gap-1"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>Đổi tỷ lệ %</span>
                    </button>
                  </div>
                  {jars.map((j) => (
                    <div key={j.id} className="flex justify-between text-slate-300">
                      <span>{j.name} ({j.percent}%):</span>
                      <span className="font-medium">
                        {formatVND(
                          Math.round((parseFloat(incomeAmount) * j.percent) / 100)
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsIncomeModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Xác Nhận Phân Bổ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INTER-JAR TRANSFER */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsTransferModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              <span>Chuyển Tiền Bù Đắp Giữa Các Hũ</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Điều chuyển ngân sách khi một hũ cần trợ cấp hoặc thanh toán khoản mục khẩn cấp.
            </p>

            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Từ Hũ (Nguồn)
                  </label>
                  <select
                    value={fromJarId}
                    onChange={(e) => setFromJarId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    {jars.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name} ({formatVND(j.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Sang Hũ (Đích)
                  </label>
                  <select
                    value={toJarId}
                    onChange={(e) => setToJarId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    {jars.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Số Tiền Cần Chuyển (VNĐ)
                </label>
                <input
                  type="number"
                  placeholder="Ví dụ: 500000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Lý Do Điều Chuyển
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bù đắp tiền nhà, hỗ trợ hũ học tập..."
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white shadow-lg shadow-amber-600/30 cursor-pointer"
                >
                  Xác Nhận Chuyển
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: OVERDRAFT ALERT (STRICT BUDGET LOCK TRIGGER) */}
      {overdraftAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/40">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">
              🚨 BỊ CHẶN: VƯỢT QUÁ SỐ DƯ HŨ!
            </h3>

            <div className="text-sm text-slate-300 space-y-3">
              <p>
                Cơ chế <strong>Strict Budget Lock</strong> đang bảo vệ kỷ luật tài chính của bạn và đã chặn giao dịch này trước khi ghi vào dữ liệu.
              </p>

              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Hũ cần chi:</span>
                  <span className="font-semibold text-white">
                    {overdraftAlert.targetJar.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số dư hiện tại của hũ:</span>
                  <span className="font-semibold text-emerald-400">
                    {formatVND(overdraftAlert.currentBalance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số tiền bạn định chi:</span>
                  <span className="font-semibold text-rose-300">
                    {formatVND(overdraftAlert.attemptedAmount)}
                  </span>
                </div>
                <div className="border-t border-rose-800/50 pt-1.5 flex justify-between font-bold text-rose-400">
                  <span>Số tiền bị thiếu hụt:</span>
                  <span>{formatVND(overdraftAlert.deficit)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Để chi khoản tiền này mà không phá vỡ kỷ luật, bạn hãy chuyển số tiền thiếu từ một hũ khác sang hũ <strong>{overdraftAlert.targetJar.name}</strong>.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setOverdraftAlert(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Hủy Khoản Chi Này
              </button>

              <button
                onClick={handleOpenTransferForOverdraft}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-lg shadow-amber-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Chuyển Bù Đắp Từ Hũ Khác</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD HABIT */}
      {isHabitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsHabitModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>Thêm Thói Quen Mới</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Xây dựng thói quen nhỏ hàng ngày để đạt thành tựu tài chính lớn.
            </p>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tên Thói Quen
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đọc sách 20p, Không mua sắm cảm xúc..."
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  autoFocus
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nhóm Phân Loại
                </label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tài chính">Tài chính</option>
                  <option value="Tiết kiệm">Tiết kiệm</option>
                  <option value="Học tập">Học tập</option>
                  <option value="Kỷ luật">Kỷ luật</option>
                  <option value="Sức khỏe">Sức khỏe</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsHabitModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Thêm Thói Quen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: CUSTOMIZE JARS PERCENTAGES */}
      {isPercentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPercentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
              <span>Cài Đặt Tỷ Lệ Phân Bổ 6 Hũ</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Tùy chỉnh tỷ lệ phần trăm (%) thu nhập tự động rót vào từng hũ. Tổng tỷ lệ bắt buộc phải bằng <strong>100%</strong>.
            </p>

            <form onSubmit={handleSavePercentages} className="space-y-4">
              <div className="space-y-2.5">
                {jars.map((j) => {
                  const val = editingPercents[j.id] ?? j.percent;
                  return (
                    <div
                      key={j.id}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-[160px]">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${j.color} flex items-center justify-center text-white text-xs`}
                        >
                          {getJarIcon(j.icon)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-200">
                            {j.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Mã: {j.id.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={val}
                          onChange={(e) => {
                            const num = parseInt(e.target.value, 10);
                            setEditingPercents((prev) => ({
                              ...prev,
                              [j.id]: isNaN(num) ? 0 : num
                            }));
                          }}
                          className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-center text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-xs font-semibold text-slate-400">%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total percentage indicator */}
              {(() => {
                const total = Object.values(editingPercents).reduce(
                  (sum, v) => sum + (parseInt(v, 10) || 0),
                  0
                );
                const isValid = total === 100;
                return (
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                      isValid
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {isValid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      )}
                      <span>
                        {isValid
                          ? 'Tổng tỷ lệ chuẩn xác: 100%'
                          : `Tổng hiện tại: ${total}% (Cần điều chỉnh: ${100 - total > 0 ? `+${100 - total}%` : `${100 - total}%`})`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingPercents({
                          nec: 55,
                          ffa: 10,
                          ltss: 10,
                          edu: 10,
                          play: 10,
                          give: 5
                        });
                      }}
                      className="text-[11px] underline text-slate-300 hover:text-white cursor-pointer"
                    >
                      Về mặc định (55/10/10/10/10/5)
                    </button>
                  </div>
                );
              })()}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPercentModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={
                    Object.values(editingPercents).reduce(
                      (sum, v) => sum + (parseInt(v, 10) || 0),
                      0
                    ) !== 100
                  }
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
                >
                  Lưu Tỷ Lệ Vào CSDL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: DETAILED JAR TRANSACTIONS */}
      {selectedDetailJar && currentDetailJar && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
            {/* Modal Top Header Banner with gradient */}
            <div className={`p-5 sm:p-6 bg-gradient-to-r ${selectedDetailJar.color} relative text-white flex-shrink-0`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/30">
                    {getJarIcon(selectedDetailJar.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black tracking-wide drop-shadow-sm">
                        {currentDetailJar.name}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 font-bold uppercase">
                        {selectedDetailJar.id}
                      </span>
                    </div>
                    <p className="text-xs text-white/90 mt-1 max-w-xl line-clamp-2">
                      {selectedDetailJar.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDetailJar(null)}
                  className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 flex-shrink-0"
                  title="Đóng (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick action pill buttons in header */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/20">
                <button
                  onClick={() => {
                    setSelectedJarId(selectedDetailJar.id);
                    setIsExpenseModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold border border-white/30 flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all"
                >
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-300" />
                  <span>Thêm Chi Tiêu</span>
                </button>

                <button
                  onClick={() => {
                    setToJarId(selectedDetailJar.id);
                    setFromJarId(selectedDetailJar.id === 'nec' ? 'ffa' : 'nec');
                    setIsTransferModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold border border-white/30 flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-amber-300" />
                  <span>Chuyển Quỹ Vào/Ra</span>
                </button>

                <button
                  onClick={() => {
                    setTxFilterJar(selectedDetailJar.id);
                    setActiveTab('transactions');
                    setSelectedDetailJar(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all ml-auto"
                  title="Mở toàn màn hình trong tab Sổ Giao Dịch"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mở Trong Sổ Giao Dịch</span>
                  <span className="sm:hidden">Sổ Giao Dịch</span>
                </button>
              </div>
            </div>

            {/* Financial Metrics Cards & Budget Bar */}
            <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex-shrink-0 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Số Dư Hiện Tại</span>
                  <div className={`text-base sm:text-lg font-black ${currentDetailJar.balance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {formatVND(currentDetailJar.balance)}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {currentDetailJar.balance < 0 ? '⚠️ Bị thâm hụt' : 'Khả dụng chi tiêu'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Tổng Tiền Đã Phân Bổ</span>
                  <div className="text-base sm:text-lg font-black text-white">
                    {formatVND(currentDetailJar.allocated || 0)}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Tỷ lệ chuẩn: {currentDetailJar.percent}%
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Tổng Đã Chi Tiêu</span>
                  <div className="text-base sm:text-lg font-black text-rose-400">
                    {formatVND(detailJarStats.totalOut)}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {detailJarStats.expenseCount} khoản chi
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Tiền Nạp / Nhận Thêm</span>
                  <div className="text-base sm:text-lg font-black text-indigo-400">
                    {formatVND(detailJarStats.totalIn)}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {detailJarStats.incomeCount + detailJarStats.transferInCount} lần cộng
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">Hạn mức ngân sách đã sử dụng</span>
                  <span className={`font-bold ${
                    currentDetailJar.balance < 0 ? 'text-rose-400' : 'text-slate-200'
                  }`}>
                    {currentDetailJar.allocated > 0
                      ? Math.min(100, Math.round(((currentDetailJar.allocated - currentDetailJar.balance) / currentDetailJar.allocated) * 100))
                      : 0}% (Đã dùng: {formatVND((currentDetailJar.allocated || 0) - currentDetailJar.balance)})
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentDetailJar.balance < 0
                        ? 'bg-rose-500 w-full'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{
                      width: `${currentDetailJar.balance < 0 ? 100 : Math.max(5, Math.min(100, currentDetailJar.allocated > 0 ? Math.round(((currentDetailJar.allocated - currentDetailJar.balance) / currentDetailJar.allocated) * 100) : 0))}%`
                    }}
                  />
                </div>
              </div>

              {/* Search & Filter Tabs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 overflow-x-auto text-xs">
                  <button
                    onClick={() => setJarDetailTypeFilter('all')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      jarDetailTypeFilter === 'all'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tất Cả ({detailJarStats.allCount})
                  </button>
                  <button
                    onClick={() => setJarDetailTypeFilter('expense')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      jarDetailTypeFilter === 'expense'
                        ? 'bg-rose-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Chi Tiêu ({detailJarStats.expenseCount})
                  </button>
                  <button
                    onClick={() => setJarDetailTypeFilter('income')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      jarDetailTypeFilter === 'income'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Phân Bổ Lương ({detailJarStats.incomeCount})
                  </button>
                  <button
                    onClick={() => setJarDetailTypeFilter('transfer')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      jarDetailTypeFilter === 'transfer'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Chuyển Quỹ ({detailJarStats.transferCount})
                  </button>
                </div>

                {/* Search Box */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm nội dung, số tiền..."
                    value={jarDetailSearch}
                    onChange={(e) => setJarDetailSearch(e.target.value)}
                    className="w-full sm:w-56 bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Jar Modal Date/Time Filter Bar */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 flex items-center gap-1 font-medium mr-1 text-[11px]">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>Thời gian:</span>
                  </span>
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'today', label: 'Hôm nay' },
                    { id: 'week', label: '7 ngày qua' },
                    { id: 'this_month', label: 'Tháng này' },
                    { id: 'last_month', label: 'Tháng trước' },
                    { id: 'custom', label: 'Khoảng ngày 📅' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setJarTimePreset(preset.id);
                        if (preset.id !== 'custom') {
                          setJarStartDate('');
                          setJarEndDate('');
                        }
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        jarTimePreset === preset.id
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={jarFilterMonth}
                    onChange={(e) => {
                      setJarFilterMonth(e.target.value);
                      if (e.target.value !== 'all' && jarTimePreset !== 'all') {
                        setJarTimePreset('all');
                      }
                    }}
                    className="bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-0.5 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">Tất cả tháng</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={String(m)}>
                        Tháng {m}
                      </option>
                    ))}
                  </select>

                  <select
                    value={jarFilterYear}
                    onChange={(e) => {
                      setJarFilterYear(e.target.value);
                      if (e.target.value !== 'all' && jarTimePreset !== 'all') {
                        setJarTimePreset('all');
                      }
                    }}
                    className="bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-0.5 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">Tất cả năm</option>
                    {availableYears.map((yr) => (
                      <option key={yr} value={String(yr)}>
                        Năm {yr}
                      </option>
                    ))}
                  </select>

                  {(jarTimePreset !== 'all' || jarFilterMonth !== 'all' || jarFilterYear !== 'all' || jarStartDate || jarEndDate) && (
                    <button
                      onClick={() => {
                        setJarTimePreset('all');
                        setJarStartDate('');
                        setJarEndDate('');
                        setJarFilterMonth('all');
                        setJarFilterYear('all');
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-400 transition-colors"
                      title="Đặt lại bộ lọc thời gian"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Jar Custom Date Range inputs if custom */}
              {jarTimePreset === 'custom' && (
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-wrap items-center gap-3 text-xs animate-in fade-in">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Từ ngày:</span>
                    <DatePickerInput
                      value={jarStartDate}
                      onChange={setJarStartDate}
                      placeholder="Chọn ngày bắt đầu"
                      accentColor="indigo"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Đến ngày:</span>
                    <DatePickerInput
                      value={jarEndDate}
                      onChange={setJarEndDate}
                      placeholder="Chọn ngày kết thúc"
                      accentColor="indigo"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Transaction List Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-800/80 space-y-2">
              {detailJarTransactions.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
                    <Calendar className="w-7 h-7 text-slate-500" />
                  </div>
                  <div className="text-slate-300 font-semibold text-sm">
                    Không có giao dịch nào phù hợp
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {jarDetailSearch || jarDetailTypeFilter !== 'all'
                      ? 'Không tìm thấy giao dịch nào khớp với bộ lọc hiện tại. Thử xóa tìm kiếm hoặc chọn bộ lọc khác.'
                      : `Hũ ${selectedDetailJar.name} chưa phát sinh giao dịch nào. Bạn có thể thêm chi tiêu hoặc phân bổ ngân sách ngay.`}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedJarId(selectedDetailJar.id);
                      setIsExpenseModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-rose-400" />
                    <span>Ghi nhận chi tiêu đầu tiên</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {detailJarTransactions.map((tx) => {
                    const fromJar = jars.find((j) => j.id === tx.jarId);
                    const toJar = jars.find((j) => j.id === tx.toJarId);

                    return (
                      <div
                        key={tx.id}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              tx.txCategory === 'income'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : tx.txCategory === 'transfer_in'
                                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                : tx.txCategory === 'transfer_out'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {tx.txCategory === 'income' ? (
                              <ArrowUpRight className="w-5 h-5" />
                            ) : tx.txCategory === 'transfer_in' ? (
                              <ArrowDownRight className="w-5 h-5 text-indigo-400 rotate-180" />
                            ) : tx.txCategory === 'transfer_out' ? (
                              <ArrowRightLeft className="w-5 h-5" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="font-semibold text-slate-100 text-sm truncate">
                              {tx.note}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                              <span className="font-mono text-slate-400">{tx.date}</span>
                              <span>•</span>
                              {tx.txCategory === 'income' ? (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-[11px]">
                                  Phân bổ lương ({selectedDetailJar.percent}%)
                                </span>
                              ) : tx.txCategory === 'transfer_in' ? (
                                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium text-[11px]">
                                  Nhận bù từ: {fromJar?.name}
                                </span>
                              ) : tx.txCategory === 'transfer_out' ? (
                                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium text-[11px]">
                                  Chuyển sang: {toJar?.name}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium text-[11px]">
                                  Chi tiêu từ hũ
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 flex items-center gap-3">
                          <div>
                            <div
                              className={`font-black text-sm sm:text-base ${
                                tx.flowType === 'positive'
                                  ? 'text-emerald-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {tx.flowType === 'positive' ? '+' : '-'}
                              {formatVND(tx.displayAmount)}
                            </div>
                            {tx.txCategory === 'income' && tx.amount !== tx.displayAmount && (
                              <div className="text-[10px] text-slate-500">
                                (từ tổng {formatVND(tx.amount)})
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-70 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Xóa giao dịch này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
              <div>
                Hiển thị <strong>{detailJarTransactions.length}</strong> giao dịch của hũ <strong>{selectedDetailJar.name}</strong>
              </div>
              <button
                onClick={() => setSelectedDetailJar(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
