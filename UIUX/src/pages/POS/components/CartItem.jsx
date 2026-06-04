import { useState } from 'react';
import { Minus, Plus, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { formatRupiah } from '../../../utils/format';
import styles from './CartItem.module.css';

// ============================================================
// CART ITEM — satu baris item di keranjang
// ============================================================

function CartItem({ item }) {
  const { updateQty, removeItem, updateNote } = useCart();
  const [showNote, setShowNote] = useState(!!item.catatan);

  return (
    <li className={styles.item}>
      {/* === TOP ROW === */}
      <div className={styles.top}>
        {/* Emoji + Nama */}
        <div className={styles.nameWrap}>
          <span className={styles.emoji} aria-hidden="true">{item.emoji}</span>
          <span className={styles.nama}>{item.nama}</span>
        </div>

        {/* Hapus */}
        <button
          type      = "button"
          className = {styles.removeBtn}
          onClick   = {() => removeItem(item.productId)}
          aria-label= {`Hapus ${item.nama} dari keranjang`}
          title     = "Hapus"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* === QTY + HARGA ROW === */}
      <div className={styles.qtyRow}>
        {/* Stepper */}
        <div className={styles.stepper}>
          <button
            type      = "button"
            className = {styles.stepBtn}
            onClick   = {() => updateQty(item.productId, item.qty - 1)}
            aria-label= "Kurangi"
          >
            <Minus size={14} strokeWidth={2.5} />
          </button>
          <span className={styles.qty} aria-live="polite">{item.qty}</span>
          <button
            type      = "button"
            className = {styles.stepBtn}
            onClick   = {() => updateQty(item.productId, item.qty + 1)}
            aria-label= "Tambah"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Subtotal item */}
        <span className={styles.subtotal}>
          {formatRupiah(item.harga * item.qty)}
        </span>
      </div>

      {/* === CATATAN TOGGLE === */}
      <button
        type      = "button"
        className = {styles.noteToggle}
        onClick   = {() => setShowNote((v) => !v)}
      >
        <ChevronDown
          size      = {12}
          strokeWidth={2.5}
          className = {`${styles.noteChevron} ${showNote ? styles.open : ''}`}
        />
        <span>{item.catatan || 'Tambah catatan...'}</span>
      </button>

      {showNote && (
        <textarea
          className   = {styles.noteInput}
          placeholder = "Catatan untuk item ini (misal: less sugar, extra ice)"
          value       = {item.catatan}
          onChange    = {(e) => updateNote(item.productId, e.target.value)}
          rows        = {2}
          maxLength   = {100}
          aria-label  = {`Catatan untuk ${item.nama}`}
        />
      )}
    </li>
  );
}

export default CartItem;
