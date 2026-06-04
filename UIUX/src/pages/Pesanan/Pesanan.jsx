import { useState, useMemo } from 'react';
import { ShoppingBag, Activity, AlertCircle, CheckCircle2, RefreshCw, PackageSearch } from 'lucide-react';
import { useUI } from '../../hooks/useUI';
import { DUMMY_TRANSACTIONS } from '../../data/transactions';
import OrderCard from './components/OrderCard';
import styles from './Pesanan.module.css';

// ============================================================
// PESANAN BERJALAN PAGE — Warkop Djoeragan POS
// ============================================================

const TABS = [
  { id: 'semua',         label: 'Semua',            icon: ShoppingBag  },
  { id: 'aktif',         label: 'Aktif',             icon: Activity     },
  { id: 'menunggu_bayar',label: 'Menunggu Bayar',    icon: AlertCircle  },
  { id: 'selesai',       label: 'Selesai',           icon: CheckCircle2 },
];

function Pesanan() {
  const { toast } = useUI();

  // Local state: order list bisa diupdate (simulasi real-time)
  const [orders, setOrders] = useState(
    [...DUMMY_TRANSACTIONS].sort((a, b) => new Date(b.waktu) - new Date(a.waktu))
  );
  const [activeTab, setActiveTab] = useState('semua');

  // === Filter orders berdasarkan tab ===
  const filtered = useMemo(() =>
    activeTab === 'semua'
      ? orders
      : orders.filter((o) => o.status === activeTab),
    [orders, activeTab]
  );

  // === Count per status ===
  const counts = useMemo(() => ({
    semua        : orders.length,
    aktif        : orders.filter((o) => o.status === 'aktif').length,
    menunggu_bayar: orders.filter((o) => o.status === 'menunggu_bayar').length,
    selesai      : orders.filter((o) => o.status === 'selesai').length,
  }), [orders]);

  // === Handler: ubah status → menunggu_bayar (Tagih) ===
  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => o.id === id ? { ...o, status: newStatus } : o)
    );
    if (newStatus === 'menunggu_bayar') {
      toast.info('Pesanan siap ditagih');
    }
  };

  // === Handler: bayar → selesai ===
  const handleBayar = (id, metode) => {
    setOrders((prev) =>
      prev.map((o) => o.id === id ? { ...o, status: 'selesai' } : o)
    );
    toast.success(`Pembayaran ${metode.toUpperCase()} berhasil!`);
  };

  // === Refresh (simulasi) ===
  const handleRefresh = () => {
    toast.info('Memperbarui daftar pesanan...');
  };

  return (
    <div className="page-enter">

      {/* === STATS BAR === */}
      <div className={styles.statsBar}>
        {[
          { id: 'all',    label: 'Total Pesanan',    value: counts.semua,         icon: ShoppingBag,  cls: 'all'     },
          { id: 'aktif',  label: 'Sedang Berjalan',  value: counts.aktif,         icon: Activity,     cls: 'aktif'   },
          { id: 'bayar',  label: 'Menunggu Bayar',   value: counts.menunggu_bayar,icon: AlertCircle,  cls: 'bayar'   },
          { id: 'done',   label: 'Selesai Hari Ini', value: counts.selesai,       icon: CheckCircle2, cls: 'selesai' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className={styles.statCard}>
              <div className={`${styles.statIconWrap} ${styles[s.cls]}`}>
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* === FILTER TABS + REFRESH === */}
      <div className={styles.filterRow}>
        <div className={styles.tabs} role="tablist">
          {TABS.map((tab) => (
            <button
              key        = {tab.id}
              type       = "button"
              role       = "tab"
              id         = {`tab-pesanan-${tab.id}`}
              className  = {`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick    = {() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
              {counts[tab.id] > 0 && tab.id !== 'semua' && (
                <span className={styles.tabCount}>{counts[tab.id]}</span>
              )}
            </button>
          ))}
        </div>

        <button
          type      = "button"
          className = {styles.refreshBtn}
          onClick   = {handleRefresh}
          aria-label= "Perbarui daftar pesanan"
        >
          <RefreshCw size={14} strokeWidth={2.5} />
          <span>Refresh</span>
        </button>
      </div>

      {/* === ORDER GRID === */}
      <div className={styles.grid}>
        {filtered.length > 0 ? (
          filtered.map((order) => (
            <OrderCard
              key       = {order.id}
              order     = {order}
              onBayar   = {handleBayar}
              onSelesai = {handleStatusChange}
            />
          ))
        ) : (
          <div className={styles.empty}>
            <PackageSearch size={48} strokeWidth={1.2} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Tidak ada pesanan</p>
            <p className={styles.emptySub}>Belum ada pesanan dengan status ini</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pesanan;
