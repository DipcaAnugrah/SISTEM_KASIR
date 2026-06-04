import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUI } from '../../hooks/useUI';
import styles from './Toast.module.css';

// ============================================================
// TOAST SYSTEM — Warkop Djoeragan POS
// Rendered inside MainLayout, reads from UIContext
// ============================================================

const ICON_MAP = {
  success: CheckCircle2,
  error  : XCircle,
  warning: AlertTriangle,
  info   : Info,
};

// === Single Toast Item ===
function ToastItem({ toast }) {
  const { removeToast } = useUI();
  const [exiting, setExiting] = useState(false);

  const Icon = ICON_MAP[toast.type] ?? Info;

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => removeToast(toast.id), 280);
  };

  return (
    <div
      className  = {`${styles.toast} ${styles[toast.type]} ${exiting ? styles.exiting : ''}`}
      role       = "alert"
      aria-live  = "polite"
      onClick    = {handleClose}
    >
      {/* Icon */}
      <div className={styles.iconWrap} aria-hidden="true">
        <Icon size={16} strokeWidth={2.5} />
      </div>

      {/* Message */}
      <div className={styles.content}>
        <p className={styles.message}>{toast.message}</p>
      </div>

      {/* Close button */}
      <button
        type      = "button"
        className = {styles.closeBtn}
        onClick   = {(e) => { e.stopPropagation(); handleClose(); }}
        aria-label= "Tutup notifikasi"
      >
        <X size={14} strokeWidth={2.5} />
      </button>

      {/* Progress bar */}
      <div
        className = {styles.progress}
        style     = {{ animationDuration: `${toast.duration}ms` }}
        aria-hidden="true"
      />
    </div>
  );
}

// === Toast Container ===
function Toast() {
  const { toasts } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} aria-label="Notifikasi" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

export default Toast;
