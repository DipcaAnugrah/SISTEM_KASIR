import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { hasAccess } from '../../router/roleConfig';
import styles from './SidebarItem.module.css';

// ============================================================
// SIDEBAR ITEM — single nav link atau group dengan children
// ============================================================

function SidebarItem({ item, collapsed }) {
  const location = useLocation();
  const { role }  = useAuth();

  // === ROLE FILTER ===
  if (!hasAccess(role, item.minRole)) return null;

  // === ITEM TANPA CHILDREN ===
  if (!item.children) {
    const Icon = item.icon;
    return (
      <NavLink
        to        = {item.path}
        className = {({ isActive }) =>
          [styles.item, isActive ? styles.active : '', collapsed ? styles.collapsed : ''].join(' ')
        }
        title={collapsed ? item.label : undefined}
      >
        {Icon && <Icon size={18} className={styles.icon} strokeWidth={1.8} />}
        <span className={styles.label}>{item.label}</span>
        {collapsed && <span className={styles.tooltip}>{item.label}</span>}
      </NavLink>
    );
  }

  // === GROUP ITEM (dengan children) ===
  return <SidebarGroup item={item} collapsed={collapsed} />;
}

// ============================================================
// SIDEBAR GROUP — collapsible group dengan children
// ============================================================

function SidebarGroup({ item, collapsed }) {
  const location = useLocation();
  const { role }  = useAuth();

  // Filter children berdasarkan role
  const visibleChildren = item.children.filter((c) => hasAccess(role, c.minRole));
  if (visibleChildren.length === 0) return null;

  // Cek apakah ada child yang aktif (untuk auto-expand)
  const hasActiveChild = visibleChildren.some(
    (c) => location.pathname === c.path || location.pathname.startsWith(c.path + '/')
  );

  const [open, setOpen] = useState(hasActiveChild);

  // Auto-expand saat navigasi ke child route
  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [location.pathname, hasActiveChild]);

  const GroupIcon = item.icon;

  // Collapsed mode: hanya tampilkan icon, children tidak ditampilkan
  if (collapsed) {
    return (
      <div className={`${styles.item} ${styles.collapsed} ${hasActiveChild ? styles.active : ''}`}>
        {GroupIcon && <GroupIcon size={18} className={styles.icon} strokeWidth={1.8} />}
        <span className={styles.tooltip}>{item.label}</span>
      </div>
    );
  }

  return (
    <div>
      {/* === GROUP HEADER === */}
      <button
        type      = "button"
        className = {`${styles.groupHeader} ${open ? styles.groupOpen : ''}`}
        onClick   = {() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {GroupIcon && <GroupIcon size={18} className={styles.icon} strokeWidth={1.8} />}
        <span className={styles.groupLabel}>{item.label}</span>
        <ChevronRight size={14} className={styles.chevron} strokeWidth={2.5} />
      </button>

      {/* === CHILDREN === */}
      <div className={`${styles.children} ${open ? styles.open : ''}`}>
        {visibleChildren.map((child) => {
          const ChildIcon  = child.icon;
          const isActive   = location.pathname === child.path
                          || location.pathname.startsWith(child.path + '/');
          return (
            <NavLink
              key       = {child.key}
              to        = {child.path}
              className = {`${styles.childItem} ${isActive ? styles.childActive : ''}`}
            >
              {ChildIcon && <ChildIcon size={15} className={styles.childIcon} strokeWidth={1.8} />}
              <span>{child.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default SidebarItem;
