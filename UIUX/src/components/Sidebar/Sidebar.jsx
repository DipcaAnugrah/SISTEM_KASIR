import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, MapPin, ChevronsLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUI }  from '../../hooks/useUI';
import { SIDEBAR_MENU, ROLE_LABELS } from '../../router/roleConfig';
import SidebarItem from './SidebarItem';
import styles from './Sidebar.module.css';

// ============================================================
// SIDEBAR — Warkop Djoeragan POS
// Responsive: full → collapsed (icon-only) → mobile slide-in
// ============================================================

function Sidebar() {
  const { user, role, logout } = useAuth();
  const { sidebarOpen, sidebarCollapsed, toggleSidebar, collapseSidebar, toast } = useUI();
  const navigate = useNavigate();

  // === Responsive: auto-collapse pada tablet ===
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 768) {
        // Mobile: controlled by sidebarOpen (overlay mode)
        collapseSidebar(false);
      } else if (w <= 1024) {
        // Tablet: force icon-only
        collapseSidebar(true);
      } else {
        // Desktop: full sidebar
        collapseSidebar(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapseSidebar]);

  // === LOGOUT ===
  const handleLogout = () => {
    toast.info('Keluar dari sistem...');
    setTimeout(() => {
      logout();
      navigate('/login', { replace: true });
    }, 500);
  };

  // === Inisial nama user untuk avatar ===
  const initials = user?.nama
    ? user.nama.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '??';

  const isMobile    = window.innerWidth <= 768;
  const isCollapsed = !isMobile && sidebarCollapsed;
  const isMobileOpen= isMobile && sidebarOpen;

  return (
    <>
      {/* === MOBILE OVERLAY === */}
      {isMobileOpen && (
        <div
          className = {styles.overlay}
          onClick   = {toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* === SIDEBAR WRAPPER === */}
      <aside
        className = {[
          styles.sidebar,
          isCollapsed  ? styles.collapsed  : '',
          isMobileOpen ? styles.mobileOpen : '',
        ].join(' ')}
        aria-label="Navigasi utama"
      >

        {/* === LOGO SECTION === */}
        <div className={styles.logoSection}>
          <div className={styles.logoMark} aria-hidden="true">
            <Coffee size={18} strokeWidth={2} />
          </div>
          <div className={`${styles.logoText} ${isCollapsed ? styles.hidden : ''}`}>
            <p className={styles.logoName}>Djoeragan</p>
            <p className={styles.logoSub}>POS System</p>
          </div>
        </div>

        {/* === BRANCH BADGE === */}
        {user?.cabang && (
          <div className={`${styles.branchBadge} ${isCollapsed ? styles.hidden : ''}`}>
            <MapPin size={12} className={styles.branchIcon} strokeWidth={2.5} />
            <span className={styles.branchName}>{user.cabang.nama}</span>
          </div>
        )}

        {/* === NAVIGATION === */}
        <nav className={styles.nav} aria-label="Menu utama">
          <p className={`${styles.navLabel} ${isCollapsed ? styles.hidden : ''}`}>
            Menu
          </p>
          {SIDEBAR_MENU.map((item) => (
            <SidebarItem
              key      = {item.key}
              item     = {item}
              collapsed= {isCollapsed}
            />
          ))}
        </nav>

        {/* === COLLAPSE TOGGLE BUTTON (desktop only) === */}
        <button
          type      = "button"
          className = {styles.collapseBtn}
          onClick   = {() => collapseSidebar(!sidebarCollapsed)}
          title     = {sidebarCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          aria-label= {sidebarCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        >
          <ChevronsLeft
            size      = {16}
            strokeWidth={2}
            className = {`${styles.collapseIcon} ${isCollapsed ? styles.flipped : ''}`}
          />
          <span className={`${styles.collapseLabel} ${isCollapsed ? styles.hidden : ''}`}>
            Ciutkan
          </span>
        </button>

        {/* === USER FOOTER === */}
        <div className={styles.userFooter}>
          <div className={styles.userAvatar} aria-hidden="true">
            {initials}
          </div>
          <div className={`${styles.userInfo} ${isCollapsed ? styles.hidden : ''}`}>
            <p className={styles.userName}>{user?.nama ?? 'Pengguna'}</p>
            <p className={styles.userRole}>{ROLE_LABELS[role] ?? role}</p>
          </div>
          <button
            type      = "button"
            className = {styles.logoutBtn}
            onClick   = {handleLogout}
            title     = "Keluar"
            aria-label= "Keluar dari sistem"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;
