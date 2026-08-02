import React, { useState } from 'react';
import { Cpu, Plus, CheckCircle2, Award, Clock, BookOpen, Layers, Code2, Terminal } from 'lucide-react';
import CoreModal from '../components/CoreModal';

export default function CorePage({ coreList, onAddCore, onUpdateCore }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  const categories = ['Core Subject', 'Java', 'System'];

  const filtered = selectedCategory === 'ALL'
    ? coreList
    : coreList.filter(item => {
        if (selectedCategory === 'Core Subject') {
          return item.subject === 'Core Subject' || ['Operating Systems', 'DBMS', 'Computer Networks', 'OOPs'].includes(item.subject);
        }
        if (selectedCategory === 'System') {
          return item.subject === 'System' || item.subject === 'System Design';
        }
        return item.subject === selectedCategory;
      });

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Today';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryColor = (cat) => {
    if (cat === 'Java') return '#F59E0B';
    if (cat === 'System' || cat === 'System Design') return '#EC4899';
    return '#38BDF8';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Daily Work Log & Technical Topics
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Document your daily progress across Core CS Subjects, Java Development, and System Architecture
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="fluent-btn fluent-btn-primary" style={{ padding: '10px 18px' }}>
          <Plus size={18} /> Add Work
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`fluent-btn ${selectedCategory === 'ALL' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
        >
          All Work Logs ({coreList.length})
        </button>
        {categories.map(cat => {
          const count = coreList.filter(item => {
            if (cat === 'Core Subject') {
              return item.subject === 'Core Subject' || ['Operating Systems', 'DBMS', 'Computer Networks', 'OOPs'].includes(item.subject);
            }
            if (cat === 'System') {
              return item.subject === 'System' || item.subject === 'System Design';
            }
            return item.subject === cat;
          }).length;

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

      {/* Work Cards Grid - Styled like Project Section Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered && filtered.length > 0 ? (
          filtered.map((item, idx) => {
            const isCompleted = item.status === 'Completed' || item.status === 'Mastered';
            const catColor = getCategoryColor(item.subject);

            return (
              <div
                key={item._id || idx}
                className="fluent-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  border: '1px solid var(--fluent-border)',
                  background: 'var(--fluent-card-bg)'
                }}
              >
                {/* Header Row: Category Badge + Timestamp Badge + Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '6px',
                      background: `rgba(${catColor === '#F59E0B' ? '245, 158, 11' : catColor === '#EC4899' ? '236, 72, 153' : '56, 189, 248'}, 0.15)`,
                      color: catColor,
                      border: `1px solid ${catColor}40`
                    }}>
                      {item.subject}
                    </span>

                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {formatTimestamp(item.createdAt || item.date)}
                    </span>
                  </div>

                  <span className={`fluent-badge ${isCompleted ? 'badge-solved' : 'badge-medium'}`}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                {/* Work Title / Topic */}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {item.question}
                </h3>

                {/* Work Log Description Box */}
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'var(--fluent-surface-2)',
                  border: '1px solid var(--fluent-border)',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.6'
                }}>
                  {item.answer}
                </div>

                {/* Key Takeaways / Tech Stack Pills */}
                {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {item.keyTakeaways.map((tk, tIdx) => (
                      <span key={tIdx} style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'var(--fluent-surface-2)',
                        border: '1px solid var(--fluent-border)',
                        color: 'var(--accent-text)',
                        fontWeight: 600
                      }}>
                        {tk}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--fluent-border)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--fluent-cyan)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={15} /> Efficiency Rating: {item.efficiency || 90}%
                  </span>

                  <button
                    onClick={() => onUpdateCore(item._id, { status: isCompleted ? 'In Progress' : 'Completed' })}
                    className={`fluent-btn ${isCompleted ? 'fluent-btn-secondary' : 'fluent-btn-primary'}`}
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    <CheckCircle2 size={14} /> {isCompleted ? 'Mark In Progress' : 'Mark Completed'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="fluent-card" style={{ padding: '36px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              No work logs found for "{selectedCategory}". Click '+ Add Work' to log your progress!
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <CoreModal onClose={() => setShowModal(false)} onAdd={onAddCore} />
      )}
    </div>
  );
}
