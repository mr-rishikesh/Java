import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = '#00BCF2', progress = null }) {
  return (
    <div className="fluent-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {value}
        </div>
        {subtext && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtext}
          </p>
        )}
      </div>

      {progress !== null && (
        <div style={{ width: '100%', marginTop: '4px' }}>
          <div style={{ height: '6px', width: '100%', background: 'var(--fluent-surface-3)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: `linear-gradient(90deg, ${color}, #00BCF2)`,
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
