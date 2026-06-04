import { useState } from 'react';
import CategoryPanel from './components/CategoryPanel';
import ProductGrid   from './components/ProductGrid';
import CartPanel     from './components/CartPanel';
import CashModal     from './components/CashModal';
import QRISModal     from './components/QRISModal';
import styles from './POS.module.css';

// ============================================================
// POS PAGE — Warkop Djoeragan POS
// 3-panel layout: Kategori | Produk | Keranjang
// ============================================================

function POS() {
  const [activeCategory, setActiveCategory] = useState('semua');
  const [showCash, setShowCash]             = useState(false);
  const [showQRIS, setShowQRIS]             = useState(false);

  return (
    <div className={styles.layout}>
      {/* Panel kiri: kategori */}
      <CategoryPanel
        activeCategory = {activeCategory}
        onSelect       = {setActiveCategory}
      />

      {/* Panel tengah: produk + search */}
      <ProductGrid activeCategory={activeCategory} />

      {/* Panel kanan: keranjang + bayar */}
      <CartPanel
        onPayCash = {() => setShowCash(true)}
        onPayQRIS = {() => setShowQRIS(true)}
      />

      {/* Modal pembayaran tunai */}
      <CashModal
        isOpen  = {showCash}
        onClose = {() => setShowCash(false)}
      />

      {/* Modal pembayaran QRIS */}
      <QRISModal
        isOpen  = {showQRIS}
        onClose = {() => setShowQRIS(false)}
      />
    </div>
  );
}

export default POS;
