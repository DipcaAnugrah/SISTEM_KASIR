import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Users, LayoutGrid, CheckCircle, XCircle } from 'lucide-react';
import { useUI }       from '../../hooks/useUI';
import { DUMMY_CABANG } from '../../data/cabang';
import Modal            from '../../components/Modal/Modal';
import { formatRupiah } from '../../utils/format';
import s from '../../styles/admin.module.css';
import styles from './ManajemenCabang.module.css';

// ============================================================
// MANAJEMEN CABANG — daftar & CRUD cabang
// ============================================================

const EMPTY_FORM = {
  nama    : '',
  lokasi  : '',
  alamat  : '',
  telepon : '',
  bukaJam : '07:00',
  tutupJam: '22:00',
  manajer : '',
  status  : 'aktif',
};

export default function ManajemenCabang() {
  const { toast } = useUI();

  const [cabangList, setCabangList] = useState(DUMMY_CABANG);
  const [showModal,  setShowModal ] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget,  setDelTarget ] = useState(null);
  const [form,       setForm      ] = useState(EMPTY_FORM);

  const stats = {
    total : cabangList.length,
    aktif : cabangList.filter((c) => c.status === 'aktif').length,
    tutup : cabangList.filter((c) => c.status === 'tutup').length,
    meja  : cabangList.reduce((a, c) => a + c.jumlahMeja, 0),
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditTarget(c);
    setForm({ ...c });
    setShowModal(true);
  };

  const handleFormChange = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.nama.trim()) { toast.error('Nama cabang wajib diisi'); return; }
    const entry = {
      ...form,
      id         : editTarget?.id ?? `c${Date.now()}`,
      jumlahMeja : editTarget?.jumlahMeja  ?? 0,
      jumlahKasir: editTarget?.jumlahKasir ?? 0,
      omzetBulan : editTarget?.omzetBulan  ?? 0,
      totalTrx   : editTarget?.totalTrx   ?? 0,
      createdAt  : editTarget?.createdAt   ?? new Date().toISOString().slice(0,10),
    };
    if (editTarget) {
      setCabangList((prev) => prev.map((c) => c.id === editTarget.id ? entry : c));
      toast.success('Cabang berhasil diperbarui');
    } else {
      setCabangList((prev) => [...prev, entry]);
      toast.success('Cabang baru berhasil ditambahkan');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setCabangList((prev) => prev.filter((c) => c.id !== delTarget.id));
    setShowDelete(false);
    toast.success('Cabang berhasil dihapus');
  };

  return (
    <div className="page-enter">

      {/* Stats */}
      <div className={s.statsRow}>
        {[
          { label:'Total Cabang',   value: stats.total, bg:'var(--color-primary-light)', color:'var(--color-primary)',  icon: MapPin      },
          { label:'Cabang Aktif',   value: stats.aktif, bg:'var(--color-success-light)', color:'var(--color-success)',  icon: CheckCircle },
          { label:'Cabang Tutup',   value: stats.tutup, bg:'var(--color-danger-light)',  color:'var(--color-danger)',   icon: XCircle     },
          { label:'Total Meja',     value: stats.meja,  bg:'var(--color-warning-light)', color:'var(--color-warning)',  icon: LayoutGrid  },
        ].map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.label} className={s.statCard}>
              <div className={s.statIconWrap} style={{ background: st.bg, color: st.color }}>
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div>
                <p className={s.statValue}>{st.value}</p>
                <p className={s.statLabel}>{st.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className={s.toolbar}>
        <div className={s.toolbarLeft}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>
            Daftar Cabang ({cabangList.length})
          </h2>
        </div>
        <div className={s.toolbarRight}>
          <button id="btn-add-cabang" type="button" className={s.addBtn} onClick={openAdd}>
            <Plus size={16} strokeWidth={2.5} /> Tambah Cabang
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className={styles.cabangGrid}>
        {cabangList.map((c) => (
          <article key={c.id} className={`${styles.cabangCard} ${c.status === 'tutup' ? styles.tutup : ''}`}>

            {/* Status strip */}
            <div className={`${styles.statusStrip} ${c.status === 'aktif' ? styles.stripAktif : styles.stripTutup}`} />

            {/* Header */}
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardNama}>{c.nama}</h3>
                <p className={styles.cardLokasi}>
                  <MapPin size={12} strokeWidth={2.5} style={{ display:'inline', marginRight:4 }} />
                  {c.lokasi}
                </p>
              </div>
              <span className={c.status === 'aktif' ? s.badgeAktif : s.badgeTutup}>
                {c.status === 'aktif' ? 'Aktif' : 'Tutup'}
              </span>
            </div>

            {/* Stats mini */}
            <div className={styles.cardStats}>
              <div className={styles.miniStat}>
                <LayoutGrid size={14} strokeWidth={2} style={{ color:'var(--color-text-muted)' }} />
                <span>{c.jumlahMeja} meja</span>
              </div>
              <div className={styles.miniStat}>
                <Users size={14} strokeWidth={2} style={{ color:'var(--color-text-muted)' }} />
                <span>{c.jumlahKasir} kasir</span>
              </div>
              <div className={styles.miniStat}>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {c.bukaJam} – {c.tutupJam}
                </span>
              </div>
            </div>

            {/* Omzet */}
            {c.status === 'aktif' && (
              <div className={styles.cardOmzet}>
                <span className={styles.omzetLabel}>Omzet Bulan Ini</span>
                <span className={styles.omzetValue}>{formatRupiah(c.omzetBulan, true)}</span>
              </div>
            )}

            {/* Manajer */}
            <div className={styles.cardManajer}>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Manajer:</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text)' }}>
                {c.manajer || '—'}
              </span>
            </div>

            {/* Actions */}
            <div className={styles.cardActions}>
              <button type="button" className={styles.cardEditBtn} onClick={() => openEdit(c)}>
                <Pencil size={14} strokeWidth={2} /> Edit
              </button>
              <button type="button" className={styles.cardDeleteBtn}
                onClick={() => { setDelTarget(c); setShowDelete(true); }}>
                <Trash2 size={14} strokeWidth={2} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editTarget ? `Edit — ${editTarget.nama}` : 'Tambah Cabang Baru'} size="md">
        <form className={s.modalForm} onSubmit={handleSave}>
          <div className={s.fieldRow}>
            <div className={`${s.field} ${s.full}`}>
              <label className={s.fieldLabel} htmlFor="cb-nama">Nama Cabang *</label>
              <input id="cb-nama" type="text" className={s.fieldInput}
                value={form.nama} onChange={(e) => handleFormChange('nama', e.target.value)}
                placeholder="cth: Cabang Utama" required />
            </div>
          </div>
          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="cb-lokasi">Kota/Kecamatan</label>
              <input id="cb-lokasi" type="text" className={s.fieldInput}
                value={form.lokasi} onChange={(e) => handleFormChange('lokasi', e.target.value)}
                placeholder="cth: Menteng, Jakarta Pusat" />
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="cb-telp">Telepon</label>
              <input id="cb-telp" type="tel" className={s.fieldInput}
                value={form.telepon} onChange={(e) => handleFormChange('telepon', e.target.value)}
                placeholder="cth: 021-1234-5678" />
            </div>
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel} htmlFor="cb-alamat">Alamat Lengkap</label>
            <textarea id="cb-alamat" className={s.fieldTextarea}
              value={form.alamat} onChange={(e) => handleFormChange('alamat', e.target.value)}
              placeholder="Jl. ..." />
          </div>
          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="cb-buka">Jam Buka</label>
              <input id="cb-buka" type="time" className={s.fieldInput}
                value={form.bukaJam} onChange={(e) => handleFormChange('bukaJam', e.target.value)} />
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="cb-tutup">Jam Tutup</label>
              <input id="cb-tutup" type="time" className={s.fieldInput}
                value={form.tutupJam} onChange={(e) => handleFormChange('tutupJam', e.target.value)} />
            </div>
          </div>
          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="cb-manajer">Nama Manajer</label>
              <input id="cb-manajer" type="text" className={s.fieldInput}
                value={form.manajer} onChange={(e) => handleFormChange('manajer', e.target.value)}
                placeholder="cth: Dewi Rahayu" />
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="cb-status">Status</label>
              <select id="cb-status" className={s.fieldSelect}
                value={form.status} onChange={(e) => handleFormChange('status', e.target.value)}>
                <option value="aktif">Aktif</option>
                <option value="tutup">Tutup</option>
              </select>
            </div>
          </div>
          <div className={s.modalActions}>
            <button type="button" className={s.cancelBtn} onClick={() => setShowModal(false)}>Batal</button>
            <button type="submit" className={s.saveBtn} disabled={!form.nama}>
              {editTarget ? 'Simpan Perubahan' : 'Tambah Cabang'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Hapus Cabang" size="sm">
        <div className={s.deleteConfirm}>
          <p className={s.deleteText}>
            Yakin ingin menghapus cabang{' '}
            <span className={s.deleteStrong}>{delTarget?.nama}</span>?
          </p>
          <div className={s.deleteActions}>
            <button type="button" className={s.deleteCancelBtn} onClick={() => setShowDelete(false)}>Batal</button>
            <button type="button" className={s.deleteConfirmBtn} onClick={handleDelete}>Ya, Hapus</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
