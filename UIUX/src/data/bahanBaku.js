// ============================================================
// DUMMY DATA — Bahan Baku / Inventory
// ============================================================

export const SATUAN_LIST = ['kg', 'gram', 'liter', 'ml', 'pcs', 'botol', 'kaleng', 'pak', 'karton', 'lembar'];

export const KATEGORI_BAHAN = [
  { value: 'semua',    label: 'Semua' },
  { value: 'kopi',     label: '☕ Kopi' },
  { value: 'susu',     label: '🥛 Susu & Dairy' },
  { value: 'gula',     label: '🍬 Gula & Sirup' },
  { value: 'teh',      label: '🍵 Teh & Non-Kopi' },
  { value: 'makanan',  label: '🍜 Bahan Makanan' },
  { value: 'kemasan',  label: '📦 Kemasan' },
  { value: 'lainnya',  label: '🔧 Lainnya' },
];

export const DUMMY_BAHAN_BAKU = [
  // === KOPI ===
  { id: 'b001', nama: 'Biji Kopi Robusta',   kategori: 'kopi',    satuan: 'kg',    stok: 12.5,  stokMin: 5,   hargaSatuan: 85000,  supplier: 'UD Mandiri Coffee', updatedAt: '2026-06-02' },
  { id: 'b002', nama: 'Biji Kopi Arabika',   kategori: 'kopi',    satuan: 'kg',    stok: 8.0,   stokMin: 3,   hargaSatuan: 120000, supplier: 'UD Mandiri Coffee', updatedAt: '2026-06-02' },
  { id: 'b003', nama: 'Kopi Sachet Blend',   kategori: 'kopi',    satuan: 'pak',   stok: 15,    stokMin: 5,   hargaSatuan: 35000,  supplier: 'Toko Grosir Jaya',  updatedAt: '2026-05-30' },

  // === SUSU ===
  { id: 'b004', nama: 'Susu Full Cream UHT', kategori: 'susu',    satuan: 'liter', stok: 24,    stokMin: 10,  hargaSatuan: 18000,  supplier: 'PT Segar Makmur',   updatedAt: '2026-06-03' },
  { id: 'b005', nama: 'Susu Kental Manis',   kategori: 'susu',    satuan: 'kaleng',stok: 3,     stokMin: 5,   hargaSatuan: 14000,  supplier: 'PT Segar Makmur',   updatedAt: '2026-06-01' },
  { id: 'b006', nama: 'Creamer Bubuk',        kategori: 'susu',    satuan: 'kg',    stok: 4.5,   stokMin: 2,   hargaSatuan: 45000,  supplier: 'Toko Grosir Jaya',  updatedAt: '2026-06-01' },

  // === GULA & SIRUP ===
  { id: 'b007', nama: 'Gula Pasir',           kategori: 'gula',    satuan: 'kg',    stok: 18,    stokMin: 8,   hargaSatuan: 16000,  supplier: 'Toko Grosir Jaya',  updatedAt: '2026-06-02' },
  { id: 'b008', nama: 'Gula Aren Cair',       kategori: 'gula',    satuan: 'liter', stok: 6,     stokMin: 3,   hargaSatuan: 28000,  supplier: 'Pak Tani Aren',     updatedAt: '2026-06-01' },
  { id: 'b009', nama: 'Sirup Hazelnut',       kategori: 'gula',    satuan: 'botol', stok: 2,     stokMin: 2,   hargaSatuan: 95000,  supplier: 'Importir F&B',      updatedAt: '2026-05-28' },
  { id: 'b010', nama: 'Sirup Vanilla',        kategori: 'gula',    satuan: 'botol', stok: 4,     stokMin: 2,   hargaSatuan: 90000,  supplier: 'Importir F&B',      updatedAt: '2026-05-28' },

  // === TEH ===
  { id: 'b011', nama: 'Teh Celup Hitam',      kategori: 'teh',     satuan: 'pak',   stok: 8,     stokMin: 3,   hargaSatuan: 25000,  supplier: 'Toko Grosir Jaya',  updatedAt: '2026-06-01' },
  { id: 'b012', nama: 'Matcha Powder',         kategori: 'teh',     satuan: 'gram',  stok: 500,   stokMin: 200, hargaSatuan: 350,    supplier: 'Importir F&B',      updatedAt: '2026-05-30' },
  { id: 'b013', nama: 'Coklat Bubuk',          kategori: 'teh',     satuan: 'kg',    stok: 3.5,   stokMin: 1.5, hargaSatuan: 75000,  supplier: 'PT Segar Makmur',   updatedAt: '2026-06-02' },

  // === MAKANAN ===
  { id: 'b014', nama: 'Mie Kering',            kategori: 'makanan', satuan: 'pak',   stok: 20,    stokMin: 8,   hargaSatuan: 12000,  supplier: 'Toko Grosir Jaya',  updatedAt: '2026-06-02' },
  { id: 'b015', nama: 'Roti Tawar',             kategori: 'makanan', satuan: 'pcs',   stok: 6,     stokMin: 4,   hargaSatuan: 18000,  supplier: 'Bakeri Roti Segar', updatedAt: '2026-06-03' },
  { id: 'b016', nama: 'Telur Ayam',             kategori: 'makanan', satuan: 'pcs',   stok: 30,    stokMin: 12,  hargaSatuan: 2500,   supplier: 'Pak Tani Aren',     updatedAt: '2026-06-03' },
  { id: 'b017', nama: 'Minyak Goreng',          kategori: 'makanan', satuan: 'liter', stok: 5,     stokMin: 2,   hargaSatuan: 20000,  supplier: 'Toko Grosir Jaya',  updatedAt: '2026-06-01' },

  // === KEMASAN ===
  { id: 'b018', nama: 'Cup Plastik 16oz',       kategori: 'kemasan', satuan: 'pcs',   stok: 500,   stokMin: 100, hargaSatuan: 650,    supplier: 'CV Kemasan Prima',  updatedAt: '2026-06-01' },
  { id: 'b019', nama: 'Sedotan Kertas',          kategori: 'kemasan', satuan: 'pak',   stok: 8,     stokMin: 3,   hargaSatuan: 15000,  supplier: 'CV Kemasan Prima',  updatedAt: '2026-06-01' },
  { id: 'b020', nama: 'Kantong Plastik',         kategori: 'kemasan', satuan: 'pak',   stok: 12,    stokMin: 4,   hargaSatuan: 12000,  supplier: 'CV Kemasan Prima',  updatedAt: '2026-05-30' },
];
