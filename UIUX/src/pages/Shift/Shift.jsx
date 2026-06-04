import { useState } from 'react';
import { Clock, Banknote, QrCode, Receipt, LogIn, LogOut, History } from 'lucide-react';
import { useAuth }   from '../../hooks/useAuth';
import { useShift }  from '../../hooks/useShift';
import { useUI }     from '../../hooks/useUI';
import { formatRupiah, formatTime, formatTanggal, formatDurasi } from '../../utils/format';
import Modal from '../../components/Modal/Modal';
import styles from './Shift.module.css';

// ============================================================
// SHIFT KASIR PAGE — Warkop Djoeragan POS
// ============================================================

function Shift() {
  const { user }  = useAuth();
  const { toast } = useUI();
  const {
    isOpen, kasir, modalAwal, waktuMulai,
    totalCash, totalQRIS, totalBersih, jumlahTrx,
    riwayat, openShift, closeShift,
  } = useShift();

  const [showOpenForm, setShowOpenForm]       = useState(false);
  const [showCloseModal, setShowCloseModal]   = useState(false);
  const [modalInput, setModalInput]           = useState('');

  const handleOpenShift = (e) => {
    e.preventDefault();
    if (!modalInput || Number(modalInput) <= 0) {
      toast.error('Modal awal harus lebih dari 0');
      return;
    }
    openShift(user?.nama ?? 'Kasir', modalInput);
    setModalInput('');
    setShowOpenForm(false);
    toast.success('Shift berhasil dibuka!');
  };

  const handleCloseShift = () => {
    closeShift();
    setShowCloseModal(false);
    toast.success('Shift berhasil ditutup. Laporan shift telah disimpan.');
  };

  // === SHIFT AKTIF VIEW ===
  if (isOpen) {
    return (
      <div className="page-enter">
        <div className={styles.shiftLayout}>

          {/* === MAIN SHIFT CARD === */}
          <div className={styles.shiftCard}>
            <div className={styles.shiftHeader}>
              <div>
                <h2 className={styles.shiftTitle}>Shift Berjalan</h2>
                <p className={styles.shiftSubtitle}>
                  Kasir: <strong>{kasir}</strong> · Mulai {formatTime(waktuMulai)}
                </p>
              </div>
              <div className={styles.shiftStatusPill}>
                <span className={styles.shiftDot} />
                Aktif · {formatDurasi(waktuMulai)}
              </div>
            </div>

            {/* Stats */}
            <div className={styles.shiftStats}>
              <div className={styles.shiftStat}>
                <p className={styles.shiftStatLabel}>Total Pendapatan</p>
                <p className={`${styles.shiftStatValue} ${styles.highlight}`}>
                  {formatRupiah(totalBersih)}
                </p>
              </div>
              <div className={styles.shiftStat}>
                <p className={styles.shiftStatLabel}>Total Transaksi</p>
                <p className={styles.shiftStatValue}>{jumlahTrx} trx</p>
              </div>
              <div className={styles.shiftStat}>
                <p className={styles.shiftStatLabel}>Modal Awal</p>
                <p className={styles.shiftStatValue}>{formatRupiah(modalAwal)}</p>
              </div>
              <div className={styles.shiftStat}>
                <p className={styles.shiftStatLabel}>Laci Kas (estimasi)</p>
                <p className={`${styles.shiftStatValue} ${styles.highlight}`}>
                  {formatRupiah(modalAwal + totalCash)}
                </p>
              </div>
            </div>

            {/* Breakdown metode pembayaran */}
            <div className={styles.breakdown}>
              <p className={styles.breakdownTitle}>RINCIAN PEMBAYARAN</p>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>
                  <Banknote size={13} strokeWidth={2} style={{ display:'inline', marginRight: 6 }} />
                  Tunai (Cash)
                </span>
                <span className={styles.breakdownValue}>{formatRupiah(totalCash)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>
                  <QrCode size={13} strokeWidth={2} style={{ display:'inline', marginRight: 6 }} />
                  QRIS / Non-Tunai
                </span>
                <span className={styles.breakdownValue}>{formatRupiah(totalQRIS)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>
                  <Receipt size={13} strokeWidth={2} style={{ display:'inline', marginRight: 6 }} />
                  Total Bersih
                </span>
                <span className={`${styles.breakdownValue} ${styles.highlight}`}>
                  {formatRupiah(totalBersih)}
                </span>
              </div>
            </div>

            {/* Close shift button */}
            <button
              id        = "btn-close-shift"
              type      = "button"
              className = {styles.closeShiftBtn}
              onClick   = {() => setShowCloseModal(true)}
            >
              <LogOut size={18} strokeWidth={2} />
              Tutup Shift
            </button>
          </div>

          {/* === SIDE PANEL: Riwayat === */}
          <div className={styles.sidePanel}>
            <div className={styles.riwayat}>
              <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 16 }}>
                <History size={16} strokeWidth={2} style={{ color:'var(--color-text-muted)' }} />
                <p className={styles.riwayatTitle}>Riwayat Shift</p>
              </div>
              {riwayat.length === 0 ? (
                <p className={styles.riwayatEmpty}>Belum ada riwayat shift</p>
              ) : (
                riwayat.map((s) => (
                  <div key={s.shiftId} className={styles.riwayatItem}>
                    <p className={styles.riwayatKasir}>{s.kasir}</p>
                    <div className={styles.riwayatMeta}>
                      <span className={styles.riwayatTime}>
                        {formatTime(s.waktuMulai)} – {formatTime(s.waktuTutup)}
                      </span>
                      <span className={styles.riwayatTotal}>
                        {formatRupiah(s.totalBersih)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* === CLOSE SHIFT MODAL === */}
        <Modal isOpen={showCloseModal} onClose={() => setShowCloseModal(false)} title="Tutup Shift" size="sm">
          <div style={{ display:'flex', flexDirection:'column', gap: 20 }}>
            <div style={{ background:'var(--color-bg)', borderRadius:'var(--radius-md)', padding:20, border:'1px solid var(--color-border)' }}>
              <p style={{ fontSize:12, color:'var(--color-text-muted)', marginBottom: 8 }}>RINGKASAN SHIFT</p>
              {[
                { label: 'Kasir',          value: kasir },
                { label: 'Durasi Shift',   value: formatDurasi(waktuMulai) },
                { label: 'Total Transaksi',value: `${jumlahTrx} trx` },
                { label: 'Pendapatan Cash',value: formatRupiah(totalCash) },
                { label: 'Pendapatan QRIS',value: formatRupiah(totalQRIS) },
                { label: 'Total Bersih',   value: formatRupiah(totalBersih) },
              ].map((row) => (
                <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--color-border)', fontSize: 13 }}>
                  <span style={{ color:'var(--color-text-muted)' }}>{row.label}</span>
                  <strong style={{ color:'var(--color-text)' }}>{row.value}</strong>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color:'var(--color-text-muted)', textAlign:'center' }}>
              Apakah Anda yakin ingin menutup shift ini?
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
              <button
                type="button"
                style={{ padding:'11px', borderRadius:'var(--radius-md)', border:'1px solid var(--color-border)', fontSize:14, fontWeight:600, color:'var(--color-text-muted)' }}
                onClick={() => setShowCloseModal(false)}
              >
                Batal
              </button>
              <button
                id="btn-confirm-close-shift"
                type="button"
                style={{ padding:'11px', borderRadius:'var(--radius-md)', background:'linear-gradient(135deg,#EF4444,#DC2626)', color:'#fff', fontSize:14, fontWeight:700 }}
                onClick={handleCloseShift}
              >
                Ya, Tutup Shift
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // === NO ACTIVE SHIFT VIEW ===
  return (
    <div className="page-enter">
      <div className={styles.shiftLayout}>

        {/* === NO SHIFT STATE === */}
        <div className={styles.shiftCard}>
          <div className={styles.noShift}>
            <div className={styles.noShiftIcon}>
              <Clock size={36} strokeWidth={1.5} />
            </div>
            <h2 className={styles.noShiftTitle}>Tidak Ada Shift Aktif</h2>
            <p className={styles.noShiftSub}>
              Buka shift baru untuk mulai mencatat transaksi kasir hari ini.
            </p>
            <button
              id        = "btn-open-shift"
              type      = "button"
              className = {styles.openShiftBtn}
              onClick   = {() => setShowOpenForm(true)}
            >
              <LogIn size={18} strokeWidth={2} />
              Buka Shift Baru
            </button>
          </div>
        </div>

        {/* === SIDE: Form + Riwayat === */}
        <div className={styles.sidePanel}>

          {/* Form buka shift */}
          {showOpenForm && (
            <form className={styles.form} onSubmit={handleOpenShift}>
              <p className={styles.formTitle}>Buka Shift Baru</p>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="shift-kasir">Nama Kasir</label>
                <input
                  id          = "shift-kasir"
                  type        = "text"
                  className   = {styles.fieldInput}
                  defaultValue= {user?.nama ?? ''}
                  readOnly
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="shift-modal">Modal Awal (Rp)</label>
                <input
                  id          = "shift-modal"
                  type        = "text"
                  inputMode   = "numeric"
                  className   = {styles.fieldInput}
                  value       = {modalInput ? Number(modalInput).toLocaleString('id-ID') : ''}
                  onChange    = {(e) => setModalInput(e.target.value.replace(/\D/g, ''))}
                  placeholder = "Masukkan modal awal (misal: 500000)"
                  autoFocus
                />
              </div>

              <button
                type      = "submit"
                className = {styles.submitBtn}
                disabled  = {!modalInput || Number(modalInput) <= 0}
              >
                <LogIn size={16} strokeWidth={2} />
                Buka Shift
              </button>
            </form>
          )}

          {/* Riwayat */}
          <div className={styles.riwayat}>
            <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 16 }}>
              <History size={16} strokeWidth={2} style={{ color:'var(--color-text-muted)' }} />
              <p className={styles.riwayatTitle}>Riwayat Shift</p>
            </div>
            {riwayat.length === 0 ? (
              <p className={styles.riwayatEmpty}>Belum ada riwayat shift hari ini</p>
            ) : (
              riwayat.map((s) => (
                <div key={s.shiftId} className={styles.riwayatItem}>
                  <p className={styles.riwayatKasir}>{s.kasir}</p>
                  <div className={styles.riwayatMeta}>
                    <span className={styles.riwayatTime}>
                      {formatTime(s.waktuMulai)} – {formatTime(s.waktuTutup)}
                    </span>
                    <span className={styles.riwayatTotal}>
                      {formatRupiah(s.totalBersih)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shift;
