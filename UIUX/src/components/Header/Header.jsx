import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Moon, Sun, LogOut, ChevronDown } from 'lucide-react';
import { useAuth }  from '../../hooks/useAuth';
import { useUI }   from '../../hooks/useUI';
import { useShift } from '../../hooks/useShift';
import { formatRupiah } from '../../utils/format';
import { ROLE_LABELS } from '../../router/roleConfig';
import styles from './Header.module.css';

// ============================================================
// HEADER — Warkop Djoeragan POS
// Sticky top bar: page title · shift status · theme · user
// ============================================================

const PAGE_TITLES = {
  '/dashboard'              : { title: 'Dashboard',           group: null },
  '/operasional/pos'        : { title: 'Kasir POS',           group: 'Operasional' },
  '/operasional/pesanan'    : { title: 'Pesanan Berjalan',    group: 'Operasional' },
  '/operasional/meja'       : { title: 'Manajemen Meja',      group: 'Operasional' },
  '/operasional/shift'      : { title: 'Shift Kasir',         group: 'Operasional' },
  '/laporan/cabang'         : { title: 'Laporan Cabang',      group: 'Laporan' },
  '/laporan/konsolidasi'    : { title: 'Laporan Konsolidasi', group: 'Laporan' },
  '/manajemen/produk'       : { title: 'Produk',              group: 'Manajemen' },
  '/manajemen/bahan-baku'   : { title: 'Bahan Baku',          group: 'Manajemen' },
  '/manajemen/cabang'       : { title: 'Cabang',              group: 'Manajemen' },
  '/sistem/pengguna'        : { title: 'Manajemen User',      group: 'Sistem' },
  '/sistem/pengaturan'      : { title: 'Pengaturan Sistem',   group: 'Sistem' },
};

function Header({ sidebarWidth }) {
  const { user, logout, role }       = useAuth();
  const { toggleSidebar, toggleTheme, isDark } = useUI();
  const { isOpen: shiftOpen, totalBersih }     = useShift();
  const location  = useLocation();
  const navigate  = useNavigate();

  const pageInfo = PAGE_TITLES[location.pathname] ?? { title: 'Halaman', group: null };

  const initials  = user?.nama
    ? user.nama.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '?';
  const shortName = user?.nama?.split(' ')[0] ?? 'Pengguna';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className={styles.header} style={{ left: sidebarWidth }}>

      {/* === LEFT: Hamburger + Page Title === */}
      <div className={styles.left}>
        <button
          type      = "button"
          className = {styles.hamburger}
          onClick   = {toggleSidebar}
          aria-label= "Toggle sidebar"
        >
          <Menu size={20} strokeWidth={2} />
        </button>

        <div>
          {pageInfo.group && (
            <p className={styles.pageBreadcrumb}>
              {pageInfo.group}
              <span className={styles.separator}> / </span>
            </p>
          )}
          <h1 className={styles.pageTitle}>{pageInfo.title}</h1>
        </div>
      </div>

      {/* === RIGHT === */}
      <div className={styles.right}>

        {/* Shift status pill */}
        {shiftOpen ? (
          <div className={styles.shiftPill} title="Shift aktif — klik untuk detail">
            <span className={styles.shiftDot} />
            <span className={styles.shiftLabel}>Shift · {formatRupiah(totalBersih, true)}</span>
          </div>
        ) : (
          <div className={`${styles.shiftPill} ${styles.shiftOff}`} title="Tidak ada shift aktif">
            <span className={styles.shiftDotOff} />
            <span className={styles.shiftLabel}>Shift Tutup</span>
          </div>
        )}

        <div className={styles.divider} aria-hidden="true" />

        {/* Dark mode toggle */}
        <button
          id        = "btn-theme-toggle"
          type      = "button"
          className = {`${styles.iconBtn} ${styles.themeBtn}`}
          onClick   = {toggleTheme}
          aria-label= {isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
          title     = {isDark ? 'Mode Terang' : 'Mode Gelap'}
        >
          {isDark
            ? <Sun  size={17} strokeWidth={2} />
            : <Moon size={17} strokeWidth={2} />
          }
        </button>

        {/* Notification bell */}
        <button
          id        = "btn-notif"
          type      = "button"
          className = {styles.iconBtn}
          aria-label= "Notifikasi"
          title     = "Notifikasi"
        >
          <Bell size={17} strokeWidth={2} />
          <span className={styles.notifBadge} aria-label="3 notifikasi baru">3</span>
        </button>

        <div className={styles.divider} aria-hidden="true" />

        {/* User button + logout */}
        <div className={styles.userWrap}>
          <button
            id        = "btn-user-menu"
            type      = "button"
            className = {styles.userBtn}
            aria-label= {`Pengguna: ${user?.nama}`}
            title     = {`${user?.nama} · ${ROLE_LABELS[role] ?? role}`}
          >
            <div className={styles.userAvatar} aria-hidden="true">{initials}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{shortName}</span>
              <span className={styles.userRole}>{ROLE_LABELS[role] ?? role}</span>
            </div>
            <ChevronDown size={13} strokeWidth={2.5} className={styles.chevronIcon} />
          </button>

          {/* Logout shortcut */}
          <button
            id        = "btn-logout"
            type      = "button"
            className = {styles.logoutBtn}
            onClick   = {handleLogout}
            aria-label= "Keluar"
            title     = "Keluar"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;
