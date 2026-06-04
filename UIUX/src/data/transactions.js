// ============================================================
// DUMMY DATA — Transactions
// 20+ transaksi realistis warkop hari ini
// ============================================================

// === HELPER: buat waktu hari ini dengan jam tertentu ===
const today = (hhmm) => {
  const d = new Date();
  const [h, m] = hhmm.split(':');
  d.setHours(+h, +m, 0, 0);
  return d.toISOString();
};

// === TRANSAKSI HARI INI ===
export const DUMMY_TRANSACTIONS = [
  { id: 'trx-001', meja: 'M01', kasir: 'Budi Santoso',  items: ['Kopi Susu ×2', 'Roti Bakar ×1'],             total: 43000,  metode: 'cash', waktu: today('08:12'), status: 'selesai' },
  { id: 'trx-002', meja: 'M05', kasir: 'Sari Wulandari', items: ['Americano ×1', 'Mie Goreng ×1'],             total: 32000,  metode: 'qris', waktu: today('08:35'), status: 'selesai' },
  { id: 'trx-003', meja: 'M02', kasir: 'Budi Santoso',  items: ['Teh Tarik ×2', 'Keripik ×1'],                 total: 28000,  metode: 'cash', waktu: today('09:05'), status: 'selesai' },
  { id: 'trx-004', meja: 'M07', kasir: 'Sari Wulandari', items: ['Latte ×2', 'Pisang Goreng ×2'],              total: 60000,  metode: 'cash', waktu: today('09:30'), status: 'selesai' },
  { id: 'trx-005', meja: 'M03', kasir: 'Budi Santoso',  items: ['Espresso ×1', 'Kacang Goreng ×1'],            total: 22000,  metode: 'qris', waktu: today('09:48'), status: 'selesai' },
  { id: 'trx-006', meja: 'M10', kasir: 'Sari Wulandari', items: ['Cappuccino ×2', 'Roti Bakar ×2'],            total: 62000,  metode: 'cash', waktu: today('10:15'), status: 'selesai' },
  { id: 'trx-007', meja: 'M04', kasir: 'Budi Santoso',  items: ['Matcha Latte ×1', 'Nasi Goreng ×1'],          total: 50000,  metode: 'qris', waktu: today('10:40'), status: 'selesai' },
  { id: 'trx-008', meja: 'M06', kasir: 'Sari Wulandari', items: ['Kopi Susu ×3'],                              total: 42000,  metode: 'cash', waktu: today('11:00'), status: 'selesai' },
  { id: 'trx-009', meja: 'M08', kasir: 'Budi Santoso',  items: ['Lemon Tea ×2', 'Keripik ×2'],                 total: 38000,  metode: 'cash', waktu: today('11:20'), status: 'selesai' },
  { id: 'trx-010', meja: 'M09', kasir: 'Sari Wulandari', items: ['Coklat Panas ×2', 'Mie Goreng ×1'],         total: 44000,  metode: 'qris', waktu: today('11:45'), status: 'selesai' },
  { id: 'trx-011', meja: 'M01', kasir: 'Budi Santoso',  items: ['Americano ×2', 'Pisang Goreng ×1'],           total: 39000,  metode: 'cash', waktu: today('12:05'), status: 'selesai' },
  { id: 'trx-012', meja: 'M03', kasir: 'Sari Wulandari', items: ['Kopi Susu ×1', 'Latte ×1', 'Roti Bakar ×1'], total: 44000, metode: 'cash', waktu: today('12:18'), status: 'selesai' },
  { id: 'trx-013', meja: 'M05', kasir: 'Budi Santoso',  items: ['Teh Tarik ×3', 'Kacang Goreng ×2'],           total: 40000,  metode: 'qris', waktu: today('12:30'), status: 'selesai' },
  { id: 'trx-014', meja: 'M02', kasir: 'Sari Wulandari', items: ['Nasi Goreng ×2', 'Teh Tarik ×2'],           total: 75000,  metode: 'cash', waktu: today('12:55'), status: 'selesai' },
  { id: 'trx-015', meja: 'M07', kasir: 'Budi Santoso',  items: ['Cappuccino ×1', 'Matcha Latte ×1'],           total: 31000,  metode: 'qris', waktu: today('13:10'), status: 'selesai' },
  { id: 'trx-016', meja: 'M04', kasir: 'Sari Wulandari', items: ['Espresso ×2', 'Kopi Susu ×1'],              total: 34000,  metode: 'cash', waktu: today('13:35'), status: 'selesai' },
  { id: 'trx-017', meja: 'M10', kasir: 'Budi Santoso',  items: ['Lemon Tea ×1', 'Coklat Panas ×1', 'Keripik ×1'], total: 34000, metode: 'cash', waktu: today('13:50'), status: 'selesai' },
  { id: 'trx-018', meja: 'M06', kasir: 'Sari Wulandari', items: ['Kopi Susu ×2', 'Pisang Goreng ×2'],         total: 58000,  metode: 'qris', waktu: today('14:10'), status: 'selesai' },
  { id: 'trx-019', meja: 'M08', kasir: 'Budi Santoso',  items: ['Americano ×1', 'Mie Goreng ×2'],             total: 57000,  metode: 'cash', waktu: today('14:30'), status: 'aktif'   },
  { id: 'trx-020', meja: 'M03', kasir: 'Sari Wulandari', items: ['Latte ×2', 'Nasi Goreng ×1'],               total: 65000,  metode: 'cash', waktu: today('14:45'), status: 'menunggu_bayar' },
  { id: 'trx-021', meja: 'M01', kasir: 'Budi Santoso',  items: ['Kopi Susu ×1', 'Cappuccino ×1'],             total: 30000,  metode: 'qris', waktu: today('15:00'), status: 'aktif'   },
  { id: 'trx-022', meja: 'M09', kasir: 'Sari Wulandari', items: ['Matcha Latte ×2', 'Roti Bakar ×1'],         total: 45000,  metode: 'cash', waktu: today('15:20'), status: 'aktif'   },
];

