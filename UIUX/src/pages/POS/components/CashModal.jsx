import { useState } from 'react';
import { Banknote, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useUI }  from '../../../hooks/useUI';
import { formatRupiah } from '../../../utils/format';
import Modal from '../../../components/Modal/Modal';
import styles from './CashModal.module.css';

// ============================================================
// CASH PAYMENT MODAL
// ============================================================

const QUICK_AMOUNTS = [10000, 20000, 50000, 100000, 150000, 200000];

function CashModal({ isOpen, onClose }) {
  const { total, tableId, clearCart } = useCart();
  const { toast } = useUI();

  const [dibayar, setDibayar] = useState('');
  const [paid, setPaid]       = useState(false);

  const nominal    = Number(dibayar.replace(/\D/g, '')) || 0;
  const kembalian  = nominal - total;
  const isValid    = nominal >= total;

  const handleInput = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setDibayar(raw);
  };

  const handleQuick = (amt) => {
    setDibayar(String(amt));
  };

  const handleConfirm = () => {
    if (!isValid) return;
    setPaid(true);

    setTimeout(() => {
      toast.success(`Transaksi selesai! Kembalian ${formatRupiah(kembalian)}`);
      clearCart();
      onClose();
      setPaid(false);
      setDibayar('');
    }, 1200);
  };

  const handleClose = () => {
    setDibayar('');
    setPaid(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="💵 Pembayaran Tunai" size="sm">
      {!paid ? (
        <div className={styles.content}>
          {/* Total tagihan */}
          <div className={styles.tagihanBox}>
            <p className={styles.tagihanLabel}>Total Tagihan</p>
            <p className={styles.tagihanValue}>{formatRupiah(total)}</p>
            {tableId && <p className={styles.mejaBadge}>Meja {tableId.toUpperCase()}</p>}
          </div>

          {/* Input nominal */}
          <div className={styles.field}>
            <label htmlFor="cash-input" className={styles.label}>
              Nominal Dibayar (Rp)
            </label>
            <div className={`${styles.inputWrap} ${!isValid && dibayar ? styles.inputInvalid : isValid && dibayar ? styles.inputValid : ''}`}>
              <span className={styles.prefix}>Rp</span>
              <input
                id         = "cash-input"
                type       = "text"
                inputMode  = "numeric"
                className  = {styles.input}
                value      = {dibayar ? Number(dibayar).toLocaleString('id-ID') : ''}
                onChange   = {handleInput}
                placeholder= "0"
                autoFocus
              />
            </div>
          </div>

          {/* Quick amounts */}
          <div className={styles.quickGrid}>
            {QUICK_AMOUNTS.filter((a) => a >= total * 0.5).slice(0, 6).map((amt) => (
              <button
                key       = {amt}
                type      = "button"
                className = {`${styles.quickBtn} ${nominal === amt ? styles.quickActive : ''}`}
                onClick   = {() => handleQuick(amt)}
              >
                {formatRupiah(amt, true)}
              </button>
            ))}
          </div>

          {/* Kembalian */}
          <div className={`${styles.kembalianBox} ${isValid && dibayar ? styles.kembalianShow : ''}`}>
            <span className={styles.kembalianLabel}>Kembalian</span>
            <span className={styles.kembalianValue}>
              {isValid ? formatRupiah(kembalian) : '—'}
            </span>
          </div>

          {/* Confirm button */}
          <button
            id        = "btn-cash-confirm"
            type      = "button"
            className = {styles.confirmBtn}
            onClick   = {handleConfirm}
            disabled  = {!isValid}
          >
            <Banknote size={18} strokeWidth={2} />
            <span>Konfirmasi Pembayaran</span>
          </button>
        </div>
      ) : (
        /* === SUCCESS STATE === */
        <div className={styles.success}>
          <CheckCircle2 size={56} strokeWidth={1.5} className={styles.successIcon} />
          <p className={styles.successTitle}>Pembayaran Berhasil!</p>
          <p className={styles.successSub}>Kembalian: <strong>{formatRupiah(kembalian)}</strong></p>
        </div>
      )}
    </Modal>
  );
}

export default CashModal;
