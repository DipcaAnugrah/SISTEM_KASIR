import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Users, Receipt, MapPin } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { DUMMY_CABANG } from '../../data/cabang';
import styles from './LaporanKonsolidasi.module.css';

// ============================================================
// LAPORAN KONSOLIDASI — Multi-branch performance comparison
// ============================================================

const PERIODS = [
  { id: 'minggu', label: '7 Hari'   },
  { id: 'bulan',  label: 'Bulan Ini'},
  { id: 'tahun',  label: 'Tahun Ini'},
];

// Data dummy per periode
const PERIOD_DATA = {
  minggu: {
    total       : 8245000,
    trx         : 156,
    prevTotal   : 7200000,
    prevTrx     : 140,
  },
  bulan: {
    total       : 85200000,
    trx         : 1633,
    prevTotal   : 78500000,
    prevTrx     : 1520,
  },
  tahun: {
    total       : 980000000,
    trx         : 18900,
    prevTotal   : 850000000,
    prevTrx     : 16800,
  },
};

// Omzet per periode per cabang (multiplicator sederhana)
const MULTIPLIER = { minggu: 1, bulan: 10, tahun: 120 };

function LaporanKonsolidasi() {
  const [period, setPeriod] = useState('bulan');

  const p    = PERIOD_DATA[period];
  const m    = MULTIPLIER[period];
  const trnd = ((p.total - p.prevTotal) / p.prevTotal * 100).toFixed(1);
  const isUp = p.total > p.prevTotal;

  const cabangWithData = useMemo(() =>
    DUMMY_CABANG
      .filter((c) => c.status === 'aktif')
      .map((c) => ({
        ...c,
        omzet: c.omzetBulan * m,
        trx  : c.totalTrx   * m,
      }))
      .sort((a, b) => b.omzet - a.omzet),
    [m]
  );

  const maxOmzet = Math.max(...cabangWithData.map((c) => c.omzet), 1);
  const totalOmzet = cabangWithData.reduce((a, c) => a + c.omzet, 0);

  return (
    <div className="page-enter">

      {/* Period selector */}
      <div className={styles.toolbar}>
        <div className={styles.periodTabs} role="group">
          {PERIODS.map((pr) => (
            <button
              key       = {pr.id}
              type      = "button"
              id        = {`period-konsol-${pr.id}`}
              className = {`${styles.periodBtn} ${period === pr.id ? styles.active : ''}`}
              onClick   = {() => setPeriod(pr.id)}
            >
              {pr.label}
            </button>
          ))}
        </div>
        <p className={styles.toolbarSub}>
          Konsolidasi {DUMMY_CABANG.filter(c => c.status === 'aktif').length} cabang aktif
        </p>
      </div>

      {/* KPI summary */}
      <div className={styles.kpiGrid}>
        {[
          {
            label : 'Total Omzet Semua Cabang',
            value : formatRupiah(p.total),
            icon  : BarChart2,
            color : 'primary',
            trend : trnd,
            isUp,
          },
          {
            label : 'Total Transaksi',
            value : `${p.trx.toLocaleString('id-ID')} trx`,
            icon  : Receipt,
            color : 'success',
            trend : ((p.trx - p.prevTrx) / p.prevTrx * 100).toFixed(1),
            isUp  : p.trx > p.prevTrx,
          },
          {
            label : 'Cabang Aktif',
            value : `${DUMMY_CABANG.filter(c => c.status === 'aktif').length} cabang`,
            icon  : MapPin,
            color : 'warning',
            trend : null,
          },
          {
            label : 'Total Kasir',
            value : `${DUMMY_CABANG.reduce((a,c) => a + c.jumlahKasir, 0)} orang`,
            icon  : Users,
            color : 'info',
            trend : null,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          const colorMap = {
            primary: { bg:'var(--color-primary-light)', color:'var(--color-primary)' },
            success: { bg:'var(--color-success-light)', color:'var(--color-success)' },
            warning: { bg:'var(--color-warning-light)', color:'var(--color-warning)' },
            info   : { bg:'var(--color-info-light)',    color:'var(--color-info)'    },
          };
          const col = colorMap[kpi.color];
          return (
            <div key={kpi.label} className={styles.kpiCard}>
              <div className={styles.kpiIconWrap} style={{ background: col.bg, color: col.color }}>
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <div className={styles.kpiBody}>
                <p className={styles.kpiLabel}>{kpi.label}</p>
                <p className={styles.kpiValue}>{kpi.value}</p>
                {kpi.trend !== null && (
                  <div className={`${styles.kpiTrend} ${kpi.isUp ? styles.up : styles.down}`}>
                    {kpi.isUp ? <TrendingUp size={12} strokeWidth={2.5} /> : <TrendingDown size={12} strokeWidth={2.5} />}
                    <span>{kpi.isUp ? '+' : ''}{kpi.trend}%</span>
                    <span className={styles.trendSub}>vs periode lalu</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Grid */}
      <div className={styles.mainGrid}>

        {/* Bar comparison */}
        <div className={styles.widget}>
          <h2 className={styles.widgetTitle}>Perbandingan Omzet per Cabang</h2>
          <div className={styles.compBars}>
            {cabangWithData.map((c, i) => {
              const pct  = Math.round((c.omzet / maxOmzet) * 100);
              const share= Math.round((c.omzet / totalOmzet) * 100);
              const COLORS = ['#2563EB','#10B981','#F59E0B','#8B5CF6'];
              return (
                <div key={c.id} className={styles.compRow}>
                  <div className={styles.compLabel}>
                    <span className={styles.compRank}>{i+1}</span>
                    <span className={styles.compNama}>{c.nama}</span>
                  </div>
                  <div className={styles.compBarTrack}>
                    <div
                      className={styles.compBarFill}
                      style={{ width:`${pct}%`, background: COLORS[i % COLORS.length] }}
                      title={formatRupiah(c.omzet)}
                    />
                  </div>
                  <div className={styles.compRight}>
                    <span className={styles.compOmzet}>{formatRupiah(c.omzet, true)}</span>
                    <span className={styles.compShare}>{share}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cabang detail cards */}
        <div className={styles.widget}>
          <h2 className={styles.widgetTitle}>Detail per Cabang</h2>
          <div className={styles.cabangCards}>
            {cabangWithData.map((c, i) => {
              const RANK_COLORS = ['#F59E0B','#9CA3AF','#CD7C32','#6B7280'];
              return (
                <div key={c.id} className={styles.cabangMini}>
                  <div className={styles.cabangMiniRank} style={{ color: RANK_COLORS[i] }}>#{i+1}</div>
                  <div className={styles.cabangMiniInfo}>
                    <p className={styles.cabangMiniNama}>{c.nama}</p>
                    <p className={styles.cabangMiniLokasi}>{c.lokasi}</p>
                  </div>
                  <div className={styles.cabangMiniStats}>
                    <span className={styles.cabangMiniOmzet}>{formatRupiah(c.omzet, true)}</span>
                    <span className={styles.cabangMiniTrx}>{c.trx} trx</span>
                  </div>
                </div>
              );
            })}
            {DUMMY_CABANG.filter(c => c.status === 'tutup').map((c) => (
              <div key={c.id} className={`${styles.cabangMini} ${styles.cabangMiniTutup}`}>
                <div className={styles.cabangMiniRank} style={{ color:'var(--color-text-disabled)' }}>—</div>
                <div className={styles.cabangMiniInfo}>
                  <p className={styles.cabangMiniNama}>{c.nama}</p>
                  <p className={styles.cabangMiniLokasi}>{c.lokasi}</p>
                </div>
                <span style={{ fontSize:11, padding:'2px 8px', background:'var(--color-danger-light)', color:'var(--color-danger-dark)', borderRadius:'var(--radius-full)', fontWeight:600 }}>
                  Tutup
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaporanKonsolidasi;
