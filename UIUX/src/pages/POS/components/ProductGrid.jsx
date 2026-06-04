import { useState } from 'react';
import { Search, PackageSearch } from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';
import { searchProducts } from '../../../data/products';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

// ============================================================
// PRODUCT GRID — Panel tengah POS
// ============================================================

function ProductGrid({ activeCategory }) {
  const [query, setQuery] = useState('');
  const debouncedQuery    = useDebounce(query, 300);

  const products = searchProducts(debouncedQuery, activeCategory);

  return (
    <section className={styles.panel} aria-label="Daftar produk">

      {/* === SEARCH BAR === */}
      <div className={styles.searchBar}>
        <Search size={16} className={styles.searchIcon} strokeWidth={2.5} />
        <input
          id          = "pos-search"
          type        = "search"
          placeholder = "Cari produk... (nama)"
          value       = {query}
          onChange    = {(e) => setQuery(e.target.value)}
          className   = {styles.searchInput}
          autoComplete= "off"
          spellCheck  = {false}
        />
        {query && (
          <button
            type      = "button"
            className = {styles.clearBtn}
            onClick   = {() => setQuery('')}
            aria-label= "Hapus pencarian"
          >
            ×
          </button>
        )}
      </div>

      {/* === RESULTS COUNT === */}
      <div className={styles.resultBar}>
        <span className={styles.resultCount}>
          {products.length} produk
          {debouncedQuery && ` untuk "${debouncedQuery}"`}
        </span>
      </div>

      {/* === PRODUCT GRID === */}
      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <PackageSearch size={40} strokeWidth={1.2} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>Produk tidak ditemukan</p>
          <p className={styles.emptySub}>Coba kata kunci lain atau pilih kategori berbeda</p>
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
