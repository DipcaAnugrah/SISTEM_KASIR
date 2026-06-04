import { Coffee } from 'lucide-react';
import { TOP_PRODUCTS } from '../../../data/transactions';
import styles from './TopProducts.module.css';

// ============================================================
// TOP PRODUCTS WIDGET — Produk Terlaris Hari Ini
// ============================================================

function TopProducts() {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h2 className={styles.title}>Produk Terlaris</h2>
        <span className={styles.badge}>Hari Ini</span>
      </div>

      <ul className={styles.list}>
        {TOP_PRODUCTS.map((item, idx) => (
          <li key={item.nama} className={styles.item}>
            {/* Rank */}
            <span className={`${styles.rank} ${idx === 0 ? styles.gold : idx === 1 ? styles.silver : idx === 2 ? styles.bronze : ''}`}>
              {idx + 1}
            </span>

            {/* Info */}
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <span className={styles.name}>{item.nama}</span>
                <span className={styles.count}>{item.terjual}×</span>
              </div>
              {/* Progress bar */}
              <div className={styles.progressTrack} role="progressbar" aria-valuenow={item.persen} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className={`${styles.progressBar} ${idx === 0 ? styles.barGold : ''}`}
                  style={{ width: `${item.persen}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopProducts;
