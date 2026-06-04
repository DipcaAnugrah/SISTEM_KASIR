import { Outlet } from 'react-router-dom';
import { useUI }  from '../../hooks/useUI';
import Sidebar    from '../../components/Sidebar/Sidebar';
import Header     from '../../components/Header/Header';
import Toast      from '../../components/Toast/Toast';
import styles     from './MainLayout.module.css';

// ============================================================
// MAIN LAYOUT — Warkop Djoeragan POS
// Shell: Sidebar (fixed) + Header (fixed) + main content
// ============================================================

function MainLayout() {
  const { sidebarCollapsed } = useUI();

  // === Hitung lebar sidebar untuk posisi header ===
  const isMobile    = typeof window !== 'undefined' && window.innerWidth <= 768;
  const sidebarPx   = isMobile
    ? 0
    : sidebarCollapsed
      ? 'var(--sidebar-width-collapsed)'
      : 'var(--sidebar-width)';

  return (
    <div className={styles.shell}>

      {/* === FIXED SIDEBAR === */}
      <Sidebar />

      {/* === FIXED HEADER === */}
      <Header sidebarWidth={sidebarPx} />

      {/* === SCROLLABLE MAIN CONTENT === */}
      <main
        className={`${styles.main} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
        id="main-content"
      >
        <div className={styles.content}>
          {/* Pages rendered here via React Router */}
          <Outlet />
        </div>
      </main>

      {/* === TOAST NOTIFICATIONS (portal-style, rendered at root level) === */}
      <Toast />

    </div>
  );
}

export default MainLayout;
