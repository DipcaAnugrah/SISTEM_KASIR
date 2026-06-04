import { Clock } from 'lucide-react';
import { ACTIVE_SHIFTS } from '../../../data/transactions';
import { formatRupiah, formatDurasi, formatTime } from '../../../utils/format';
import styles from './ActiveShifts.module.css';

// ============================================================
// ACTIVE SHIFTS WIDGET — Kasir yang sedang bertugas
// ============================================================

function ActiveShifts() {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h2 className={styles.title}>Shift Aktif</h2>
        <span className={styles.badge}>
          <span className={styles.dot} />
          {ACTIVE_SHIFTS.length} kasir
        </span>
      </div>

      <ul className={styles.list}>
        {ACTIVE_SHIFTS.map((shift) => {
          const initials = shift.kasir.split(' ').slice(0, 2).map((n) => n[0]).join('');
          return (
            <li key={shift.id} className={styles.item}>
              {/* Avatar */}
              <div className={styles.avatar}>{initials}</div>

              {/* Info */}
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <span className={styles.name}>{shift.kasir.split(' ')[0]}</span>
                  <span className={styles.total}>{formatRupiah(shift.total)}</span>
                </div>
                <div className={styles.metaRow}>
                  <Clock size={11} strokeWidth={2.5} className={styles.clockIcon} />
                  <span className={styles.meta}>
                    Mulai {formatTime(shift.mulai)} · {formatDurasi(shift.mulai)}
                  </span>
                  <span className={styles.trxBadge}>{shift.trx} trx</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActiveShifts;
