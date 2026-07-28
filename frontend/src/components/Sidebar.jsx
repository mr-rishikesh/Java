import React from 'react';
import { 
  LayoutDashboard, 
  Code2, 
  Cpu, 
  FolderGit2, 
  Briefcase, 
  MessageSquare,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'dsa', label: 'DSA Hub', icon: Code2, badge: '474 Sheet' },
    { id: 'core', label: 'Core CS', icon: Cpu, badge: '5 Topics' },
    { id: 'project', label: 'Projects', icon: FolderGit2, badge: null },
    { id: 'apply', label: 'Applications', icon: Briefcase, badge: 'Tracker' },
    { id: 'communication', label: 'Communication', icon: MessageSquare, badge: 'STAR' },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--fluent-surface-1)',
      borderRight: '1px solid var(--fluent-border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      minHeight: '100vh',
      padding: '20px 16px'
    }}>
      {/* Brand Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 8px 24px 8px',
        borderBottom: '1px solid var(--fluent-border)',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0078D4, #00BCF2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 188, 242, 0.4)'
        }}>
          <Zap size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #F3F4F6, #00BCF2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PrepPulse
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Fluent Prep OS v1.0
          </p>
        </div>
      </div>

      {/* Navigation Section Label */}
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, padding: '0 12px 10px 12px' }}>
        Preparation Modules
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(0, 120, 212, 0.2), rgba(0, 188, 242, 0.1))' : 'transparent',
                color: isActive ? '#00BCF2' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={19} color={isActive ? '#00BCF2' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(0, 188, 242, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#00BCF2' : 'var(--text-muted)',
                  fontWeight: 600
                }}>
                  {item.badge}
                </span>
              )}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '15%',
                  bottom: '15%',
                  width: '4px',
                  borderRadius: '0 4px 4px 0',
                  background: '#00BCF2',
                  boxShadow: '0 0 8px #00BCF2'
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile / System Info */}
      <div style={{
        marginTop: 'auto',
        padding: '14px',
        borderRadius: '12px',
        background: 'var(--fluent-surface-2)',
        border: '1px solid var(--fluent-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #107C41, #34D399)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          color: '#ffffff',
          fontSize: '0.9rem'
        }}>
          MS
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Prep Master
          </div>
          <div style={{ fontSize: '0.7rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <Sparkles size={12} /> Target: FAANG / PBC
          </div>
        </div>
      </div>
    </aside>
  );
}
