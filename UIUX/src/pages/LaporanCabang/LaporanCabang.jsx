import { useState, useMemo } from 'react';
import { Download, TrendingUp, Receipt, Users, Percent } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import {
  DUMMY_TRANSACTIONS,
  DAILY_SALES,
  MONTHLY_SALES,
  TOP_PRODUCTS,
} from '../../data/transactions';
import { PRODUCTS } from '../../data/products';
import KPICard from '../../components/KPICard/KPICard';
import styles from './LaporanCabang.module.css';

// ============================================================
// LAPORAN CABANG PAGE — Analytics dengan CSS charts
// ============================================================

const PERIODS = [
  { id: 'hari',   label: 'Hari Ini' },
  { id: 'minggu', label: '7 Hari' },
  { id: 'bulan',  label: 'Bulan Ini' },
];

// Data per periode (dummy)
const PERIOD_DATA = {
  hari  : { omzet: 1056000, trx: 22, avgTrx: 48000, konversi: 73 },
  minggu: { omzet: 8245000, trx: 156, avgTrx: 52852, konversi: 68 },
  bulan : { omzet: 31500000, trx: 612, avgTrx: 51470, konversi: 71 },
};

// Transaksi per jam (heatmap data)
const HOURLY = [
  { jam: '07', trx: 4,  pct: 30 },
  { jam: '08', trx: 12, pct: 90 },
  { jam: '09', trx: 11, pct: 82 },
  { jam: '10', trx: 8,  pct: 60 },
  { jam: '11', trx: 9,  pct: 67 },
  { jam: '12', trx: 13, pct: 100 },
  { jam: '13', trx: 10, pct: 75 },
  { jam: '14', trx: 7,  pct: 52 },
  { jam: '15', trx: 5,  pct: 37 },
  { jam: '16', trx: 4,  pct: 30 },
  { jam: '17', trx: 3,  pct: 22 },
  { jam: '18', trx: 2,  pct: 15 },
];

// Metode pembayaran
const PAYMENT_METHODS = [
  { label: 'Tunai (Cash)', color: '#10B981', amount: 634000, pct: 60 },
  { label: 'QRIS',         color: '#2563EB', amount: 317000, pct: 30 },
  { label: 'Transfer',     color: '#F59E0B', amount: 105000, pct: 10 },
];

// Enriched top products with emoji from products data
const ENRICHED_TOP = TOP_PRODUCTS.map((p) => {
  const prod = PRODUCTS.find((pr) => pr.nama === p.nama);
  return { ...p, emoji: prod?.emoji ?? '📦', harga: prod?.harga ?? 0 };
});

// Heatmap color per intensity
function heatColor(pct) {
  if (pct >= 80) return { bg: 'rgba(37,99,235,0.8)',  color: '#fff' };
  if (pct >= 50) return { bg: 'rgba(37,99,235,0.45)', color: 'var(--color-text)' };
  if (pct >= 25) return { bg: 'rgba(37,99,235,0.2)',  color: 'var(--color-text-muted)' };
  return           { bg: 'var(--color-bg-secondary)', color: 'var(--color-text-disabled)' };
}

// ============================================================

