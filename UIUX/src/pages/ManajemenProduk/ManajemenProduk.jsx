import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, Package, PackageX, Coffee, UtensilsCrossed } from 'lucide-react';
import { useUI }    from '../../hooks/useUI';
import { PRODUCTS } from '../../data/products';
import Modal        from '../../components/Modal/Modal';
import { formatRupiah } from '../../utils/format';
import s from '../../styles/admin.module.css';

// ============================================================
// MANAJEMEN PRODUK — CRUD dengan table + modal
// ============================================================

const KATEGORI_OPTS = [
  { value: 'semua',   label: 'Semua Kategori' },
  { value: 'kopi',    label: '☕ Kopi' },
  { value: 'nonkopi', label: '🍵 Non-Kopi' },
  { value: 'makanan', label: '🍜 Makanan' },
  { value: 'snack',   label: '🥨 Snack' },
];

const STOK_THRESHOLD = 10;

const EMPTY_FORM = {
  nama    : '',
  kategori: 'kopi',
  harga   : '',
  stok    : '',
  deskripsi: '',
  tersedia: true,
  emoji   : '☕',
};

const EMOJI_BY_KAT = { kopi: '☕', nonkopi: '🍵', makanan: '🍜', snack: '🥨' };

function ManajemenProduk() {
  const { toast } = useUI();

  const [products, setProducts] = useState(PRODUCTS);
  const [search,   setSearch  ] = useState('');
  const [katFilter,setKatFilter] = useState('semua');

  const [showModal,    setShowModal   ] = useState(false);
  const [showDelete,   setShowDelete  ] = useState(false);
  const [editTarget,   setEditTarget  ] = useState(null);  // null = add, obj = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form,         setForm        ] = useState(EMPTY_FORM);

  // === Filter + Search ===
  const filtered = useMemo(() => {
    let list = products;
    if (katFilter !== 'semua') list = list.filter((p) => p.kategori === katFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.nama.toLowerCase().includes(q) || p.deskripsi.toLowerCase().includes(q));
    }
    return list;
  }, [products, search, katFilter]);

  // === Stats ===
  const stats = useMemo(() => ({
    total  : products.length,
    aktif  : products.filter((p) => p.tersedia).length,
    habis  : products.filter((p) => p.stok <= 0).length,
    menipis: products.filter((p) => p.stok > 0 && p.stok <= STOK_THRESHOLD).length,
  }), [products]);

  // === Handlers ===
  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (prod) => {
    setEditTarget(prod);
    setForm({ ...prod, harga: String(prod.harga), stok: String(prod.stok) });
    setShowModal(true);
  };

  const openDelete = (prod) => {
    setDeleteTarget(prod);
    setShowDelete(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'kategori' ? { emoji: EMOJI_BY_KAT[value] ?? '📦' } : {}),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.harga || !form.stok) {
      toast.error('Lengkapi semua field yang wajib diisi');
      return;
    }
    const produk = {
      ...form,
      harga: Number(form.harga.toString().replace(/\D/g,'')),
      stok : Number(form.stok),
      id   : editTarget?.id ?? `p${Date.now()}`,
    };
    if (editTarget) {
      setProducts((prev) => prev.map((p) => p.id === editTarget.id ? produk : p));
      toast.success('Produk berhasil diperbarui');
    } else {
      setProducts((prev) => [...prev, produk]);
      toast.success('Produk berhasil ditambahkan');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setShowDelete(false);
    toast.success('Produk berhasil dihapus');
  };

  const handleToggle = (id) => {
    setProducts((prev) =>
      prev.map((p) => p.id === id ? { ...p, tersedia: !p.tersedia } : p)
    );
  };

  return (
    <div className="page-enter">

      {/* === STATS ROW === */}
      <div className={s.statsRow}>
        {[
          { label: 'Total Produk',  value: stats.total,   icon: Package,        bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
          { label: 'Aktif Dijual',  value: stats.aktif,   icon: Coffee,         bg: 'var(--color-success-light)', color: 'var(--color-success)' },
          { label: 'Stok Menipis',  value: stats.menipis, icon: PackageX,       bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
          { label: 'Stok Habis',    value: stats.habis,   icon: UtensilsCrossed,bg: 'var(--color-danger-light)',  color: 'var(--color-danger)'  },
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
          {/* Search */}
          <div className={s.searchWrap}>
            <Search size={15} className={s.searchIcon} strokeWidth={2.5} />
            <input
              id          = "search-produk"
              type        = "search"
              className   = {s.searchInput}
              placeholder = "Cari produk..."
              value       = {search}
              onChange    = {(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Kategori filter */}
          <select
            id        = "filter-kategori"
            className = {s.filterSelect}
            value     = {katFilter}
            onChange  = {(e) => setKatFilter(e.target.value)}
          >
            {KATEGORI_OPTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className={s.toolbarRight}>
          <button id="btn-add-produk" type="button" className={s.addBtn} onClick={openAdd}>
            <Plus size={16} strokeWidth={2.5} />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* === TABLE CARD === */}
      <div className={s.tableCard}>
        <div className={s.tableWrap}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 36 }}>No.</th>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Dijual</th>
                <th style={{ width: 80 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className={s.empty}>
                      <Package size={40} strokeWidth={1.2} className={s.emptyIcon} />
                      <p className={s.emptyTitle}>Tidak ada produk ditemukan</p>
                      <p className={s.emptySub}>Coba ubah filter atau kata kunci pencarian</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{i + 1}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{p.emoji}</span>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{p.nama}</p>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{p.deskripsi}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ background:'var(--color-bg-secondary)', padding:'3px 8px', borderRadius:'var(--radius-full)', fontSize:12, fontWeight:600, color:'var(--color-text-muted)' }}>
                      {KATEGORI_OPTS.find((k) => k.value === p.kategori)?.label ?? p.kategori}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{formatRupiah(p.harga)}</td>
                  <td>
                    <span style={{
                      fontWeight : 700,
                      color      : p.stok <= 0 ? 'var(--color-danger)' : p.stok <= STOK_THRESHOLD ? 'var(--color-warning)' : 'var(--color-text)',
                    }}>
                      {p.stok}
                    </span>
                  </td>
                  <td>
                    <label className={s.toggle}>
                      <input
                        type    = "checkbox"
                        checked = {p.tersedia}
                        onChange= {() => handleToggle(p.id)}
                        aria-label={`Toggle ketersediaan ${p.nama}`}
                      />
                      <span className={s.toggleSlider} />
                    </label>
                  </td>
                  <td>
                    <div className={s.actionBtns}>
                      <button type="button" className={s.editBtn} onClick={() => openEdit(p)} aria-label={`Edit ${p.nama}`} title="Edit">
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                      <button type="button" className={s.deleteBtn} onClick={() => openDelete(p)} aria-label={`Hapus ${p.nama}`} title="Hapus">
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={s.tableFooter}>
          <span>Menampilkan {filtered.length} dari {products.length} produk</span>
        </div>
      </div>

      {/* === ADD/EDIT MODAL === */}
      <Modal
        isOpen = {showModal}
        onClose= {() => setShowModal(false)}
        title  = {editTarget ? `Edit Produk — ${editTarget.nama}` : 'Tambah Produk Baru'}
        size   = "md"
      >
        <form className={s.modalForm} onSubmit={handleSave}>
          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="prod-nama">Nama Produk *</label>
              <input id="prod-nama" type="text" className={s.fieldInput}
                value={form.nama} onChange={(e) => handleFormChange('nama', e.target.value)}
                placeholder="cth: Kopi Susu Gula Aren" required />
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="prod-kat">Kategori *</label>
              <select id="prod-kat" className={s.fieldSelect}
                value={form.kategori} onChange={(e) => handleFormChange('kategori', e.target.value)}>
                {KATEGORI_OPTS.filter((o) => o.value !== 'semua').map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="prod-harga">Harga (Rp) *</label>
              <input id="prod-harga" type="text" inputMode="numeric" className={s.fieldInput}
                value={form.harga ? Number(String(form.harga).replace(/\D/g,'')).toLocaleString('id-ID') : ''}
                onChange={(e) => handleFormChange('harga', e.target.value.replace(/\D/g,''))}
                placeholder="15000" required />
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="prod-stok">Stok Awal *</label>
              <input id="prod-stok" type="number" min="0" className={s.fieldInput}
                value={form.stok} onChange={(e) => handleFormChange('stok', e.target.value)}
                placeholder="50" required />
            </div>
          </div>

          <div className={`${s.field} ${s.full}`}>
            <label className={s.fieldLabel} htmlFor="prod-desk">Deskripsi</label>
            <textarea id="prod-desk" className={s.fieldTextarea}
              value={form.deskripsi} onChange={(e) => handleFormChange('deskripsi', e.target.value)}
              placeholder="Deskripsi singkat produk..." />
          </div>

          <div className={s.toggleField}>
            <div>
              <p className={s.toggleFieldLabel}>Tersedia untuk dijual</p>
              <p className={s.toggleFieldSub}>Produk akan muncul di halaman Kasir POS</p>
            </div>
            <label className={s.toggle}>
              <input type="checkbox" checked={form.tersedia}
                onChange={(e) => handleFormChange('tersedia', e.target.checked)} />
              <span className={s.toggleSlider} />
            </label>
          </div>

          <div className={s.modalActions}>
            <button type="button" className={s.cancelBtn} onClick={() => setShowModal(false)}>Batal</button>
            <button type="submit" className={s.saveBtn} disabled={!form.nama || !form.harga}>
              {editTarget ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </Modal>

      {/* === DELETE CONFIRM MODAL === */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Hapus Produk" size="sm">
        <div className={s.deleteConfirm}>
          <p className={s.deleteText}>
            Yakin ingin menghapus produk{' '}
            <span className={s.deleteStrong}>{deleteTarget?.emoji} {deleteTarget?.nama}</span>?
            <br />Tindakan ini tidak dapat dibatalkan.
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

export default ManajemenProduk;
