import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// === LAYOUTS ===
import AuthLayout  from '../layouts/AuthLayout/AuthLayout';
import MainLayout  from '../layouts/MainLayout/MainLayout';

// === PAGES — Lazy loaded untuk code splitting ===
const Login               = lazy(() => import('../pages/Login/Login'));
const Dashboard           = lazy(() => import('../pages/Dashboard/Dashboard'));
const POS                 = lazy(() => import('../pages/POS/POS'));
const Pesanan             = lazy(() => import('../pages/Pesanan/Pesanan'));
const Meja                = lazy(() => import('../pages/Meja/Meja'));
const Shift               = lazy(() => import('../pages/Shift/Shift'));
const LaporanCabang       = lazy(() => import('../pages/LaporanCabang/LaporanCabang'));
const LaporanKonsolidasi  = lazy(() => import('../pages/LaporanKonsolidasi/LaporanKonsolidasi'));
const ManajemenProduk     = lazy(() => import('../pages/ManajemenProduk/ManajemenProduk'));
const ManajemenBahanBaku  = lazy(() => import('../pages/ManajemenBahanBaku/ManajemenBahanBaku'));
const ManajemenCabang     = lazy(() => import('../pages/ManajemenCabang/ManajemenCabang'));
const ManajemenUser       = lazy(() => import('../pages/ManajemenUser/ManajemenUser'));
const PengaturanSistem    = lazy(() => import('../pages/PengaturanSistem/PengaturanSistem'));

// === LOADING FALLBACK ===
function PageLoader() {
  return (
    <div style={{
      display        : 'flex',
      alignItems     : 'center',
      justifyContent : 'center',
      minHeight      : '100vh',
      background     : 'var(--color-bg)',
    }}>
      <div style={{
        width       : 36,
        height      : 36,
        border      : '3px solid var(--color-border)',
        borderTop   : '3px solid var(--color-primary)',
        borderRadius: '50%',
        animation   : 'spin 0.7s linear infinite',
      }} />
    </div>
  );
}

// ============================================================
// APP ROUTER — React Router v6
// Satu ProtectedRoute di level MainLayout (tidak duplikat)
// ============================================================

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* === PUBLIC ROUTES === */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* === PROTECTED ROUTES — satu guard di MainLayout === */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Default redirect */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Operasional — Kasir ke atas */}
            <Route path="/operasional">
              <Route index element={<Navigate to="/operasional/pos" replace />} />
              <Route path="pos"     element={<POS />} />
              <Route path="pesanan" element={<Pesanan />} />
              <Route path="meja"    element={<Meja />} />
              <Route path="shift"   element={<Shift />} />
            </Route>

            {/* Laporan — Manager ke atas */}
            <Route path="/laporan">
              <Route index element={<Navigate to="/laporan/cabang" replace />} />
              <Route path="cabang"      element={<LaporanCabang />} />
              <Route path="konsolidasi" element={<LaporanKonsolidasi />} />
            </Route>

            {/* Manajemen — Owner ke atas */}
            <Route path="/manajemen">
              <Route index element={<Navigate to="/manajemen/produk" replace />} />
              <Route path="produk"     element={<ManajemenProduk />} />
              <Route path="bahan-baku" element={<ManajemenBahanBaku />} />
              <Route path="cabang"     element={<ManajemenCabang />} />
            </Route>

            {/* Sistem — Super Admin only */}
            <Route path="/sistem">
              <Route index element={<Navigate to="/sistem/pengguna" replace />} />
              <Route path="pengguna"   element={<ManajemenUser />} />
              <Route path="pengaturan" element={<PengaturanSistem />} />
            </Route>
          </Route>

          {/* === CATCH-ALL === */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
