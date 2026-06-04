import { Grid3X3 } from 'lucide-react';
import { CATEGORIES } from '../../../data/categories';
import { useCart } from '../../../hooks/useCart';
import styles from './CategoryPanel.module.css';

// ============================================================
// CATEGORY PANEL — POS kiri
// ============================================================

function CategoryPanel({ activeCategory, onSelect }) {
  const { getQty } = useCart();

  return (
    <aside className={styles.panel} aria-label="Filter kategori">
      <p className={styles.label}>Kategori</p>
      <ul className={styles.list}>
        {CATEGORIES.map((cat) => {
          const Icon    = cat.icon;
          const isActive = cat.id === activeCategory;
          return (
            <li key={cat.id}>
              <button
                type      = "button"
                id        = {`cat-${cat.id}`}
                className = {`${styles.btn} ${isActive ? styles.active : ''}`}
                onClick   = {() => onSelect(cat.id)}
                style     = {isActive ? { '--cat-color': cat.color } : {}}
                aria-pressed={isActive}
              >
                <span className={styles.iconWrap} aria-hidden="true">
                  {Icon
                    ? <Icon size={18} strokeWidth={1.8} />
                    : <Grid3X3 size={18} strokeWidth={1.8} />
                  }
                </span>
                <span className={styles.btnLabel}>{cat.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default CategoryPanel;
