import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './AuthLayout.module.css';

// ============================================================
// AUTH LAYOUT — wrapper halaman publik (Login)
// Jika sudah login → redirect ke dashboard
// ============================================================

function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={styles.wrapper}>
      {/* Background decorative elements */}
      <div className={styles.bgOrb1} aria-hidden="true" />
      <div className={styles.bgOrb2} aria-hidden="true" />
      <div className={styles.bgOrb3} aria-hidden="true" />

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Warkop Djoeragan · Sistem Kasir Multi-Cabang</p>
      </footer>
    </div>
  );
}

export default AuthLayout;
