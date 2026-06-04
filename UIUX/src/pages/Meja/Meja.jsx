import { useState, useRef, useEffect } from 'react';
import {
  Users, Clock, CheckCircle, LogIn, Banknote,
  Pencil, Plus, Trash2, Check, X,
} from 'lucide-react';
import { useUI }               from '../../hooks/useUI';
import { DUMMY_TABLES, STATUS_LABELS } from '../../data/tables';
import Modal                    from '../../components/Modal/Modal';
import styles                   from './Meja.module.css';

// ============================================================
// MANAJEMEN MEJA — dengan inline rename + tambah/hapus meja
// ============================================================

let nextId = 11; // ID counter untuk meja baru

export default function Meja() {
  const { toast } = useUI();

  const [tables,    setTables   ] = useState(DUMMY_TABLES);
  const [showAdd,   setShowAdd  ] = useState(false);
  const [addForm,   setAddForm  ] = useState({ nomor: '', nama: '', kapasitas: 4 });

  // === Stats ===
  const kosong = tables.filter((t) => t.status === 'kosong').length;
  const terisi = tables.filter((t) => t.status === 'terisi').length;
  const bayar  = tables.filter((t) => t.status === 'menunggu_bayar').length;

  // === Update status meja ===
  const updateStatus = (id, status) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status, durasi: status === 'kosong' ? null : status === 'terisi' ? 0 : t.durasi }
          : t
      )
    );
    const labels = { kosong: 'dikosongkan', terisi: 'dibuka', menunggu_bayar: 'ditagih' };
    toast.success(`Meja berhasil ${labels[status]}`);
  };

  // === Rename (nama custom) ===
  const updateNama = (id, nama) => {
    setTables((prev) =>
      prev.map((t) => t.id === id ? { ...t, nama } : t)
    );
  };

  // === Update kapasitas ===
  const updateKapasitas = (id, kapasitas) => {
    setTables((prev) =>
      prev.map((t) => t.id === id ? { ...t, kapasitas } : t)
    );
  };

  // === Hapus meja (hanya jika kosong) ===
  const deleteMeja = (id) => {
    const meja = tables.find((t) => t.id === id);
    if (meja.status !== 'kosong') {
      toast.error('Meja hanya bisa dihapus saat berstatus Kosong');
      return;
    }
    setTables((prev) => prev.filter((t) => t.id !== id));
    toast.success('Meja berhasil dihapus');
  };

  // === Tambah meja baru ===
  const handleAddMeja = (e) => {
    e.preventDefault();
    if (!addForm.nomor.trim()) { toast.error('Nomor meja wajib diisi'); return; }
    const isDupe = tables.some(
      (t) => t.nomor.toLowerCase() === addForm.nomor.trim().toLowerCase()
    );
    if (isDupe) { toast.error('Nomor meja sudah ada'); return; }

    const newTable = {
      id       : `m${String(nextId++).padStart(2,'0')}`,
      nomor    : addForm.nomor.trim().toUpperCase(),
      nama     : addForm.nama.trim(),
      kapasitas: Number(addForm.kapasitas) || 4,
      status   : 'kosong',
      durasi   : null,
    };
    setTables((prev) => [...prev, newTable]);
    setAddForm({ nomor: '', nama: '', kapasitas: 4 });
    setShowAdd(false);
    toast.success(`Meja ${newTable.nomor} berhasil ditambahkan`);
  };

  const STATS = [
    { label: 'Total Meja',     value: tables.length, cls: 'semua' },
    { label: 'Kosong',         value: kosong,         cls: 'kosong' },
    { label: 'Terisi',         value: terisi,         cls: 'terisi' },
    { label: 'Menunggu Bayar', value: bayar,          cls: 'bayar'  },
  ];

  return (
    <div className="page-enter">

      {/* === STATS === */}
      <div className={styles.statsGrid}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <span className={`${styles.statDot} ${styles[s.cls]}`} />
            <div>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* === TOOLBAR: Legend + Tambah Meja === */}
      <div className={styles.legendBar}>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-5)', flexWrap:'wrap', flex:1 }}>
          {['kosong','terisi','bayar'].map((cls) => (
            <span key={cls} className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles[cls]}`} />
              {cls === 'kosong' ? 'Kosong' : cls === 'terisi' ? 'Terisi' : 'Menunggu Bayar'}
            </span>
          ))}
          <span className={styles.legendItem} style={{ color:'var(--color-text-muted)', fontSize:12 }}>
            · Klik ✏️ pada kartu untuk mengganti nama meja
          </span>
        </div>

        {/* Tambah Meja button */}
        <button
          id        = "btn-tambah-meja"
          type      = "button"
          className = {styles.addMejaBtn}
          onClick   = {() => setShowAdd(true)}
        >
          <Plus size={15} strokeWidth={2.5} />
          Tambah Meja
        </button>
      </div>

      {/* === TABLE GRID === */}
      <div className={styles.tableGrid}>
        {tables.map((table) => (
          <TableCard
            key           = {table.id}
            table         = {table}
            onOpen        = {() => updateStatus(table.id, 'terisi')}
            onTagih       = {() => updateStatus(table.id, 'menunggu_bayar')}
            onKosongkan   = {() => updateStatus(table.id, 'kosong')}
            onRename      = {(nama) => updateNama(table.id, nama)}
            onKapasitas   = {(kap) => updateKapasitas(table.id, kap)}
            onDelete      = {() => deleteMeja(table.id)}
          />
        ))}
      </div>

      {/* === TAMBAH MEJA MODAL === */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Tambah Meja Baru" size="sm">
        <form
          onSubmit  = {handleAddMeja}
          style     = {{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}
        >
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-3)' }}>
            <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--color-text)' }} htmlFor="add-nomor">
                Nomor Meja *
              </label>
              <input
                id          = "add-nomor"
                type        = "text"
                placeholder = "cth: M11"
                value       = {addForm.nomor}
                onChange    = {(e) => setAddForm({ ...addForm, nomor: e.target.value })}
                style       = {{
                  background  :'var(--color-bg)',
                  border      :'1.5px solid var(--color-border)',
                  borderRadius:'var(--radius-md)',
                  padding     :'10px 14px',
                  fontSize    : 13.5,
                  color       :'var(--color-text)',
                  outline     :'none',
                  fontFamily  :'inherit',
                  width       :'100%',
                }}
                required
                autoFocus
              />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--color-text)' }} htmlFor="add-kap">
                Kapasitas
              </label>
              <input
                id          = "add-kap"
                type        = "number"
                min         = "1"
                max         = "20"
                placeholder = "4"
                value       = {addForm.kapasitas}
                onChange    = {(e) => setAddForm({ ...addForm, kapasitas: e.target.value })}
                style       = {{
                  background  :'var(--color-bg)',
                  border      :'1.5px solid var(--color-border)',
                  borderRadius:'var(--radius-md)',
                  padding     :'10px 14px',
                  fontSize    :13.5,
                  color       :'var(--color-text)',
                  outline     :'none',
                  fontFamily  :'inherit',
                  width       :'100%',
                }}
              />
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
            <label style={{ fontSize:13, fontWeight:600, color:'var(--color-text)' }} htmlFor="add-nama">
              Nama / Label <span style={{ fontWeight:400, color:'var(--color-text-muted)' }}>(opsional)</span>
            </label>
            <input
              id          = "add-nama"
              type        = "text"
              placeholder = "cth: VIP Room, Teras Depan, Lesehan..."
              value       = {addForm.nama}
              onChange    = {(e) => setAddForm({ ...addForm, nama: e.target.value })}
              style       = {{
                background  :'var(--color-bg)',
                border      :'1.5px solid var(--color-border)',
                borderRadius:'var(--radius-md)',
                padding     :'10px 14px',
                fontSize    :13.5,
                color       :'var(--color-text)',
                outline     :'none',
                fontFamily  :'inherit',
                width       :'100%',
              }}
            />
          </div>

          <div style={{ display:'flex', gap:'var(--space-3)', justifyContent:'flex-end' }}>
            <button
              type      = "button"
              onClick   = {() => setShowAdd(false)}
              style     = {{
                padding     :'10px 20px',
                border      :'1px solid var(--color-border)',
                borderRadius:'var(--radius-md)',
                fontSize    :14,
                fontWeight  :600,
                color       :'var(--color-text-muted)',
                background  :'var(--color-card)',
              }}
            >
              Batal
            </button>
            <button
              type  = "submit"
              style = {{
                padding     :'10px 24px',
                background  :'var(--color-primary)',
                color       :'#fff',
                borderRadius:'var(--radius-md)',
                fontSize    :14,
                fontWeight  :700,
                boxShadow   :'0 2px 8px rgba(37,99,235,0.25)',
              }}
            >
              Tambah Meja
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ============================================================
// TABLE CARD — dengan inline rename + edit kapasitas + hapus
// ============================================================

function TableCard({ table, onOpen, onTagih, onKosongkan, onRename, onKapasitas, onDelete }) {
  const isKosong = table.status === 'kosong';
  const isTerisi = table.status === 'terisi';
  const isBayar  = table.status === 'menunggu_bayar';

  // === Inline rename state ===
  const [renaming,  setRenaming ] = useState(false);
  const [namaInput, setNamaInput] = useState(table.nama || '');
  const inputRef = useRef(null);

  // Fokus input saat mulai rename
  useEffect(() => {
    if (renaming && inputRef.current) inputRef.current.focus();
  }, [renaming]);

  const startRename = (e) => {
    e.stopPropagation();
    setNamaInput(table.nama || '');
    setRenaming(true);
  };

  const commitRename = () => {
    onRename(namaInput.trim());
    setRenaming(false);
  };

  const cancelRename = () => {
    setNamaInput(table.nama || '');
    setRenaming(false);
  };

  const handleRenameKey = (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); commitRename(); }
    if (e.key === 'Escape') { cancelRename(); }
  };

  // === Edit kapasitas inline ===
  const [editKap, setEditKap] = useState(false);
  const [kapInput, setKapInput] = useState(String(table.kapasitas));
  const kapRef = useRef(null);

  useEffect(() => {
    if (editKap && kapRef.current) kapRef.current.focus();
  }, [editKap]);

  const commitKap = () => {
    const val = parseInt(kapInput);
    if (!isNaN(val) && val > 0) onKapasitas(val);
    setEditKap(false);
  };

  // Display name: nama custom jika ada, fallback ke nomor
  const displayName = table.nama?.trim() || table.nomor;
  const hasCustomName = !!table.nama?.trim();

  return (
    <article className={`${styles.tableCard} ${styles[table.status]}`}>

      {/* === HEADER: Rename area + status dot + delete === */}
      <div className={styles.tableHeader}>
        <div className={styles.tableNameWrap}>
          {/* Nomor (selalu tampil kecil) */}
          {hasCustomName && (
            <span className={styles.tableNomorBadge}>{table.nomor}</span>
          )}

          {/* Nama / inline edit */}
          {renaming ? (
            <div className={styles.renameGroup}>
              <input
                ref         = {inputRef}
                type        = "text"
                className   = {styles.renameInput}
                value       = {namaInput}
                onChange    = {(e) => setNamaInput(e.target.value)}
                onKeyDown   = {handleRenameKey}
                onBlur      = {commitRename}
                placeholder = {`Nama meja (default: ${table.nomor})`}
                maxLength   = {24}
                aria-label  = "Ubah nama meja"
              />
              <button type="button" className={styles.renameOk}   onClick={commitRename}><Check size={13} strokeWidth={3} /></button>
              <button type="button" className={styles.renameCancel} onClick={cancelRename}><X size={13} strokeWidth={3} /></button>
            </div>
          ) : (
            <button
              type      = "button"
              className = {styles.tableNomorBtn}
              onClick   = {startRename}
              title     = {hasCustomName ? `Nama: ${table.nama} · Klik untuk ubah` : 'Klik untuk beri nama'}
              aria-label= "Ubah nama meja"
            >
              <span className={styles.tableNomor}>{displayName}</span>
              <Pencil size={11} strokeWidth={2.5} className={styles.renameHint} />
            </button>
          )}
        </div>

        {/* Status dot + delete (hanya meja kosong) */}
        <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
          {isKosong && (
            <button
              type      = "button"
              className = {styles.deleteBtn}
              onClick   = {onDelete}
              title     = "Hapus meja"
              aria-label= "Hapus meja"
            >
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          )}
          <span className={`${styles.statusIndicator} ${styles[table.status]}`} aria-hidden="true" />
        </div>
      </div>

      {/* === BODY === */}
      <div className={styles.tableBody}>

        {/* Kapasitas — klik untuk edit */}
        {editKap ? (
          <div className={styles.kapEditGroup}>
            <Users size={12} strokeWidth={2.5} />
            <input
              ref       = {kapRef}
              type      = "number"
              min       = "1"
              max       = "20"
              className = {styles.kapInput}
              value     = {kapInput}
              onChange  = {(e) => setKapInput(e.target.value)}
              onBlur    = {commitKap}
              onKeyDown = {(e) => { if (e.key === 'Enter') commitKap(); if (e.key === 'Escape') setEditKap(false); }}
              aria-label= "Kapasitas meja"
            />
            <span style={{ fontSize:11, color:'var(--color-text-muted)' }}>orang</span>
          </div>
        ) : (
          <button
            type      = "button"
            className = {styles.kapasitasBtn}
            onClick   = {() => { setKapInput(String(table.kapasitas)); setEditKap(true); }}
            title     = "Klik untuk ubah kapasitas"
            aria-label= "Ubah kapasitas meja"
          >
            <Users size={12} strokeWidth={2.5} />
            {table.kapasitas} orang
            <Pencil size={9} strokeWidth={2.5} className={styles.renameHint} />
          </button>
        )}

        {/* Status label */}
        <span className={`${styles.statusLabel} ${styles[table.status]}`}>
          {STATUS_LABELS[table.status].label}
        </span>

        {/* Durasi */}
        {table.durasi !== null && (
          <span className={styles.durasi}>
            <Clock size={11} strokeWidth={2.5} />
            {table.durasi === 0 ? 'Baru dibuka' : `${table.durasi} mnt`}
          </span>
        )}
      </div>

      {/* === FOOTER: Actions === */}
      <div className={styles.tableFooter}>
        {isKosong && (
          <button
            type      = "button"
            className = {`${styles.tableBtn} ${styles.tableBtnPrimary}`}
            onClick   = {onOpen}
            aria-label= {`Buka ${displayName}`}
          >
            <LogIn size={12} strokeWidth={2.5} />
            Buka
          </button>
        )}
        {isTerisi && (
          <>
            <button type="button" className={`${styles.tableBtn} ${styles.tableBtnGhost}`} onClick={onTagih}>
              <Banknote size={12} strokeWidth={2.5} />
              Tagih
            </button>
            <button type="button" className={`${styles.tableBtn} ${styles.tableBtnDanger}`} onClick={onKosongkan}>
              Kosong
            </button>
          </>
        )}
        {isBayar && (
          <button type="button" className={`${styles.tableBtn} ${styles.tableBtnPrimary}`} onClick={onKosongkan}>
            <CheckCircle size={12} strokeWidth={2.5} />
            Selesai
          </button>
        )}
      </div>
    </article>
  );
}
