import { useState, useMemo } from 'react';
import {
  Search, Plus, Pencil, Trash2,
  Boxes, AlertTriangle, TrendingDown, ShoppingBag,
} from 'lucide-react';
import { useUI } from '../../hooks/useUI';
import { DUMMY_BAHAN_BAKU, KATEGORI_BAHAN, SATUAN_LIST } from '../../data/bahanBaku';
import { formatRupiah } from '../../utils/format';
import Modal from '../../components/Modal/Modal';
import s from '../../styles/admin.module.css';
import styles from './ManajemenBahanBaku.module.css';

// ============================================================
// MANAJEMEN BAHAN BAKU — Inventory management
// ============================================================

const EMPTY_FORM = {
  nama        : '',
  kategori    : 'kopi',
  satuan      : 'kg',
  stok        : '',
  stokMin     : '0',   // default 0 — wajib tapi punya nilai awal
  hargaSatuan : '0',
  supplier    : '',
};

function ManajemenBahanBaku() {
  const { toast } = useUI();

  const [bahanList,   setBahanList  ] = useState(DUMMY_BAHAN_BAKU);
  const [search,      setSearch     ] = useState('');
  const [katFilter,   setKatFilter  ] = useState('semua');
  const [showModal,   setShowModal  ] = useState(false);
  const [showDelete,  setShowDelete ] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  const [editTarget,  setEditTarget ] = useState(null);
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restockTarget, setRestockTarget] = useState(null);
  const [form,        setForm       ] = useState(EMPTY_FORM);
  const [restockQty,  setRestockQty ] = useState('');

  // === Filter ===
  const filtered = useMemo(() => {
    let list = bahanList;
    if (katFilter !== 'semua') list = list.filter((b) => b.kategori === katFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.nama.toLowerCase().includes(q) || b.supplier.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bahanList, search, katFilter]);

  // === Stats ===
  const stats = useMemo(() => ({
    total   : bahanList.length,
    menipis : bahanList.filter((b) => b.stok > 0 && b.stok <= b.stokMin).length,
    habis   : bahanList.filter((b) => b.stok <= 0).length,
    nilaiTotal: bahanList.reduce((a, b) => a + (b.stok * b.hargaSatuan), 0),
  }), [bahanList]);

  // === Status helper ===
  const getStatus = (b) => {
    if (b.stok <= 0)       return { cls: 'habis',   label: 'Habis'   };
    if (b.stok <= b.stokMin) return { cls: 'menipis', label: 'Menipis' };
    return                        { cls: 'aman',     label: 'Aman'    };
  };

  // === Handlers ===
  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditTarget(b);
    setForm({ ...b, stok: String(b.stok), stokMin: String(b.stokMin), hargaSatuan: String(b.hargaSatuan) });
    setShowModal(true);
  };

  const openRestock = (b) => {
    setRestockTarget(b);
    setRestockQty('');
    setShowRestock(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Hanya nama dan stok yang benar-benar wajib diisi
    if (!form.nama.trim()) { toast.error('Nama bahan wajib diisi'); return; }
    if (!form.stok || Number(form.stok) < 0) { toast.error('Stok saat ini wajib diisi'); return; }
    const entry = {
      ...form,
      id         : editTarget?.id ?? `b${Date.now()}`,
      stok       : Number(form.stok),
      stokMin    : Number(form.stokMin),
      hargaSatuan: Number(String(form.hargaSatuan).replace(/\D/g, '')),
      updatedAt  : new Date().toISOString().slice(0, 10),
    };
    if (editTarget) {
      setBahanList((prev) => prev.map((b) => b.id === editTarget.id ? entry : b));
      toast.success('Bahan baku berhasil diperbarui');
    } else {
      setBahanList((prev) => [...prev, entry]);
      toast.success('Bahan baku berhasil ditambahkan');
    }
    setShowModal(false);
  };

  const handleRestock = (e) => {
    e.preventDefault();
    const qty = Number(restockQty);
    if (!qty || qty <= 0) { toast.error('Masukkan jumlah yang valid'); return; }
    setBahanList((prev) =>
      prev.map((b) =>
        b.id === restockTarget.id
          ? { ...b, stok: b.stok + qty, updatedAt: new Date().toISOString().slice(0, 10) }
          : b
      )
    );
    toast.success(`+${qty} ${restockTarget.satuan} berhasil ditambahkan ke stok ${restockTarget.nama}`);
    setShowRestock(false);
  };

  const handleDelete = () => {
    setBahanList((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setShowDelete(false);
    toast.success('Bahan baku berhasil dihapus');
  };

  const handleFormChange = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  return (
    <div className="page-enter">

      {/* === STATS === */}
      <div className={s.statsRow}>
        {[
          { label:'Total Bahan',    value: bahanList.length,       icon: Boxes,         bg:'var(--color-primary-light)', color:'var(--color-primary)'  },
          { label:'Stok Menipis',   value: stats.menipis,          icon: AlertTriangle, bg:'var(--color-warning-light)', color:'var(--color-warning)'  },
          { label:'Stok Habis',     value: stats.habis,            icon: TrendingDown,  bg:'var(--color-danger-light)',  color:'var(--color-danger)'   },
          { label:'Nilai Inventori',value: formatRupiah(stats.nilaiTotal, true), icon: ShoppingBag, bg:'var(--color-success-light)', color:'var(--color-success)' },
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

      {/* === TOOLBAR === */}
      <div className={s.toolbar}>
        <div className={s.toolbarLeft}>
          <div className={s.searchWrap}>
            <Search size={15} className={s.searchIcon} strokeWidth={2.5} />
            <input
              id="search-bahan" type="search" className={s.searchInput}
              placeholder="Cari bahan atau supplier..."
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select id="filter-kat-bahan" className={s.filterSelect}
            value={katFilter} onChange={(e) => setKatFilter(e.target.value)}>
            {KATEGORI_BAHAN.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </div>
        <div className={s.toolbarRight}>
          <button id="btn-add-bahan" type="button" className={s.addBtn} onClick={openAdd}>
            <Plus size={16} strokeWidth={2.5} />
            Tambah Bahan
          </button>
        </div>
      </div>

      {/* === TABLE === */}
      <div className={s.tableCard}>
        <div className={s.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Bahan Baku</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Min. Stok</th>
                <th>Harga/Satuan</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Update</th>
                <th style={{ width: 100 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="9">
                  <div className={s.empty}>
                    <Boxes size={40} strokeWidth={1.2} className={s.emptyIcon} />
                    <p className={s.emptyTitle}>Tidak ada bahan ditemukan</p>
                    <p className={s.emptySub}>Coba ubah filter pencarian</p>
                  </div>
                </td></tr>
              ) : filtered.map((b) => {
                const status = getStatus(b);
                const katLabel = KATEGORI_BAHAN.find((k) => k.value === b.kategori)?.label ?? b.kategori;
                return (
                  <tr key={b.id} className={status.cls === 'habis' ? styles.rowHabis : status.cls === 'menipis' ? styles.rowMenipis : ''}>
                    <td>
                      <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{b.nama}</p>
                    </td>
                    <td>
                      <span style={{ background:'var(--color-bg-secondary)', padding:'3px 8px', borderRadius:'var(--radius-full)', fontSize:12, fontWeight:600, color:'var(--color-text-muted)' }}>
                        {katLabel}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontWeight : 700,
                        fontSize   : 14,
                        color      : b.stok <= 0 ? 'var(--color-danger)' : b.stok <= b.stokMin ? 'var(--color-warning)' : 'var(--color-text)',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {b.stok} {b.satuan}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                      {b.stokMin} {b.satuan}
                    </td>
                    <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {formatRupiah(b.hargaSatuan)}/{b.satuan}
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{b.supplier}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[status.cls]}`}>
                        {status.cls === 'menipis' && <AlertTriangle size={10} strokeWidth={2.5} />}
                        {status.label}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--color-text-disabled)' }}>{b.updatedAt}</td>
                    <td>
                      <div className={s.actionBtns}>
                        <button
                          type="button" title="Tambah stok"
                          className={styles.restockBtn}
                          onClick={() => openRestock(b)}
                          aria-label={`Restock ${b.nama}`}
                        >
                          <Plus size={13} strokeWidth={2.5} />
                        </button>
                        <button type="button" className={s.editBtn} onClick={() => openEdit(b)} title="Edit">
                          <Pencil size={14} strokeWidth={2} />
                        </button>
                        <button type="button" className={s.deleteBtn}
                          onClick={() => { setDeleteTarget(b); setShowDelete(true); }} title="Hapus">
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={s.tableFooter}>
          <span>Menampilkan {filtered.length} dari {bahanList.length} bahan</span>
          {stats.menipis > 0 && (
            <span className={styles.alertBadge}>
              <AlertTriangle size={12} strokeWidth={2.5} />
              {stats.menipis} bahan perlu restock
            </span>
          )}
        </div>
      </div>

      {/* === ADD/EDIT MODAL === */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editTarget ? `Edit — ${editTarget.nama}` : 'Tambah Bahan Baku'} size="md">
        <form className={s.modalForm} onSubmit={handleSave}>
          <div className={s.fieldRow}>
            <div className={`${s.field} ${s.full}`}>
              <label className={s.fieldLabel} htmlFor="bb-nama">Nama Bahan *</label>
              <input id="bb-nama" type="text" className={s.fieldInput}
                value={form.nama} onChange={(e) => handleFormChange('nama', e.target.value)}
                placeholder="cth: Gula Aren Cair" required />
            </div>
          </div>
          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="bb-kat">Kategori</label>
              <select id="bb-kat" className={s.fieldSelect}
                value={form.kategori} onChange={(e) => handleFormChange('kategori', e.target.value)}>
                {KATEGORI_BAHAN.filter((k) => k.value !== 'semua').map((k) =>
                  <option key={k.value} value={k.value}>{k.label}</option>
                )}
              </select>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="bb-satuan">Satuan</label>
              <select id="bb-satuan" className={s.fieldSelect}
                value={form.satuan} onChange={(e) => handleFormChange('satuan', e.target.value)}>
                {SATUAN_LIST.map((sat) => <option key={sat} value={sat}>{sat}</option>)}
              </select>
            </div>
          </div>
          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="bb-stok">Stok Saat Ini *</label>
              <input id="bb-stok" type="number" min="0" step="0.1" className={s.fieldInput}
                value={form.stok} onChange={(e) => handleFormChange('stok', e.target.value)}
                placeholder="0" required />
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="bb-min">Stok Minimum *</label>
              <p className={s.fieldSub}>Peringatan jika stok ≤ nilai ini</p>
              <input id="bb-min" type="number" min="0" step="0.1" className={s.fieldInput}
                value={form.stokMin} onChange={(e) => handleFormChange('stokMin', e.target.value)}
                placeholder="0" required />
            </div>
          </div>
          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="bb-harga">Harga per Satuan (Rp)</label>
              <input id="bb-harga" type="text" inputMode="numeric" className={s.fieldInput}
                value={form.hargaSatuan ? Number(String(form.hargaSatuan).replace(/\D/g,'')).toLocaleString('id-ID') : ''}
                onChange={(e) => handleFormChange('hargaSatuan', e.target.value.replace(/\D/g,''))}
                placeholder="0" />
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="bb-sup">Supplier</label>
              <input id="bb-sup" type="text" className={s.fieldInput}
                value={form.supplier} onChange={(e) => handleFormChange('supplier', e.target.value)}
                placeholder="Nama supplier..." />
            </div>
          </div>
          <div className={s.modalActions}>
            <button type="button" className={s.cancelBtn} onClick={() => setShowModal(false)}>Batal</button>
            <button type="submit" className={s.saveBtn} disabled={!form.nama.trim() || form.stok === ''}>
              {editTarget ? 'Simpan Perubahan' : 'Tambah Bahan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* === RESTOCK MODAL === */}
      <Modal isOpen={showRestock} onClose={() => setShowRestock(false)} title="Tambah Stok" size="sm">
        <form onSubmit={handleRestock} style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
          <div className={styles.restockInfo}>
            <div className={styles.restockBahan}>{restockTarget?.nama}</div>
            <div className={styles.restockCurrent}>
              Stok saat ini:&nbsp;
              <strong>{restockTarget?.stok} {restockTarget?.satuan}</strong>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
            <label className={s.fieldLabel} htmlFor="rs-qty">
              Jumlah Penambahan ({restockTarget?.satuan}) *
            </label>
            <input
              id="rs-qty" type="number" min="0.1" step="0.1"
              className={s.fieldInput}
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              placeholder={`cth: 10 ${restockTarget?.satuan ?? ''}`}
              required autoFocus
            />
          </div>
          {restockQty > 0 && (
            <div className={styles.restockPreview}>
              Stok setelah restock:&nbsp;
              <strong>{((restockTarget?.stok ?? 0) + Number(restockQty)).toFixed(1)} {restockTarget?.satuan}</strong>
            </div>
          )}
          <div className={s.modalActions}>
            <button type="button" className={s.cancelBtn} onClick={() => setShowRestock(false)}>Batal</button>
            <button type="submit" className={s.saveBtn} disabled={!restockQty || Number(restockQty) <= 0}>
              Tambah Stok
            </button>
          </div>
        </form>
      </Modal>

      {/* === DELETE MODAL === */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Hapus Bahan Baku" size="sm">
        <div className={s.deleteConfirm}>
          <p className={s.deleteText}>
            Yakin ingin menghapus bahan baku{' '}
            <span className={s.deleteStrong}>{deleteTarget?.nama}</span>?
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

export default ManajemenBahanBaku;
