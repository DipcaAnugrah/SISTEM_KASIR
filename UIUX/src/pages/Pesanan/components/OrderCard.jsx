import { Clock, User, Banknote, QrCode } from 'lucide-react';
import { formatTime, formatRupiah, formatDurasi } from '../../../utils/format';
import styles from './OrderCard.module.css';

// ============================================================
// ORDER CARD — satu kartu pesanan berjalan
// ============================================================

const STATUS_MAP = {
  aktif          : { label: 'Aktif' },
  menunggu_bayar : { label: 'Menunggu Bayar' },
  selesai        : { label: 'Selesai' },
};

function OrderCard({ order, onBayar, onSelesai }) {
  const st      = STATUS_MAP[order.status] ?? STATUS_MAP.aktif;
  const canPay  = order.status === 'menunggu_bayar';
  const isActive= order.status === 'aktif';
  const isDone  = order.status === 'selesai';

  return (
    <article className={`${styles.card} ${styles[order.status]}`}>

      {/* === HEADER === */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div>
            <p className={styles.mejaBadge}>{order.meja}</p>
            <p className={styles.kasirName}>{order.kasir.split(' ')[0]}</p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`${styles.status} ${styles[order.status]}`}>
          <span className={styles.statusDot} />
          {st.label}
        </span>
      </div>

      {/* === ITEM CHIPS === */}
      <div className={styles.items}>
        {order.items.map((item, i) => (
          <span key={i} className={styles.itemChip}>{item}</span>
        ))}
      </div>

      {/* === FOOTER === */}
      <div className={styles.footer}>
        {/* Meta info */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Clock size={12} strokeWidth={2.5} className={styles.metaIcon} />
            {formatTime(order.waktu)}
          </span>
          {!isDone && (
            <span className={styles.metaItem}>
              <User size={12} strokeWidth={2.5} className={styles.metaIcon} />
              {formatDurasi(order.waktu)}
            </span>
          )}
          <span className={styles.total}>{formatRupiah(order.total)}</span>
        </div>

        {/* Actions */}
        {!isDone && (
          <div className={styles.actions}>
            {isActive && (
              <button
                type      = "button"
                className = {`${styles.actionBtn} ${styles.btnPrimary}`}
                onClick   = {() => onSelesai?.(order.id, 'menunggu_bayar')}
              >
                Tagih
              </button>
            )}
            {canPay && (
              <>
                <button
                  type      = "button"
                  className = {`${styles.actionBtn} ${styles.btnSuccess}`}
                  onClick   = {() => onBayar?.(order.id, 'cash')}
                >
                  <Banknote size={13} strokeWidth={2.5} />
                  Cash
                </button>
                <button
                  type      = "button"
                  className = {`${styles.actionBtn} ${styles.btnPrimary}`}
                  onClick   = {() => onBayar?.(order.id, 'qris')}
                >
                  <QrCode size={13} strokeWidth={2.5} />
                  QRIS
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default OrderCard;
