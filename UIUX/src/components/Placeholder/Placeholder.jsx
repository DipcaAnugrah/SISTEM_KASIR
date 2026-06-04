import { Construction } from 'lucide-react';

// ============================================================
// PLACEHOLDER — Halaman dalam pengembangan
// Digunakan oleh: Laporan, Manajemen, Sistem
// ============================================================

function Placeholder({ title = 'Halaman ini sedang dalam pengembangan', icon: Icon = Construction }) {
  return (
    <div
      style={{
        display       : 'flex',
        flexDirection : 'column',
        alignItems    : 'center',
        justifyContent: 'center',
        minHeight     : '60vh',
        gap           : '16px',
        color         : 'var(--color-text-muted)',
        textAlign     : 'center',
        padding       : '32px',
      }}
      className="page-enter"
    >
      <div
        style={{
          width          : 80,
          height         : 80,
          background     : 'var(--color-bg-secondary)',
          borderRadius   : '50%',
          display        : 'flex',
          alignItems     : 'center',
          justifyContent : 'center',
          color          : 'var(--color-border-strong)',
        }}
      >
        <Icon size={36} strokeWidth={1.2} />
      </div>
      <div>
        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
          Segera Hadir
        </p>
        <p style={{ fontSize: 14, maxWidth: 320, lineHeight: 1.6 }}>{title}</p>
      </div>
      <p
        style={{
          display      : 'inline-block',
          background   : 'var(--color-primary-light)',
          color        : 'var(--color-primary)',
          padding      : '4px 14px',
          borderRadius : 'var(--radius-full)',
          fontSize     : 12.5,
          fontWeight   : 600,
        }}
      >
        Tahap Berikutnya
      </p>
    </div>
  );
}

export default Placeholder;
