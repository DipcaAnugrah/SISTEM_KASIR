import { formatTime, formatRupiah } from '../../../utils/format';
import { DUMMY_TRANSACTIONS } from '../../../data/transactions';
import styles from './RecentActivity.module.css';

// ============================================================
// RECENT ACTIVITY WIDGET — Log transaksi terbaru
// ============================================================

// Ambil 8 transaksi terakhir (urutkan by waktu desc)
const recent = [...DUMMY_TRANSACTIONS]
  .sort((a, b) => new Date(b.waktu) - new Date(a.waktu))
  .slice(0, 8);

const STATUS_MAP = {
  selesai        : { label: 'Selesai',   cls: 'selesai'  },
  aktif          : { label: 'Aktif',     cls: 'aktif'    },
  menunggu_bayar : { label: 'Menunggu',  cls: 'menunggu' },
};

function RecentActivity() {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h2 className={styles.title}>Aktivitas Terbaru</h2>
        <span className={styles.badge}>{recent.length} transaksi</span>
      </div>

      <ul className={styles.list}>
        {recent.map((trx) => {
          const st = STATUS_MAP[trx.status] ?? STATUS_MAP.selesai;
          return (
            <li key={trx.id} className={styles.item}>
              {/* Dot indicator */}
              <span className={`${styles.dot} ${styles[st.cls]}`} aria-label={st.label} />

              {/* Info */}
              <div className={styles.info}>
                <div className={styles.topRow}>
                  <span className={styles.meja}>{trx.meja}</span>
                  <span className={styles.total}>{formatRupiah(trx.total)}</span>
                </div>
                <div className={styles.bottomRow}>
                  <span className={styles.kasir}>{trx.kasir.split(' ')[0]}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.waktu}>{formatTime(trx.waktu)}</span>
                  <span className={styles.separator}>·</span>
                  <span className={`${styles.status} ${styles[st.cls]}`}>{st.label}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecentActivity;
