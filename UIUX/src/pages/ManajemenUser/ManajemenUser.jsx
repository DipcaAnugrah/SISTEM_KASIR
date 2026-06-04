import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, Users, ShieldCheck, User } from 'lucide-react';
import { useUI }  from '../../hooks/useUI';
import { DUMMY_USERS } from '../../data/users';
import { DUMMY_CABANG } from '../../data/cabang';
import Modal from '../../components/Modal/Modal';
import { ROLE_LABELS } from '../../router/roleConfig';
import s from '../../styles/admin.module.css';

// ============================================================
// MANAJEMEN USER — CRUD daftar pengguna sistem
// ============================================================

const ROLE_OPTS = [
  { value: 'semua', label: 'Semua Role' },
  { value: 'kasir', label: 'Kasir'  },
  { value: 'owner', label: 'Owner'  },
  { value: 'admin', label: 'Admin'  },
];

const EMPTY_FORM = {
  nama    : '',
  username: '',
  password: '',
  role    : 'kasir',
  cabangId: 'c001',
  aktif   : true,
};

const ROLE_CLASS = {
  kasir: s.roleKasir,
  owner: s.roleOwner,
  admin: s.roleSuperAdmin,
};

function getInitials(nama) {
  return nama?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() ?? '?';
}

function ManajemenUser() {
  const { toast } = useUI();

  const [users,      setUsers     ] = useState(DUMMY_USERS);
  const [search,     setSearch    ] = useState('');
  const [roleFilter, setRoleFilter] = useState('semua');
  const [showModal,  setShowModal ] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [form,       setForm      ] = useState(EMPTY_FORM);

  // === Filter ===
  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== 'semua') list = list.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) =>
        u.nama.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, search, roleFilter]);

  // === Stats ===
  const stats = useMemo(() => ({
    total : users.length,
    aktif : users.filter((u) => u.aktif).length,
    kasir : users.filter((u) => u.role === 'kasir').length,
    owner : users.filter((u) => u.role === 'owner').length,
  }), [users]);

  // === Handlers ===
  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditTarget(u);
    setForm({ ...u, cabangId: u.cabang?.id ?? 'c001', password: '' });
    setShowModal(true);
  };

  const handleFormChange = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.username.trim()) {
      toast.error('Nama dan username wajib diisi');
      return;
    }
    const cabang = DUMMY_CABANG.find((c) => c.id === form.cabangId) ?? null;
    const user = {
      ...form,
      id       : editTarget?.id ?? `u${Date.now()}`,
      cabang   : cabang ? { id: cabang.id, nama: cabang.nama } : null,
      createdAt: editTarget?.createdAt ?? new Date().toISOString().slice(0, 10),
      password : form.password || editTarget?.password || 'warkop123',
    };
    if (editTarget) {
      setUsers((prev) => prev.map((u) => u.id === editTarget.id ? user : u));
      toast.success('Pengguna berhasil diperbarui');
    } else {
      setUsers((prev) => [...prev, user]);
      toast.success('Pengguna baru berhasil ditambahkan');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setShowDelete(false);
    toast.success('Pengguna berhasil dihapus');
  };

  const handleToggleAktif = (id) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, aktif: !u.aktif } : u));
  };

  return (
    <div className="page-enter">

      {/* Stats */}
      <div className={s.statsRow}>
        {[
          { label:'Total Pengguna', value: stats.total, bg:'var(--color-primary-light)', color:'var(--color-primary)',  icon: Users      },
          { label:'Akun Aktif',     value: stats.aktif, bg:'var(--color-success-light)', color:'var(--color-success)',  icon: ShieldCheck},
          { label:'Kasir',          value: stats.kasir, bg:'var(--color-info-light)',    color:'var(--color-info)',     icon: User       },
          { label:'Owner',          value: stats.owner, bg:'var(--color-warning-light)', color:'var(--color-warning)',  icon: Users      },
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
          <div className={s.searchWrap}>
            <Search size={15} className={s.searchIcon} strokeWidth={2.5} />
            <input
              id="search-user" type="search" className={s.searchInput}
              placeholder="Cari nama / username..."
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select id="filter-role" className={s.filterSelect}
            value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            {ROLE_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className={s.toolbarRight}>
          <button id="btn-add-user" type="button" className={s.addBtn} onClick={openAdd}>
            <Plus size={16} strokeWidth={2.5} /> Tambah Pengguna
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={s.tableCard}>
        <div className={s.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Username</th>
                <th>Role</th>
                <th>Cabang</th>
                <th>Status</th>
                <th style={{ width: 80 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6">
                  <div className={s.empty}>
                    <Users size={40} strokeWidth={1.2} className={s.emptyIcon} />
                    <p className={s.emptyTitle}>Tidak ada pengguna</p>
                    <p className={s.emptySub}>Coba ubah filter</p>
                  </div>
                </td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                      <div className={s.userAvatar}>{getInitials(u.nama)}</div>
                      <span style={{ fontWeight: 600 }}>{u.nama}</span>
                    </div>
                  </td>
                  <td style={{ color:'var(--color-text-muted)', fontFamily:'monospace', fontSize:13 }}>@{u.username}</td>
                  <td><span className={ROLE_CLASS[u.role] ?? s.roleKasir}>{ROLE_LABELS[u.role] ?? u.role}</span></td>
                  <td style={{ fontSize:13, color:'var(--color-text-muted)' }}>
                    {u.cabang?.nama ?? <span style={{ color:'var(--color-text-disabled)' }}>Semua Cabang</span>}
                  </td>
                  <td>
                    <label className={s.toggle}>
                      <input type="checkbox" checked={u.aktif} onChange={() => handleToggleAktif(u.id)} aria-label={`Toggle akun ${u.nama}`} />
                      <span className={s.toggleSlider} />
                    </label>
                  </td>
                  <td>
                    <div className={s.actionBtns}>
                      <button type="button" className={s.editBtn} onClick={() => openEdit(u)} title="Edit">
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                      <button type="button" className={s.deleteBtn} onClick={() => { setDeleteTarget(u); setShowDelete(true); }} title="Hapus">
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
          <span>Menampilkan {filtered.length} dari {users.length} pengguna</span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editTarget ? `Edit Pengguna — ${editTarget.nama}` : 'Tambah Pengguna Baru'} size="md">
        <form className={s.modalForm} onSubmit={handleSave}>
          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="u-nama">Nama Lengkap *</label>
              <input id="u-nama" type="text" className={s.fieldInput} placeholder="cth: Budi Santoso"
                value={form.nama} onChange={(e) => handleFormChange('nama', e.target.value)} required />
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="u-user">Username *</label>
              <input id="u-user" type="text" className={s.fieldInput} placeholder="cth: budi"
                value={form.username} onChange={(e) => handleFormChange('username', e.target.value.toLowerCase())} required />
            </div>
          </div>

          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="u-role">Role *</label>
              <select id="u-role" className={s.fieldSelect}
                value={form.role} onChange={(e) => handleFormChange('role', e.target.value)}>
                {ROLE_OPTS.filter((o) => o.value !== 'semua').map((o) =>
                  <option key={o.value} value={o.value}>{o.label}</option>
                )}
              </select>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="u-cabang">Cabang</label>
              <select id="u-cabang" className={s.fieldSelect}
                value={form.cabangId} onChange={(e) => handleFormChange('cabangId', e.target.value)}>
                <option value="">— Semua Cabang —</option>
                {DUMMY_CABANG.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
              </select>
            </div>
          </div>

          <div className={s.field}>
            <label className={s.fieldLabel} htmlFor="u-pass">
              {editTarget ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password *'}
            </label>
            <input id="u-pass" type="password" className={s.fieldInput}
              placeholder={editTarget ? '••••••••' : 'min. 6 karakter'}
              value={form.password} onChange={(e) => handleFormChange('password', e.target.value)}
              required={!editTarget} />
          </div>

          <div className={s.toggleField}>
            <div>
              <p className={s.toggleFieldLabel}>Akun Aktif</p>
              <p className={s.toggleFieldSub}>Pengguna dapat login ke sistem</p>
            </div>
            <label className={s.toggle}>
              <input type="checkbox" checked={form.aktif}
                onChange={(e) => handleFormChange('aktif', e.target.checked)} />
              <span className={s.toggleSlider} />
            </label>
          </div>

          <div className={s.modalActions}>
            <button type="button" className={s.cancelBtn} onClick={() => setShowModal(false)}>Batal</button>
            <button type="submit" className={s.saveBtn} disabled={!form.nama || !form.username}>
              {editTarget ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Hapus Pengguna" size="sm">
        <div className={s.deleteConfirm}>
          <p className={s.deleteText}>
            Yakin ingin menghapus akun{' '}
            <span className={s.deleteStrong}>@{deleteTarget?.username}</span>?
            <br />Pengguna tidak dapat login setelah dihapus.
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

export default ManajemenUser;
