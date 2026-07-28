import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function CoreModal({ onClose, onAdd }) {
  const [subject, setSubject] = useState('Operating Systems');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [importance, setImportance] = useState('High');
  const [efficiency, setEfficiency] = useState(85);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    onAdd({
      subject,
      question,
      answer,
      importance,
      efficiency,
      status: 'Learning'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Add Core CS Question
          </h3>
          <button className="fluent-btn fluent-btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Subject / Discipline
            </label>
            <select
              className="fluent-select"
              style={{ width: '100%' }}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="Operating Systems">Operating Systems</option>
              <option value="DBMS">DBMS</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="OOPs">OOPs</option>
              <option value="System Design">System Design</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Question *
            </label>
            <input
              type="text"
              required
              className="fluent-input"
              placeholder="e.g., What is Virtual Memory and Paging?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Core Explanation / Answer
            </label>
            <textarea
              className="fluent-input"
              rows={4}
              placeholder="Provide a concise bulleted answer for rapid revision..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Importance
              </label>
              <select
                className="fluent-select"
                style={{ width: '100%' }}
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
              >
                <option value="High">High (Must Know)</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Mastery Efficiency ({efficiency}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={efficiency}
                onChange={(e) => setEfficiency(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00BCF2', cursor: 'pointer', marginTop: '8px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="fluent-btn fluent-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fluent-btn fluent-btn-primary">
              <Save size={16} /> Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
