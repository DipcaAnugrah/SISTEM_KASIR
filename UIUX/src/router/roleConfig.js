// ============================================================
// ROLE CONFIG — Warkop Djoeragan POS
// 3 Role: kasir · owner · admin
// ============================================================

import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  LayoutGrid,
  Clock,
  BarChart2,
  FileText,
  TrendingUp,
  Package,
  Boxes,
  MapPin,
  Shield,
  Users,
  Settings,
} from 'lucide-react';

// === ROLE CONSTANTS ===
export const ROLES = {
  KASIR: 'kasir',
  OWNER: 'owner',
  ADMIN: 'admin',
};

// === ROLE HIERARCHY (index lebih tinggi = akses lebih luas) ===
export const ROLE_HIERARCHY = [
  ROLES.KASIR,
  ROLES.OWNER,
  ROLES.ADMIN,
];

// === ROLE DISPLAY LABELS ===
export const ROLE_LABELS = {
  [ROLES.KASIR]: 'Kasir',
  [ROLES.OWNER]: 'Owner',
  [ROLES.ADMIN]: 'Admin',
};

// === ROLE BADGE COLORS ===
export const ROLE_COLORS = {
  [ROLES.KASIR]: 'info',
  [ROLES.OWNER]: 'warning',
  [ROLES.ADMIN]: 'danger',
};

// === ROUTE PERMISSIONS (minimum role yg dibutuhkan) ===
export const ROUTE_PERMISSIONS = {
  '/dashboard'              : ROLES.KASIR,
  '/operasional/pos'        : ROLES.KASIR,
  '/operasional/pesanan'    : ROLES.KASIR,
  '/operasional/meja'       : ROLES.KASIR,
  '/operasional/shift'      : ROLES.KASIR,
  '/laporan/cabang'         : ROLES.OWNER,
  '/laporan/konsolidasi'    : ROLES.OWNER,
  '/manajemen/produk'       : ROLES.OWNER,
  '/manajemen/bahan-baku'   : ROLES.OWNER,
  '/manajemen/cabang'       : ROLES.OWNER,
  '/sistem/pengguna'        : ROLES.ADMIN,
  '/sistem/pengaturan'      : ROLES.ADMIN,
};

// === HELPER: cek akses role ===
export const hasAccess = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(requiredRole);
};

// === SIDEBAR MENU CONFIG ===
export const SIDEBAR_MENU = [
  {
    key    : 'dashboard',
    label  : 'Dashboard',
    icon   : LayoutDashboard,
    path   : '/dashboard',
    minRole: ROLES.KASIR,
  },
  {
    key    : 'operasional',
    label  : 'Operasional',
    icon   : ShoppingCart,
    minRole: ROLES.KASIR,
    children: [
      { key: 'pos',     label: 'Kasir POS',        path: '/operasional/pos',     icon: ShoppingCart,  minRole: ROLES.KASIR },
      { key: 'pesanan', label: 'Pesanan Berjalan',  path: '/operasional/pesanan', icon: ClipboardList, minRole: ROLES.KASIR },
      { key: 'meja',    label: 'Meja',              path: '/operasional/meja',    icon: LayoutGrid,    minRole: ROLES.KASIR },
      { key: 'shift',   label: 'Shift Kasir',       path: '/operasional/shift',   icon: Clock,         minRole: ROLES.KASIR },
    ],
  },
  {
    key    : 'laporan',
    label  : 'Laporan',
    icon   : BarChart2,
    minRole: ROLES.OWNER,
    children: [
      { key: 'cabang',      label: 'Laporan Cabang',    path: '/laporan/cabang',      icon: FileText,   minRole: ROLES.OWNER },
      { key: 'konsolidasi', label: 'Lap. Konsolidasi',  path: '/laporan/konsolidasi', icon: TrendingUp, minRole: ROLES.OWNER },
    ],
  },
  {
    key    : 'manajemen',
    label  : 'Manajemen',
    icon   : Package,
    minRole: ROLES.OWNER,
    children: [
      { key: 'produk',     label: 'Produk',       path: '/manajemen/produk',     icon: Package, minRole: ROLES.OWNER },
      { key: 'bahan-baku', label: 'Bahan Baku',   path: '/manajemen/bahan-baku', icon: Boxes,   minRole: ROLES.OWNER },
      { key: 'cabang',     label: 'Cabang',        path: '/manajemen/cabang',     icon: MapPin,  minRole: ROLES.OWNER },
    ],
  },
  {
    key    : 'sistem',
    label  : 'Sistem',
    icon   : Shield,
    minRole: ROLES.ADMIN,
    children: [
      { key: 'pengguna',   label: 'Manajemen User',   path: '/sistem/pengguna',   icon: Users,    minRole: ROLES.ADMIN },
      { key: 'pengaturan', label: 'Pengaturan Sistem', path: '/sistem/pengaturan', icon: Settings, minRole: ROLES.ADMIN },
    ],
  },
];
