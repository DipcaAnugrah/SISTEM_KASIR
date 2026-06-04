import { formatRupiah } from '../../../utils/format';
import { DAILY_SALES }  from '../../../data/transactions';
import styles from './SalesTrendChart.module.css';

// ============================================================
// SALES TREND CHART — 7 Hari Terakhir (pure CSS bar chart)
// ============================================================

function SalesTrendChart() {
  const max = Math.max(...DAILY_SALES.map((d) => d.value));

  // Y-axis labels (4 level: 0, 33%, 67%, 100%)
  const yLabels = [max, max * 0.67, max * 0.33, 0].map((v) =>
    v === 0 ? '0' : formatRupiah(v, true)
  );

  const totalMinggu = DAILY_SALES.reduce((s, d) => s + d.value, 0);

  return (
    <div className={styles.widget}>
      {/* === HEADER === */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Penjualan Harian</h2>
          <p className={styles.subtitle}>7 hari terakhir</p>
        </div>
        <span className={styles.totalBadge}>
          Total: {formatRupiah(totalMinggu, true)}
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
          {/* Grid lines overlay */}
          <div className={styles.gridLines} aria-hidden="true">
            {[0, 1, 2, 3].map((i) => <div key={i} className={styles.gridLine} />)}
          </div>

          {DAILY_SALES.map((day, idx) => {
            const isToday   = idx === DAILY_SALES.length - 1;
            const heightPct = Math.max((day.value / max) * 100, 3);
            return (
              <div key={day.label} className={styles.barGroup}>
                <div className={styles.barWrap}>
                  {/* Tooltip */}
                  <span className={styles.tooltip}>
                    {formatRupiah(day.value)}
                  </span>
                  {/* Bar */}
                  <div
                    className={`${styles.bar} ${isToday ? styles.today : ''}`}
                    style={{ height: `${heightPct}%` }}
                    role="img"
                    aria-label={`${day.label}: ${formatRupiah(day.value)}`}
                  />
                </div>
                <span className={`${styles.barLabel} ${isToday ? styles.today : ''}`}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SalesTrendChart;
