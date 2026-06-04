import {
  Banknote,
  CalendarDays,
  Receipt,
  Clock,
  CalendarCheck,
} from 'lucide-react';

import { useAuth }          from '../../hooks/useAuth';
import { formatRupiah, formatTanggal } from '../../utils/format';
import { KPI }              from '../../data/transactions';

import KPICard              from '../../components/KPICard/KPICard';
import SalesTrendChart      from './components/SalesTrendChart';
import MonthlyChart         from './components/MonthlyChart';
import TopProducts          from './components/TopProducts';
import RecentActivity       from './components/RecentActivity';
import LowStock             from './components/LowStock';
import ActiveShifts         from './components/ActiveShifts';

import styles from './Dashboard.module.css';

// ============================================================
// DASHBOARD PAGE — Warkop Djoeragan POS
// ============================================================

function Dashboard() {
  const { user } = useAuth();

  const now    = new Date();
  const hour   = now.getHours();
  const salam  = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 19 ? 'Selamat sore' : 'Selamat malam';
  const nama   = user?.nama?.split(' ')[0] ?? 'Pengguna';
  const tanggal= formatTanggal(now.toISOString(), true);

  return (
    <div className="page-enter">

      {/* === PAGE TOP: Greeting + Date === */}
      <div className={styles.pageTop}>
        <div>
          <h1 className={styles.greeting}>{salam}, {nama} 👋</h1>
          <p className={styles.greetingSub}>
            Berikut ringkasan operasional hari ini.
          </p>
        </div>
        <div className={styles.dateChip}>
          <CalendarCheck size={14} strokeWidth={2} />
          <span>{tanggal}</span>
        </div>
      </div>

      {/* === KPI CARDS === */}
      <div className={styles.kpiGrid}>
        <KPICard
          icon    = {Banknote}
          label   = "Omzet Hari Ini"
          value   = {formatRupiah(KPI.omzetHariIni)}
          trend   = {12}
          color   = "primary"
        />
        <KPICard
          icon    = {CalendarDays}
          label   = "Omzet Bulan Ini"
          value   = {formatRupiah(KPI.omzetBulanIni)}
          trend   = {8}
          color   = "success"
        />
        <KPICard
          icon    = {Receipt}
          label   = "Total Transaksi"
          value   = {KPI.totalTransaksi}
          suffix  = " transaksi"
          trend   = {5}
          color   = "warning"
        />
        <KPICard
          icon    = {Clock}
          label   = "Shift Aktif"
          value   = {KPI.shiftAktif}
          suffix  = " kasir"
          color   = "info"
        />
      </div>

      {/* === MAIN GRID: Charts + Top Products === */}
      <div className={styles.mainGrid}>
        {/* Chart stack (kiri) */}
        <div className={styles.chartStack}>
          <SalesTrendChart />
          <MonthlyChart />
        </div>

        {/* Top Products (kanan) */}
        <TopProducts />
      </div>

      {/* === BOTTOM GRID: LowStock + RecentActivity + ActiveShifts === */}
      <div className={styles.bottomGrid}>
        <LowStock />
        <RecentActivity />
        <ActiveShifts />
      </div>

    </div>
  );
}

export default Dashboard;