function LaporanCabang() {
  const [period, setPeriod] = useState('hari');

  const kpi   = PERIOD_DATA[period];
  const chart = period === 'bulan' ? MONTHLY_SALES : DAILY_SALES;
  const maxVal = Math.max(...chart.map((d) => d.value));

  // Donut chart: conic-gradient
  const donutStyle = useMemo(() => {
    const p = PAYMENT_METHODS;
    return {
      background: `conic-gradient(
        ${p[0].color} 0% ${p[0].pct}%,
        ${p[1].color} ${p[0].pct}% ${p[0].pct + p[1].pct}%,
        ${p[2].color} ${p[0].pct + p[1].pct}% 100%
      )`,
    };
  }, []);

  return (
    <div className="page-enter">

      {/* === TOOLBAR === */}
      <div className={styles.toolbar}>
        {/* Period selector */}
        <div className={styles.periodTabs} role="group" aria-label="Pilih periode laporan">
          {PERIODS.map((p) => (
            <button
              key       = {p.id}
              type      = "button"
              id        = {`period-${p.id}`}
              className = {`${styles.periodBtn} ${period === p.id ? styles.active : ''}`}
              onClick   = {() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button type="button" className={styles.exportBtn} id="btn-export-laporan">
          <Download size={14} strokeWidth={2.5} />
          <span>Export PDF</span>
        </button>
      </div>

      {/* === KPI CARDS === */}
      <div className={styles.kpiGrid}>
        <KPICard icon={TrendingUp}  label="Total Omzet"       value={formatRupiah(kpi.omzet)}             color="primary" trend={8}  />
        <KPICard icon={Receipt}     label="Total Transaksi"    value={kpi.trx}   suffix=" trx"             color="success" trend={5}  />
        <KPICard icon={Users}       label="Rata-rata Transaksi"value={formatRupiah(kpi.avgTrx)}            color="warning" trend={-2} />
        <KPICard icon={Percent}     label="Konversi Pelanggan" value={kpi.konversi} suffix="%"             color="info"    trend={3}  />
      </div>

      {/* === MAIN GRID: Chart + Donut === */}
      <div className={styles.mainGrid}>

        {/* Revenue Bar Chart */}
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <h2 className={styles.widgetTitle}>
              {period === 'bulan' ? 'Tren Omzet 12 Bulan' : 'Tren Penjualan 7 Hari'}
            </h2>
            <span className={styles.widgetMeta}>Cabang Utama · Menteng</span>
          </div>

          <div className={styles.chartArea} role="img" aria-label="Grafik penjualan">
            {chart.map((d, i) => {
              const isToday = i === chart.length - 1;
              const h       = Math.max(4, Math.round((d.value / maxVal) * 100));
              return (
                <div key={i} className={styles.bar}>
                  <div className={styles.barTrack}>
                    <div
                      className = {`${styles.barFill} ${isToday ? styles.today : ''}`}
                      style     = {{ height: `${h}%` }}
                      data-value= {formatRupiah(d.value, true)}
                      title     = {`${d.label}: ${formatRupiah(d.value)}`}
                    />
                  </div>
                  <span className={styles.barLabel}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Donut */}
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <h2 className={styles.widgetTitle}>Metode Pembayaran</h2>
          </div>

          <div className={styles.donutWrap}>
            {/* Donut ring */}
            <div style={{ position: 'relative' }}>
              <div
                className = {styles.donut}
                style     = {donutStyle}
                role      = "img"
                aria-label= "Donut chart metode pembayaran"
              />
              {/* Inner white circle */}
              <div style={{
                position     : 'absolute',
                inset        : '22px',
                borderRadius : '50%',
                background   : 'var(--color-card)',
                display      : 'flex',
                flexDirection: 'column',
                alignItems   : 'center',
                justifyContent: 'center',
              }}>
                <span className={styles.donutTotal}>{formatRupiah(kpi.omzet, true)}</span>
                <span className={styles.donutSub}>Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className={styles.donutLegend}>
              {PAYMENT_METHODS.map((m) => (
                <div key={m.label} className={styles.donutLegendItem}>
                  <div className={styles.donutLegendLeft}>
                    <span className={styles.donutLegendDot} style={{ background: m.color }} />
                    <span className={styles.donutLegendLabel}>{m.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className={styles.donutLegendVal}>{formatRupiah(m.amount, true)}</span>
                    <span className={styles.donutLegendPct}>{m.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === BOTTOM GRID: Heatmap + Top Products === */}
      <div className={styles.bottomGrid}>

        {/* Hourly Heatmap */}
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <h2 className={styles.widgetTitle}>Transaksi per Jam</h2>
            <span className={styles.widgetMeta}>Puncak: 12.00 WIB</span>
          </div>

          <div className={styles.heatmap} role="img" aria-label="Heatmap transaksi per jam">
            {HOURLY.map((h) => {
              const { bg, color } = heatColor(h.pct);
              return (
                <div
                  key       = {h.jam}
                  className = {styles.heatCell}
                  style     = {{ background: bg, color }}
                  title     = {`Jam ${h.jam}: ${h.trx} transaksi`}
                  aria-label= {`Jam ${h.jam}: ${h.trx} transaksi`}
                >
                  <span>{h.trx}</span>
                  <span className={styles.heatCellTime}>{h.jam}:00</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <h2 className={styles.widgetTitle}>Produk Terlaris</h2>
            <span className={styles.widgetMeta}>Top 5 Hari Ini</span>
          </div>

          <div className={styles.prodTable}>
            {ENRICHED_TOP.map((p, i) => {
              const rankCls = [styles.rank1, styles.rank2, styles.rank3, styles.rankOther, styles.rankOther];
              return (
                <div key={p.nama} className={styles.prodRow}>
                  <span className={`${styles.prodRank} ${rankCls[i]}`}>{i + 1}</span>
                  <span className={styles.prodEmoji}>{p.emoji}</span>
                  <span className={styles.prodNama}>{p.nama}</span>
                  <span className={styles.prodTerjual}>{p.terjual}×</span>
                  <span className={styles.prodTotal}>{formatRupiah(p.harga * p.terjual, true)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaporanCabang;
