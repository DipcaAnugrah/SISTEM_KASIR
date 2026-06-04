import { useState } from 'react';
import { Settings, Save, Store, Percent, CreditCard, Bell, Check } from 'lucide-react';
import { useUI } from '../../hooks/useUI';
import styles from './PengaturanSistem.module.css';

// ============================================================
// PENGATURAN SISTEM — Tabs: Umum | Pajak | Metode Bayar | Notifikasi
// ============================================================

const TABS = [
  { id: 'umum',   label: 'Umum',         icon: Store       },
  { id: 'pajak',  label: 'Pajak & Biaya', icon: Percent     },
  { id: 'bayar',  label: 'Metode Bayar',  icon: CreditCard  },
  { id: 'notif',  label: 'Notifikasi',    icon: Bell        },
];

export default function PengaturanSistem() {
  const { toast } = useUI();
  const [activeTab, setActiveTab] = useState('umum');

  // === State per tab ===
  const [umum, setUmum] = useState({
    namaToko   : 'Warkop Djoeragan',
    tagline    : 'Warung Kopi Nusantara',
    alamat     : 'Jl. Menteng Raya No. 45, Jakarta Pusat',
    telepon    : '021-3141-5926',
    email      : 'hello@warkop-djoeragan.id',
    website    : 'https://warkop-djoeragan.id',
    timezone   : 'WIB',
    currency   : 'IDR',
  });

  const [pajak, setPajak] = useState({
    ppnAktif   : true,
    ppnPersen  : 11,
    serviceAktif: false,
    servicePersen: 5,
    hargaSudahPajak: false,
  });

  const [bayar, setBayar] = useState({
    cash    : true,
    qris    : true,
    transfer: true,
    debit   : false,
    kredit  : false,
    qrisMerchant: 'ID1234567890123',
    bankName    : 'BCA',
    bankAccount : '1234567890',
    bankHolder  : 'Warkop Djoeragan',
  });

  const [notif, setNotif] = useState({
    stokMenipis     : true,
    stokThreshold   : 10,
    shiftReminder   : true,
    shiftMenit      : 15,
    transaksiGagal  : true,
    laporanHarian   : false,
    laporanMingguan : true,
    emailLaporan    : 'owner@warkop-djoeragan.id',
  });

  const handleSave = () => {
    toast.success('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="page-enter">

      {/* === HEADER === */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.headerTitle}>Pengaturan Sistem</h2>
          <p className={styles.headerSub}>Konfigurasi global aplikasi Warkop Djoeragan POS</p>
        </div>
        <button type="button" id="btn-save-settings" className={styles.saveBtn} onClick={handleSave}>
          <Save size={16} strokeWidth={2.5} />
          Simpan Perubahan
        </button>
      </div>

      {/* === LAYOUT === */}
      <div className={styles.layout}>

        {/* Sidebar Tabs */}
        <nav className={styles.tabNav} aria-label="Navigasi pengaturan">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key       = {tab.id}
                type      = "button"
                id        = {`settings-tab-${tab.id}`}
                className = {`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick   = {() => setActiveTab(tab.id)}
                aria-selected={activeTab === tab.id}
              >
                <Icon size={16} strokeWidth={1.8} className={styles.tabIcon} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className={styles.tabContent}>

          {/* ===== UMUM ===== */}
          {activeTab === 'umum' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Store size={18} strokeWidth={1.8} />
                <h3 className={styles.sectionTitle}>Informasi Toko</h3>
              </div>

              <div className={styles.formGrid}>
                <Field label="Nama Toko" id="s-nama">
                  <input type="text" className={styles.input} id="s-nama"
                    value={umum.namaToko} onChange={(e) => setUmum({...umum, namaToko: e.target.value})} />
                </Field>
                <Field label="Tagline / Slogan" id="s-tagline">
                  <input type="text" className={styles.input} id="s-tagline"
                    value={umum.tagline} onChange={(e) => setUmum({...umum, tagline: e.target.value})} />
                </Field>
                <Field label="Nomor Telepon" id="s-telp">
                  <input type="tel" className={styles.input} id="s-telp"
                    value={umum.telepon} onChange={(e) => setUmum({...umum, telepon: e.target.value})} />
                </Field>
                <Field label="Email" id="s-email">
                  <input type="email" className={styles.input} id="s-email"
                    value={umum.email} onChange={(e) => setUmum({...umum, email: e.target.value})} />
                </Field>
                <Field label="Alamat Toko" id="s-alamat" full>
                  <textarea className={`${styles.input} ${styles.textarea}`} id="s-alamat"
                    value={umum.alamat} onChange={(e) => setUmum({...umum, alamat: e.target.value})} />
                </Field>
                <Field label="Website" id="s-web">
                  <input type="url" className={styles.input} id="s-web"
                    value={umum.website} onChange={(e) => setUmum({...umum, website: e.target.value})} />
                </Field>
                <Field label="Zona Waktu" id="s-tz">
                  <select className={styles.input} id="s-tz"
                    value={umum.timezone} onChange={(e) => setUmum({...umum, timezone: e.target.value})}>
                    <option value="WIB">WIB (UTC+7)</option>
                    <option value="WITA">WITA (UTC+8)</option>
                    <option value="WIT">WIT (UTC+9)</option>
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* ===== PAJAK ===== */}
          {activeTab === 'pajak' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Percent size={18} strokeWidth={1.8} />
                <h3 className={styles.sectionTitle}>Pajak & Biaya Layanan</h3>
              </div>

              <div className={styles.formGrid}>
                <ToggleRow
                  label="Aktifkan PPN"
                  sub="Pajak Pertambahan Nilai dibebankan ke pelanggan"
                  checked={pajak.ppnAktif}
                  onChange={(v) => setPajak({...pajak, ppnAktif: v})}
                />
                {pajak.ppnAktif && (
                  <Field label="Persentase PPN (%)" id="s-ppn">
                    <div className={styles.inputGroup}>
                      <input type="number" min="0" max="100" className={styles.input} id="s-ppn"
                        value={pajak.ppnPersen} onChange={(e) => setPajak({...pajak, ppnPersen: +e.target.value})} />
                      <span className={styles.inputSuffix}>%</span>
                    </div>
                  </Field>
                )}
                <ToggleRow
                  label="Aktifkan Service Charge"
                  sub="Biaya layanan tambahan per transaksi"
                  checked={pajak.serviceAktif}
                  onChange={(v) => setPajak({...pajak, serviceAktif: v})}
                />
                {pajak.serviceAktif && (
                  <Field label="Persentase Service (%)" id="s-svc">
                    <div className={styles.inputGroup}>
                      <input type="number" min="0" max="100" className={styles.input} id="s-svc"
                        value={pajak.servicePersen} onChange={(e) => setPajak({...pajak, servicePersen: +e.target.value})} />
                      <span className={styles.inputSuffix}>%</span>
                    </div>
                  </Field>
                )}
                <ToggleRow
                  label="Harga sudah termasuk pajak"
                  sub="Harga produk dianggap sudah include PPN"
                  checked={pajak.hargaSudahPajak}
                  onChange={(v) => setPajak({...pajak, hargaSudahPajak: v})}
                />
              </div>
            </div>
          )}

          {/* ===== METODE BAYAR ===== */}
          {activeTab === 'bayar' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <CreditCard size={18} strokeWidth={1.8} />
                <h3 className={styles.sectionTitle}>Metode Pembayaran</h3>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.sectionSubtitle}>Aktifkan Metode</div>
                {[
                  { key:'cash',     label:'Tunai (Cash)',    sub:'Pembayaran uang tunai langsung' },
                  { key:'qris',     label:'QRIS',            sub:'QR Code Indonesia Standard' },
                  { key:'transfer', label:'Transfer Bank',   sub:'Transfer antarbank manual' },
                  { key:'debit',    label:'Kartu Debit',     sub:'EDC / NFC tap to pay' },
                  { key:'kredit',   label:'Kartu Kredit',    sub:'Visa, Mastercard, JCB' },
                ].map((m) => (
                  <ToggleRow
                    key={m.key}
                    label={m.label}
                    sub={m.sub}
                    checked={bayar[m.key]}
                    onChange={(v) => setBayar({...bayar, [m.key]: v})}
                  />
                ))}

                {bayar.qris && (
                  <>
                    <div className={styles.sectionSubtitle}>Konfigurasi QRIS</div>
                    <Field label="Merchant ID QRIS" id="s-qris">
                      <input type="text" className={styles.input} id="s-qris"
                        value={bayar.qrisMerchant} onChange={(e) => setBayar({...bayar, qrisMerchant: e.target.value})} />
                    </Field>
                  </>
                )}

                {bayar.transfer && (
                  <>
                    <div className={styles.sectionSubtitle}>Rekening Tujuan Transfer</div>
                    <Field label="Nama Bank" id="s-bank">
                      <select className={styles.input} id="s-bank"
                        value={bayar.bankName} onChange={(e) => setBayar({...bayar, bankName: e.target.value})}>
                        {['BCA','BRI','BNI','Mandiri','BSI','CIMB','Permata'].map((b) =>
                          <option key={b} value={b}>{b}</option>
                        )}
                      </select>
                    </Field>
                    <Field label="Nomor Rekening" id="s-rek">
                      <input type="text" className={styles.input} id="s-rek"
                        value={bayar.bankAccount} onChange={(e) => setBayar({...bayar, bankAccount: e.target.value})} />
                    </Field>
                    <Field label="Nama Pemilik Rekening" id="s-holder" full>
                      <input type="text" className={styles.input} id="s-holder"
                        value={bayar.bankHolder} onChange={(e) => setBayar({...bayar, bankHolder: e.target.value})} />
                    </Field>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ===== NOTIFIKASI ===== */}
          {activeTab === 'notif' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Bell size={18} strokeWidth={1.8} />
                <h3 className={styles.sectionTitle}>Pengaturan Notifikasi</h3>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.sectionSubtitle}>Peringatan Operasional</div>
                <ToggleRow
                  label="Peringatan Stok Menipis"
                  sub="Notifikasi ketika stok produk di bawah batas"
                  checked={notif.stokMenipis}
                  onChange={(v) => setNotif({...notif, stokMenipis: v})}
                />
                {notif.stokMenipis && (
                  <Field label="Batas Minimum Stok" id="s-stok-th">
                    <div className={styles.inputGroup}>
                      <input type="number" min="1" className={styles.input} id="s-stok-th"
                        value={notif.stokThreshold} onChange={(e) => setNotif({...notif, stokThreshold: +e.target.value})} />
                      <span className={styles.inputSuffix}>unit</span>
                    </div>
                  </Field>
                )}
                <ToggleRow
                  label="Pengingat Tutup Shift"
                  sub="Notifikasi sebelum jam tutup shift"
                  checked={notif.shiftReminder}
                  onChange={(v) => setNotif({...notif, shiftReminder: v})}
                />
                {notif.shiftReminder && (
                  <Field label="Menit Sebelum Tutup" id="s-shift-mnt">
                    <div className={styles.inputGroup}>
                      <input type="number" min="5" max="60" className={styles.input} id="s-shift-mnt"
                        value={notif.shiftMenit} onChange={(e) => setNotif({...notif, shiftMenit: +e.target.value})} />
                      <span className={styles.inputSuffix}>mnt</span>
                    </div>
                  </Field>
                )}
                <ToggleRow
                  label="Alert Transaksi Gagal"
                  sub="Notifikasi jika ada error transaksi"
                  checked={notif.transaksiGagal}
                  onChange={(v) => setNotif({...notif, transaksiGagal: v})}
                />

                <div className={styles.sectionSubtitle}>Laporan Otomatis</div>
                <ToggleRow
                  label="Laporan Harian"
                  sub="Kirim ringkasan penjualan setiap hari via email"
                  checked={notif.laporanHarian}
                  onChange={(v) => setNotif({...notif, laporanHarian: v})}
                />
                <ToggleRow
                  label="Laporan Mingguan"
                  sub="Kirim laporan performa mingguan setiap Senin"
                  checked={notif.laporanMingguan}
                  onChange={(v) => setNotif({...notif, laporanMingguan: v})}
                />
                {(notif.laporanHarian || notif.laporanMingguan) && (
                  <Field label="Email Penerima Laporan" id="s-email-lap" full>
                    <input type="email" className={styles.input} id="s-email-lap"
                      value={notif.emailLaporan}
                      onChange={(e) => setNotif({...notif, emailLaporan: e.target.value})} />
                  </Field>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function Field({ label, id, children, full }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 6, gridColumn: full ? '1 / -1' : undefined }}>
      <label htmlFor={id} style={{ fontSize:13, fontWeight:600, color:'var(--color-text)' }}>{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div style={{
      display        : 'flex',
      alignItems     : 'center',
      justifyContent : 'space-between',
      padding        : '12px 16px',
      background     : 'var(--color-bg)',
      border         : '1px solid var(--color-border)',
      borderRadius   : 'var(--radius-md)',
      gridColumn     : '1 / -1',
      gap            : 16,
    }}>
      <div>
        <p style={{ fontSize:13.5, fontWeight:600, color:'var(--color-text)' }}>{label}</p>
        {sub && <p style={{ fontSize:12, color:'var(--color-text-muted)', marginTop:2 }}>{sub}</p>}
      </div>
      <label style={{ position:'relative', width:40, height:22, flexShrink:0, cursor:'pointer' }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
          style={{ opacity:0, width:0, height:0, position:'absolute' }} />
        <span style={{
          position     : 'absolute',
          inset        : 0,
          borderRadius : 'var(--radius-full)',
          background   : checked ? 'var(--color-primary)' : 'var(--color-border-strong)',
          transition   : 'background 0.15s ease',
        }}>
          <span style={{
            position     : 'absolute',
            width        : 16,
            height       : 16,
            background   : '#fff',
            borderRadius : '50%',
            top          : 3,
            left         : checked ? 21 : 3,
            transition   : 'left 0.15s ease',
            boxShadow    : '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </span>
      </label>
    </div>
  );
}
