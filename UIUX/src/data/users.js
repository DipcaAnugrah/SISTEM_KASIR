// ============================================================
// DUMMY DATA — Users
// 3 Role: kasir · owner · admin
// Password semua: "warkop123"
// ============================================================

export const DUMMY_USERS = [
  // === KASIR ===
  {
    id        : 'u001',
    username  : 'budi',
    password  : 'warkop123',
    nama      : 'Budi Santoso',
    role      : 'kasir',
    cabang    : { id: 'c001', nama: 'Cabang Utama' },
    avatar    : null,
    aktif     : true,
    createdAt : '2025-01-10',
  },
  {
    id        : 'u002',
    username  : 'sari',
    password  : 'warkop123',
    nama      : 'Sari Wulandari',
    role      : 'kasir',
    cabang    : { id: 'c001', nama: 'Cabang Utama' },
    avatar    : null,
    aktif     : true,
    createdAt : '2025-02-15',
  },
  {
    id        : 'u003',
    username  : 'ahmad',
    password  : 'warkop123',
    nama      : 'Ahmad Fauzi',
    role      : 'kasir',
    cabang    : { id: 'c002', nama: 'Cabang Kemang' },
    avatar    : null,
    aktif     : true,
    createdAt : '2025-03-01',
  },

  // === OWNER (mengelola operasional + laporan + manajemen) ===
  {
    id        : 'u004',
    username  : 'dewi',
    password  : 'warkop123',
    nama      : 'Dewi Rahayu',
    role      : 'owner',
    cabang    : null, // akses semua cabang
    avatar    : null,
    aktif     : true,
    createdAt : '2024-11-01',
  },
  {
    id        : 'u005',
    username  : 'hendra',
    password  : 'warkop123',
    nama      : 'Hendra Djoeragan',
    role      : 'owner',
    cabang    : null,
    avatar    : null,
    aktif     : true,
    createdAt : '2024-06-01',
  },

  // === ADMIN (akses penuh termasuk sistem) ===
  {
    id        : 'u006',
    username  : 'admin',
    password  : 'warkop123',
    nama      : 'Administrator',
    role      : 'admin',
    cabang    : null,
    avatar    : null,
    aktif     : true,
    createdAt : '2024-01-01',
  },
];

// Helper untuk simulasi login
export const findUser = (username, password) =>
  DUMMY_USERS.find(
    (u) => u.username === username && u.password === password && u.aktif
  ) ?? null;
