// ============================================================
// DUMMY DATA — Produk Warkop (15 item, 4 kategori)
// ============================================================

export const PRODUCTS = [
  // === KOPI ===
  { id: 'p001', nama: 'Kopi Susu',    kategori: 'kopi',    harga: 14000, stok: 50, emoji: '☕', deskripsi: 'Kopi robusta blend susu segar', tersedia: true },
  { id: 'p002', nama: 'Americano',    kategori: 'kopi',    harga: 12000, stok: 40, emoji: '🖤', deskripsi: 'Espresso dengan air panas', tersedia: true },
  { id: 'p003', nama: 'Espresso',     kategori: 'kopi',    harga: 10000, stok: 35, emoji: '⚡', deskripsi: 'Single shot espresso pekat', tersedia: true },
  { id: 'p004', nama: 'Cappuccino',   kategori: 'kopi',    harga: 16000, stok: 30, emoji: '🫧', deskripsi: 'Espresso + steamed milk + foam', tersedia: true },
  { id: 'p005', nama: 'Latte',        kategori: 'kopi',    harga: 15000, stok: 28, emoji: '🥛', deskripsi: 'Espresso dengan susu full cream', tersedia: true },

  // === NON-KOPI ===
  { id: 'p006', nama: 'Teh Tarik',    kategori: 'nonkopi', harga: 10000, stok: 45, emoji: '🍵', deskripsi: 'Teh susu khas Malaysia', tersedia: true },
  { id: 'p007', nama: 'Matcha Latte', kategori: 'nonkopi', harga: 15000, stok: 20, emoji: '🍃', deskripsi: 'Matcha premium dengan susu', tersedia: true },
  { id: 'p008', nama: 'Coklat Panas', kategori: 'nonkopi', harga: 12000, stok: 25, emoji: '🍫', deskripsi: 'Dark chocolate premium blend', tersedia: true },
  { id: 'p009', nama: 'Lemon Tea',    kategori: 'nonkopi', harga: 10000, stok: 38, emoji: '🍋', deskripsi: 'Teh dingin segar lemon asli', tersedia: true },

  // === MAKANAN ===
  { id: 'p010', nama: 'Mie Goreng',   kategori: 'makanan', harga: 20000, stok: 15, emoji: '🍜', deskripsi: 'Mie goreng spesial khas warkop', tersedia: true },
  { id: 'p011', nama: 'Roti Bakar',   kategori: 'makanan', harga: 15000, stok: 18, emoji: '🍞', deskripsi: 'Roti bakar + selai coklat/kacang', tersedia: true },
  { id: 'p012', nama: 'Pisang Goreng',kategori: 'makanan', harga: 12000, stok: 20, emoji: '🍌', deskripsi: 'Pisang kepok goreng crispy', tersedia: true },
  { id: 'p013', nama: 'Nasi Goreng',  kategori: 'makanan', harga: 25000, stok: 12, emoji: '🍳', deskripsi: 'Nasi goreng spesial telur + ayam', tersedia: true },

  // === SNACK ===
  { id: 'p014', nama: 'Keripik',      kategori: 'snack',   harga: 8000,  stok: 30, emoji: '🥨', deskripsi: 'Keripik singkong rasa balado', tersedia: true },
  { id: 'p015', nama: 'Kacang Goreng',kategori: 'snack',   harga: 7000,  stok: 35, emoji: '🥜', deskripsi: 'Kacang tanah goreng bawang', tersedia: true },
];

// === Helper filter produk ===
export const getProductsByCategory = (kategori) =>
  kategori === 'semua'
    ? PRODUCTS.filter((p) => p.tersedia)
    : PRODUCTS.filter((p) => p.kategori === kategori && p.tersedia);

export const searchProducts = (query, kategori = 'semua') => {
  const list = getProductsByCategory(kategori);
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter((p) => p.nama.toLowerCase().includes(q));
};