// === PENJUALAN 7 HARI TERAKHIR ===
export const DAILY_SALES = [
  { label: 'Sen',  value: 980000  },
  { label: 'Sel',  value: 1150000 },
  { label: 'Rab',  value: 870000  },
  { label: 'Kam',  value: 1340000 },
  { label: 'Jum',  value: 1480000 },
  { label: 'Sab',  value: 1620000 },
  { label: 'Hari ini', value: 1056000 },
];

// === PENJUALAN 12 BULAN ===
export const MONTHLY_SALES = [
  { label: 'Jan', value: 24500000 },
  { label: 'Feb', value: 21800000 },
  { label: 'Mar', value: 27300000 },
  { label: 'Apr', value: 29100000 },
  { label: 'Mei', value: 31500000 },
  { label: 'Jun', value: 28900000 },
  { label: 'Jul', value: 26400000 },
  { label: 'Agu', value: 30200000 },
  { label: 'Sep', value: 33100000 },
  { label: 'Okt', value: 35600000 },
  { label: 'Nov', value: 38200000 },
  { label: 'Des', value: 41500000 },
];

// === TOP 5 PRODUK HARI INI ===
export const TOP_PRODUCTS = [
  { nama: 'Kopi Susu',   terjual: 42, persen: 100 },
  { nama: 'Americano',   terjual: 38, persen: 90  },
  { nama: 'Teh Tarik',   terjual: 31, persen: 74  },
  { nama: 'Mie Goreng',  terjual: 27, persen: 64  },
  { nama: 'Roti Bakar',  terjual: 19, persen: 45  },
];

// === STOK MENIPIS ===
export const LOW_STOCK = [
  { nama: 'Gula Pasir',       stok: 5,   satuan: 'kg',  threshold: 10 },
  { nama: 'Kopi Robusta',     stok: 200, satuan: 'gr',  threshold: 500 },
  { nama: 'Susu Kental Manis',stok: 2,   satuan: 'klg', threshold: 6 },
  { nama: 'Teh Celup',        stok: 8,   satuan: 'bks', threshold: 20 },
];

// === SHIFT AKTIF ===
export const ACTIVE_SHIFTS = [
  { id: 's001', kasir: 'Budi Santoso',   mulai: today('08:00'), modal: 500000, total: 623000, trx: 12 },
  { id: 's002', kasir: 'Sari Wulandari', mulai: today('08:00'), modal: 500000, total: 433000, trx: 10 },
];

// === KPI SUMMARY ===
export const KPI = {
  omzetHariIni  : DUMMY_TRANSACTIONS.filter(t => t.status === 'selesai').reduce((s, t) => s + t.total, 0),
  omzetBulanIni : 24870000,
  totalTransaksi: DUMMY_TRANSACTIONS.filter(t => t.status === 'selesai').length,
  shiftAktif    : ACTIVE_SHIFTS.length,
};
