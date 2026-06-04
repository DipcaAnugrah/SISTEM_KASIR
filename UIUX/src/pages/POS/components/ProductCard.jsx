import { useCart } from '../../../hooks/useCart';
import { formatRupiah } from '../../../utils/format';
import styles from './ProductCard.module.css';

// ============================================================
// PRODUCT CARD — tap langsung add to cart
// ============================================================

function ProductCard({ product }) {
  const { addItem, getQty } = useCart();
  const qty = getQty(product.id);

  const handleTap = () => {
    addItem(product);
  };

  return (
    <article
      className = {`${styles.card} ${qty > 0 ? styles.inCart : ''}`}
      onClick   = {handleTap}
      role      = "button"
      tabIndex  = {0}
      onKeyDown = {(e) => e.key === 'Enter' && handleTap()}
      aria-label= {`Tambah ${product.nama} ke keranjang, Rp ${product.harga.toLocaleString('id-ID')}`}
    >
      {/* Qty Badge */}
      {qty > 0 && (
        <span className={styles.badge} aria-label={`${qty} di keranjang`}>
          {qty}
        </span>
      )}

      {/* Emoji Icon */}
      <div className={styles.emoji} aria-hidden="true">
        {product.emoji}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.nama}>{product.nama}</p>
        <p className={styles.harga}>{formatRupiah(product.harga)}</p>
      </div>

      {/* Tap ripple indicator */}
      <div className={styles.ripple} aria-hidden="true" />
    </article>
  );
}

export default ProductCard;
