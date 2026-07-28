import React, { useState } from 'react';
import { MessageSquare, Plus, Star, Award, CheckCircle2, Zap } from 'lucide-react';
import CommModal from '../components/CommModal';

export default function CommPage({ commList, onAddComm, onUpdateComm }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['Behavioral', 'Leadership', 'Problem Solving', 'Conflict Resolution', 'HR / Basic'];

  const filtered = selectedCategory === 'ALL'
    ? commList
    : commList.filter(c => c.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Communication & STAR Method Stories
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Craft high-impact Situation, Task, Action, Result responses for behavioral & leadership rounds
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="fluent-btn fluent-btn-primary">
          <Plus size={16} /> Add STAR Story
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`fluent-btn ${selectedCategory === 'ALL' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
        >
          All Stories ({commList.length})
        </button>
        {categories.map(cat => {
          const count = commList.filter(c => c.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`fluent-btn ${selectedCategory === cat ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Stories List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {filtered.map((item, idx) => (
          <div key={item._id || idx} className="fluent-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="fluent-badge badge-revising">
                  {item.category}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={14} /> {item.efficiency || 90}% Impact
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
                "{item.title}"
              </h3>

              {/* STAR Framework Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--fluent-surface-2)', padding: '16px', borderRadius: '10px', border: '1px solid var(--fluent-border)', fontSize: '0.83rem' }}>
                {item.situation && (
                  <div>
                    <strong style={{ color: '#00BCF2', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>S - Situation</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.situation}</span>
                  </div>
                )}
                {item.task && (
                  <div>
                    <strong style={{ color: '#F2C94C', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>T - Task</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.task}</span>
                  </div>
                )}
                {item.action && (
                  <div>
                    <strong style={{ color: '#F472B6', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>A - Action</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.action}</span>
                  </div>
                )}
                {item.result && (
                  <div>
                    <strong style={{ color: '#34D399', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>R - Result & Business Impact</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.result}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer confidence rating toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--fluent-border)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Confidence: <strong style={{ color: item.confidenceLevel === 'High' ? '#34D399' : '#F2C94C' }}>{item.confidenceLevel}</strong>
              </span>

              <button
                onClick={() => onUpdateComm(item._id, { confidenceLevel: item.confidenceLevel === 'High' ? 'Needs Practice' : 'High' })}
                className="fluent-btn fluent-btn-secondary"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              >
                Toggle High Confidence
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CommModal onClose={() => setShowModal(false)} onAdd={onAddComm} />
      )}
    </div>
  );
}
