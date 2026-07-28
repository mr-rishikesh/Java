import React from 'react';
import { Search, Flame, RefreshCw, Award, Target } from 'lucide-react';

export default function Navbar({ activeTab, onRefresh, stats, searchQuery, setSearchQuery }) {
  const titles = {
    dashboard: 'Dashboard & Daily Analytics',
    dsa: 'DSA Problems Hub (Striver A2Z)',
    core: 'Core CS Subjects',
    project: 'Projects Vault',
    apply: 'Job Applications Tracker',
    communication: 'Communication & STAR Method'
  };

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'rgba(18, 24, 36, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--fluent-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {titles[activeTab] || 'PrepPulse OS'}
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Track daily problems, efficiency, and interview readiness
        </p>
      </div>

      {/* Global Search & Metrics Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search problems, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="fluent-input"
            style={{ paddingLeft: '36px', height: '38px' }}
          />
        </div>

        {/* Daily Streak Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(242, 201, 76, 0.12)',
          border: '1px solid rgba(242, 201, 76, 0.3)',
          color: '#F2C94C',
          fontWeight: 700,
          fontSize: '0.85rem'
        }}>
          <Flame size={18} fill="#F2C94C" />
          <span>{stats?.streak || 7} Day Streak</span>
        </div>

        {/* Daily Efficiency Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(0, 188, 242, 0.12)',
          border: '1px solid rgba(0, 188, 242, 0.3)',
          color: '#00BCF2',
          fontWeight: 700,
          fontSize: '0.85rem'
        }}>
          <Award size={18} />
          <span>{stats?.avgEfficiency || 88}% Avg Eff</span>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="fluent-btn fluent-btn-secondary"
          style={{ height: '38px', padding: '0 12px' }}
          title="Refresh Data & Daily Picks"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  );
}
