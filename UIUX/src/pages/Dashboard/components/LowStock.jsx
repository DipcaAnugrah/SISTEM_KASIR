import { AlertTriangle } from 'lucide-react';
import { LOW_STOCK } from '../../../data/transactions';
import styles from './LowStock.module.css';

// ============================================================
// LOW STOCK WIDGET — Produk stok menipis
// ============================================================

function LowStock() {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <AlertTriangle size={16} strokeWidth={2.5} className={styles.warnIcon} />
          <h2 className={styles.title}>Stok Menipis</h2>
        </div>
        <span className={`${styles.badge} ${styles.badgeWarn}`}>{LOW_STOCK.length} item</span>
      </div>

      <ul className={styles.list}>
        {LOW_STOCK.map((item) => {
          const persen = Math.round((item.stok / item.threshold) * 100);
          const level  = persen <= 33 ? 'danger' : 'warning';
          return (
            <li key={item.nama} className={styles.item}>
              {/* Warning dot */}
              <span className={`${styles.dot} ${styles[level]}`} />

              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <span className={styles.name}>{item.nama}</span>
                  <span className={`${styles.stokBadge} ${styles[level]}`}>
                    {item.stok} {item.satuan}
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className={styles.track}>
                  <div
                    className={`${styles.fill} ${styles[level]}`}
                    style={{ width: `${persen}%` }}
                  />
                </div>
                <p className={styles.threshold}>
                  Batas minimum: {item.threshold} {item.satuan}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LowStock;
