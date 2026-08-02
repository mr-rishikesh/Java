import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function CoreModal({ onClose, onAdd }) {
  const [subject, setSubject] = useState('Core Subject');
  const [workLog, setWorkLog] = useState('');
  const [efficiency, setEfficiency] = useState(90);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workLog.trim()) return;

    // Derive a clean title from the first line or first 80 characters
    const firstLine = workLog.trim().split('\n')[0];
    const derivedTitle = firstLine.length > 80 ? firstLine.substring(0, 80) + '...' : firstLine;

    onAdd({
      subject,
      question: derivedTitle,
      answer: workLog.trim(),
      keyTakeaways: [],
      importance: 'High',
      efficiency,
      status: 'Completed',
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Log Today's Work
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Select category and write your work details for today.
            </p>
          </div>
          <button className="fluent-btn fluent-btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Category Selector */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              Select Work Category *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSubject('Core Subject')}
                className={`fluent-btn ${subject === 'Core Subject' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                style={{ padding: '10px 8px', justifyContent: 'center', fontSize: '0.8rem' }}
              >
                Core Subject
              </button>
              <button
                type="button"
                onClick={() => setSubject('Java')}
                className={`fluent-btn ${subject === 'Java' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                style={{ padding: '10px 8px', justifyContent: 'center', fontSize: '0.8rem' }}
              >
                Java
              </button>
              <button
                type="button"
                onClick={() => setSubject('System')}
                className={`fluent-btn ${subject === 'System' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                style={{ padding: '10px 8px', justifyContent: 'center', fontSize: '0.8rem' }}
              >
                System
              </button>
            </div>
          </div>

          {/* Single Work Log Input Field */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Today's Work Log / Details *
            </label>
            <textarea
              className="fluent-input"
              rows={6}
              required
              placeholder="Write today's work details, code updates, learnings, or system changes here..."
              value={workLog}
              onChange={(e) => setWorkLog(e.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Work Efficiency Rating */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                Work Efficiency Rating
              </label>
              <span style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: '0.85rem' }}>
                {efficiency}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={efficiency}
              onChange={(e) => setEfficiency(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--fluent-blue)', cursor: 'pointer' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="fluent-btn fluent-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fluent-btn fluent-btn-primary">
              <Save size={16} /> Save Work Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
