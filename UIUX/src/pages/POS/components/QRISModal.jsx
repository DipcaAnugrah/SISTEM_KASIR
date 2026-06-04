import { useState } from 'react';
import { CheckCircle2, QrCode } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useUI }  from '../../../hooks/useUI';
import { formatRupiah } from '../../../utils/format';
import Modal from '../../../components/Modal/Modal';
import styles from './CashModal.module.css';

// ============================================================
// QRIS PAYMENT MODAL — CSS-only QR display
// ============================================================

// Pseudo-random QR pattern (decorative, 8×8)
const QR_PATTERN = [
  1,1,1,1,1,1,1,0, 1,0,1,0,1,0,1,1,
  1,0,0,0,0,0,1,0, 0,1,0,1,0,0,0,1,
  1,0,1,1,1,0,1,0, 1,0,1,1,1,0,1,0,
  1,0,1,1,1,0,1,0, 0,1,1,0,0,1,0,1,
  1,0,1,1,1,0,1,0, 1,1,0,0,1,1,1,0,
  1,0,0,0,0,0,1,0, 0,0,1,0,0,1,0,1,
  1,1,1,1,1,1,1,0, 1,0,1,0,1,0,1,1,
  0,0,0,0,0,0,0,0, 0,1,1,0,0,1,1,0,
];

function QRISModal({ isOpen, onClose }) {
  const { total, tableId, clearCart } = useCart();
  const { toast } = useUI();
  const [paid, setPaid] = useState(false);

  const handleConfirmPaid = () => {
    setPaid(true);
    setTimeout(() => {
      toast.success('Pembayaran QRIS berhasil dikonfirmasi!');
      clearCart();
      onClose();
      setPaid(false);
    }, 1200);
  };

  const handleClose = () => {
    setPaid(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="📱 Pembayaran QRIS" size="sm">
      {!paid ? (
        <div className={styles.content}>
          {/* Tagihan */}
          <div className={styles.tagihanBox}>
            <p className={styles.tagihanLabel}>Total Tagihan</p>
            <p className={styles.tagihanValue}>{formatRupiah(total)}</p>
            {tableId && <p className={styles.mejaBadge}>Meja {tableId.toUpperCase()}</p>}
          </div>

          {/* QR Code (CSS-only decorative) */}
          <div className={styles.qrWrap}>
            <div
              className = {styles.qrBox}
              role      = "img"
              aria-label= "QR Code pembayaran QRIS"
            >
              {QR_PATTERN.map((cell, i) => (
                <div
                  key       = {i}
                  className = {`${styles.qrCell} ${cell === 0 ? styles.qrEmpty : ''}`}
                />
              ))}
            </div>

            <p className={styles.qrInstruction}>
              Scan dengan aplikasi dompet digital
            </p>

            {/* Waiting status */}
            <div className={styles.qrStatus}>
              <span className={styles.qrStatusDot} />
              <span>Menunggu pembayaran...</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.qrisBtns}>
            <button
              id        = "btn-qris-cancel"
              type      = "button"
              className = {styles.qrisCancelBtn}
              onClick   = {handleClose}
            >
              Batal
            </button>
            <button
              id        = "btn-qris-confirm"
              type      = "button"
              className = {styles.qrisConfirmBtn}
              onClick   = {handleConfirmPaid}
            >
              <QrCode size={16} strokeWidth={2} />
              <span>Konfirmasi</span>
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.success}>
          <CheckCircle2 size={56} strokeWidth={1.5} className={styles.successIcon} />
          <p className={styles.successTitle}>Pembayaran QRIS Berhasil!</p>
          <p className={styles.successSub}>
            Total: <strong>{formatRupiah(total)}</strong>
          </p>
        </div>
      )}
    </Modal>
  );
}

export default QRISModal;
