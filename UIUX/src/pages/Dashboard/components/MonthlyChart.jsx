import { formatRupiah } from '../../../utils/format';
import { MONTHLY_SALES } from '../../../data/transactions';
import styles from './SalesTrendChart.module.css';

// ============================================================
// MONTHLY CHART — 12 Bulan (reuse SalesTrendChart styles)
// ============================================================

function MonthlyChart() {
  const max = Math.max(...MONTHLY_SALES.map((d) => d.value));

  const yLabels = [max, max * 0.67, max * 0.33, 0].map((v) =>
    v === 0 ? '0' : formatRupiah(v, true)
  );

  const currentMonth = new Date().getMonth(); // 0-indexed
  const totalTahun   = MONTHLY_SALES.reduce((s, d) => s + d.value, 0);

  return (
    <div className={styles.widget}>
      {/* === HEADER === */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Penjualan Bulanan</h2>
          <p className={styles.subtitle}>Januari – Desember {new Date().getFullYear()}</p>
        </div>
        <span className={styles.totalBadge}>
          YTD: {formatRupiah(totalTahun, true)}
        </span>
      </div>

      {/* === CHART === */}
      <div className={styles.chartWrap}>
        {/* Y-axis */}
        <div className={styles.yAxis}>
          {yLabels.map((l, i) => (
            <span key={i} className={styles.yLabel}>{l}</span>
          ))}
        </div>

        {/* Bars */}
        <div className={styles.chartArea} style={{ flex: 1 }}>
          <div className={styles.gridLines} aria-hidden="true">
            {[0, 1, 2, 3].map((i) => <div key={i} className={styles.gridLine} />)}
          </div>

          {MONTHLY_SALES.map((month, idx) => {
            const isCurrent = idx === currentMonth;
            const heightPct = Math.max((month.value / max) * 100, 3);
            return (
              <div key={month.label} className={styles.barGroup}>
                <div className={styles.barWrap}>
                  <span className={styles.tooltip}>
                    {month.label}: {formatRupiah(month.value)}
                  </span>
                  <div
                    className={`${styles.bar} ${isCurrent ? styles.today : ''}`}
                    style={{ height: `${heightPct}%` }}
                    role="img"
                    aria-label={`${month.label}: ${formatRupiah(month.value)}`}
                  />
                </div>
                <span className={`${styles.barLabel} ${isCurrent ? styles.today : ''}`}>
                  {month.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MonthlyChart;
