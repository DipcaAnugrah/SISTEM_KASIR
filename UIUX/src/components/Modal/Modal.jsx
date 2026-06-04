import { useEffect, useCallback } from 'react';
import { createPortal }           from 'react-dom';
import { X }                      from 'lucide-react';
import styles from './Modal.module.css';

// ============================================================
// MODAL — Base component reusable
// Props: isOpen, onClose, title, size, children
// ⚠️  Menggunakan createPortal → render ke document.body
//     agar tidak terpengaruh overflow/transform/z-index parent
// ============================================================

function Modal({ isOpen, onClose, title, size = 'md', children }) {
  // === Tutup dengan ESC key ===
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // createPortal → modal selalu di level document.body
  // sehingga position:fixed selalu relatif terhadap viewport
  return createPortal(
    <div
      className  = {styles.overlay}
      onClick    = {onClose}
      role       = "dialog"
      aria-modal = "true"
      aria-label = {title}
    >
      <div
        className = {`${styles.panel} ${styles[size]}`}
        onClick   = {(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              type      = "button"
              className = {styles.closeBtn}
              onClick   = {onClose}
              aria-label= "Tutup modal"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>,
    document.body   // ← mount di luar DOM tree komponen
  );
}

export default Modal;
