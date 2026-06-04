import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './KPICard.module.css';

// ============================================================
// KPI CARD — Warkop Djoeragan POS
// Props: icon, label, value, trend, color, prefix, suffix
// ============================================================

function KPICard({ icon: Icon, label, value, trend, color = 'primary', prefix = '', suffix = '' }) {
  const trendDir = trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat';
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <article className={`${styles.card} ${styles[color]}`}>
      {/* === TOP ROW === */}
      <div className={styles.top}>
        {/* Icon */}
        <div className={`${styles.iconWrap} ${styles[color]}`} aria-hidden="true">
          {Icon && <Icon size={22} strokeWidth={1.8} />}
        </div>

        {/* Trend badge */}
        {trend !== undefined && (
          <div className={`${styles.trend} ${styles[trendDir]}`} title={`${trend > 0 ? '+' : ''}${trend}% vs kemarin`}>
            <TrendIcon size={12} strokeWidth={2.5} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      {/* === VALUE === */}
      <p className={styles.value}>
        {prefix}{typeof value === 'number' ? value.toLocaleString('id-ID') : value}{suffix}
      </p>

      {/* === LABEL === */}
      <p className={styles.label}>{label}</p>
    </article>
  );
}

export default KPICard;
