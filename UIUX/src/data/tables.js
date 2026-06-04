// ============================================================
// DUMMY DATA — Meja (M01–M10)
// ============================================================

export const DUMMY_TABLES = [
  { id: 'm01', nomor: 'M01', nama: 'Meja Teras 1',   kapasitas: 4, status: 'kosong',         durasi: null },
  { id: 'm02', nomor: 'M02', nama: 'Meja Teras 2',   kapasitas: 2, status: 'terisi',         durasi: 35   },
  { id: 'm03', nomor: 'M03', nama: 'VIP Room',        kapasitas: 6, status: 'menunggu_bayar', durasi: 72   },
  { id: 'm04', nomor: 'M04', nama: '',                kapasitas: 4, status: 'kosong',         durasi: null },
  { id: 'm05', nomor: 'M05', nama: '',                kapasitas: 2, status: 'terisi',         durasi: 12   },
  { id: 'm06', nomor: 'M06', nama: '',                kapasitas: 4, status: 'kosong',         durasi: null },
  { id: 'm07', nomor: 'M07', nama: 'Pojok WiFi',      kapasitas: 6, status: 'kosong',         durasi: null },
  { id: 'm08', nomor: 'M08', nama: '',                kapasitas: 2, status: 'terisi',         durasi: 48   },
  { id: 'm09', nomor: 'M09', nama: '',                kapasitas: 4, status: 'kosong',         durasi: null },
  { id: 'm10', nomor: 'M10', nama: 'Lesehan',         kapasitas: 6, status: 'menunggu_bayar', durasi: 90   },
];


export const STATUS_LABELS = {
  kosong        : { label: 'Kosong',           color: 'success' },
  terisi        : { label: 'Terisi',           color: 'warning' },
  menunggu_bayar: { label: 'Menunggu Bayar',   color: 'danger'  },
};
