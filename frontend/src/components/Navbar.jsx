import React from 'react';
import { Search, Flame, RefreshCw, Award, Target, Sun, Moon } from 'lucide-react';

export default function Navbar({ activeTab, onRefresh, stats, searchQuery, setSearchQuery, theme, toggleTheme }) {
  const titles = {
    dashboard: 'Dashboard & Daily Analytics',
    dsa: 'DSA Problems Hub (Striver A2Z)',
    core: 'Core CS Subjects',
    project: 'Projects Vault',
    apply: 'Job Applications Tracker',
    communication: 'Communication & STAR Method'
  };

  return (
    <header className="app-navbar">
      {/* Title */}
      <div className="navbar-title">
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {titles[activeTab] || 'PrepPulse OS'}
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Track daily problems, efficiency, and interview readiness
        </p>
      </div>

      {/* Global Search & Metrics Bar */}
      <div className="navbar-metrics" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div className="navbar-search" style={{ position: 'relative', width: '260px' }}>
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

        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="fluent-btn fluent-btn-secondary"
          style={{ height: '38px', padding: '0 12px' }}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={16} color="#F2C94C" /> : <Moon size={16} color="#8764B8" />}
        </button>
      </div>
    </header>
  );
}
