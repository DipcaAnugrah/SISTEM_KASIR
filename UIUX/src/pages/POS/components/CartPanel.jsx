import { useState } from 'react';
import { ShoppingCart, Banknote, QrCode, Trash2, ChevronDown } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { formatRupiah } from '../../../utils/format';
import { DUMMY_TABLES } from '../../../data/tables';
import CartItem from './CartItem';
import styles from './CartPanel.module.css';

// ============================================================
// CART PANEL — Panel kanan POS (keranjang + pembayaran)
// ============================================================

function CartPanel({ onPayCash, onPayQRIS }) {
  const {
    items, discount, tableId,
    subtotal, discountAmount, total, itemCount,
    setDiscount, setTable, clearCart,
  } = useCart();

  const [discountType, setDiscountType] = useState('nominal');
  const [discountInput, setDiscountInput] = useState('');

  const handleDiscountChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setDiscountInput(val);
    setDiscount(discountType, Number(val));
  };

  const handleDiscountTypeChange = (type) => {
    setDiscountType(type);
    setDiscountInput('');
    setDiscount(type, 0);
  };

  const isEmpty = items.length === 0;

  return (
    <aside className={styles.panel} aria-label="Keranjang belanja">

      {/* === HEADER === */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <ShoppingCart size={18} strokeWidth={2} />
          <span className={styles.headerTitle}>Keranjang</span>
          {itemCount > 0 && (
            <span className={styles.itemCount}>{itemCount}</span>
          )}
        </div>

        {/* Pilih Meja */}
        <div className={styles.tableSelect}>
          <select
            id        = "pos-table-select"
            value     = {tableId ?? ''}
            onChange  = {(e) => setTable(e.target.value || null)}
            className = {styles.select}
            aria-label= "Pilih meja"
          >
            <option value="">Pilih Meja</option>
            {DUMMY_TABLES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nama?.trim() ? `${t.nomor} · ${t.nama}` : t.nomor} ({t.kapasitas} org)
              </option>
            ))}

          </select>
          <ChevronDown size={12} className={styles.selectIcon} />
        </div>
      </div>

      {/* === ITEM LIST === */}
      <div className={styles.itemList}>
        {isEmpty ? (
          <div className={styles.empty}>
            <ShoppingCart size={36} strokeWidth={1.2} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Keranjang kosong</p>
            <p className={styles.emptySub}>Tap produk untuk menambahkan</p>
          </div>
        ) : (
          <ul>
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </ul>
        )}
      </div>

      {/* === SUMMARY & ACTIONS (sticky bottom) === */}
      {!isEmpty && (
        <div className={styles.footer}>

          {/* Subtotal */}
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Subtotal</span>
            <span className={styles.summaryValue}>{formatRupiah(subtotal)}</span>
          </div>

          {/* Diskon */}
          <div className={styles.discountRow}>
            <span className={styles.summaryLabel}>Diskon</span>
            <div className={styles.discountInput}>
              {/* Type toggle */}
              <div className={styles.discountTypePill}>
                <button
                  type      = "button"
                  className = {`${styles.typeBtn} ${discountType === 'nominal' ? styles.typeActive : ''}`}
                  onClick   = {() => handleDiscountTypeChange('nominal')}
                >Rp</button>
                <button
                  type      = "button"
                  className = {`${styles.typeBtn} ${discountType === 'persen' ? styles.typeActive : ''}`}
                  onClick   = {() => handleDiscountTypeChange('persen')}
                >%</button>
              </div>
              <input
                type        = "text"
                inputMode   = "numeric"
                className   = {styles.discountField}
                value       = {discountInput}
                onChange    = {handleDiscountChange}
                placeholder = {discountType === 'nominal' ? '0' : '0'}
                maxLength   = {discountType === 'persen' ? 3 : 8}
                aria-label  = "Nilai diskon"
              />
            </div>
          </div>

          {discountAmount > 0 && (
            <div className={styles.summaryRow}>
              <span className={styles.discountLabel}>Potongan</span>
              <span className={styles.discountValue}>−{formatRupiah(discountAmount)}</span>
            </div>
          )}

          {/* Divider */}
          <div className={styles.divider} />

          {/* Total */}
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{formatRupiah(total)}</span>
          </div>

          {/* Payment Buttons */}
          <div className={styles.payBtns}>
            <button
              id        = "btn-pay-cash"
              type      = "button"
              className = {`${styles.payBtn} ${styles.cashBtn}`}
              onClick   = {onPayCash}
              disabled  = {isEmpty}
            >
              <Banknote size={18} strokeWidth={2} />
              <span>Cash</span>
            </button>
            <button
              id        = "btn-pay-qris"
              type      = "button"
              className = {`${styles.payBtn} ${styles.qrisBtn}`}
              onClick   = {onPayQRIS}
              disabled  = {isEmpty}
            >
              <QrCode size={18} strokeWidth={2} />
              <span>QRIS</span>
            </button>
          </div>

          {/* Clear cart */}
          <button
            type      = "button"
            className = {styles.clearBtn}
            onClick   = {clearCart}
            title     = "Kosongkan keranjang"
          >
            <Trash2 size={14} strokeWidth={2} />
            <span>Kosongkan</span>
          </button>
        </div>
      )}
    </aside>
  );
}

export default CartPanel;
