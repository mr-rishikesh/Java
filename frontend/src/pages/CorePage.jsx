import React, { useState } from 'react';
import { Cpu, Plus, CheckCircle2, Award, BookOpen, Layers } from 'lucide-react';
import CoreModal from '../components/CoreModal';

export default function CorePage({ coreList, onAddCore, onUpdateCore }) {
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  const subjects = ['Operating Systems', 'DBMS', 'Computer Networks', 'OOPs', 'System Design'];

  const filtered = selectedSubject === 'ALL' 
    ? coreList 
    : coreList.filter(c => c.subject === selectedSubject);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Core CS Subjects & System Design
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            OS, DBMS, Computer Networks, OOPs, and Scalable System Design Q&A
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="fluent-btn fluent-btn-primary">
          <Plus size={16} /> Add Core Question
        </button>
      </div>

      {/* Subject Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setSelectedSubject('ALL')}
          className={`fluent-btn ${selectedSubject === 'ALL' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
        >
          All Subjects ({coreList.length})
        </button>
        {subjects.map(subj => {
          const count = coreList.filter(c => c.subject === subj).length;
          return (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`fluent-btn ${selectedSubject === subj ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
            >
              {subj} ({count})
            </button>
          );
        })}
      </div>

      {/* Questions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filtered.map((item, idx) => {
          const isMastered = item.status === 'Mastered';

          return (
            <div
              key={item._id || idx}
              className="fluent-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                border: isMastered ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--fluent-border)'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,188,242,0.15)', color: '#00BCF2' }}>
                    {item.subject}
                  </span>
                  <span className={`fluent-badge ${isMastered ? 'badge-easy' : 'badge-medium'}`}>
                    {item.status || 'Learning'}
                  </span>
                </div>

                {/* Question */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {item.question}
                </h3>

                {/* Answer Box */}
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--fluent-surface-2)',
                  border: '1px solid var(--fluent-border)',
                  fontSize: '0.83rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.5'
                }}>
                  {item.answer}
                </div>

                {/* Key Takeaways */}
                {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {item.keyTakeaways.map((tk, tIdx) => (
                      <span key={tIdx} style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px' }}>
                        • {tk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--fluent-border)' }}>
                <span style={{ fontSize: '0.78rem', color: '#00BCF2', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={14} /> Efficiency: {item.efficiency || 85}%
                </span>

                <button
                  onClick={() => onUpdateCore(item._id, { status: isMastered ? 'Learning' : 'Mastered', efficiency: isMastered ? 50 : 95 })}
                  className={`fluent-btn ${isMastered ? 'fluent-btn-secondary' : 'fluent-btn-primary'}`}
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <CheckCircle2 size={14} /> {isMastered ? 'Mark Learning' : 'Mark Mastered'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <CoreModal onClose={() => setShowModal(false)} onAdd={onAddCore} />
      )}
    </div>
  );
}
