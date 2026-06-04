// ============================================================
// FORMAT UTILITIES — Warkop Djoeragan POS
// ============================================================

// === Format angka ke Rupiah ===
export const formatRupiah = (angka, singkat = false) => {
  if (angka === null || angka === undefined) return 'Rp 0';

  if (singkat) {
    if (angka >= 1_000_000_000) return `Rp ${(angka / 1_000_000_000).toFixed(1)}M`;
    if (angka >= 1_000_000)     return `Rp ${(angka / 1_000_000).toFixed(1)} Jt`;
    if (angka >= 1_000)         return `Rp ${(angka / 1_000).toFixed(0)}K`;
    return `Rp ${angka}`;
  }

  return new Intl.NumberFormat('id-ID', {
    style   : 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

// === Format waktu ke "14:30" ===
export const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

// === Format durasi dalam menit ke "1j 25m" ===
export const formatDurasi = (startIso) => {
  const diff = Math.floor((Date.now() - new Date(startIso).getTime()) / 60000);
  if (diff < 60) return `${diff} mnt`;
  const jam = Math.floor(diff / 60);
  const mnt = diff % 60;
  return `${jam}j ${mnt}m`;
};

// === Format tanggal Indonesia ===
export const formatTanggal = (iso, long = false) => {
  const opts = long
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(iso).toLocaleDateString('id-ID', opts);
};

// === Singkat nama (max 2 kata) ===
export const singkatNama = (nama) =>
  nama?.split(' ').slice(0, 2).join(' ') ?? '';
