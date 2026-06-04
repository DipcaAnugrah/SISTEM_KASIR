// ============================================================
// DUMMY DATA — Kategori Produk
// ============================================================

import { Coffee, Leaf, UtensilsCrossed, Cookie } from 'lucide-react';

export const CATEGORIES = [
  { id: 'semua',   label: 'Semua',     icon: null,              color: '#2563EB' },
  { id: 'kopi',    label: 'Kopi',      icon: Coffee,            color: '#92400E' },
  { id: 'nonkopi', label: 'Non-Kopi',  icon: Leaf,              color: '#065F46' },
  { id: 'makanan', label: 'Makanan',   icon: UtensilsCrossed,   color: '#9D174D' },
  { id: 'snack',   label: 'Snack',     icon: Cookie,            color: '#92400E' },
];
