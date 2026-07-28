import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function CommModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Behavioral');
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState('High');
  const [efficiency, setEfficiency] = useState(90);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title,
      category,
      situation,
      task,
      action,
      result,
      confidenceLevel,
      efficiency
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Add STAR Method Behavioral Prep Question
          </h3>
          <button className="fluent-btn fluent-btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Question Title *
            </label>
            <input
              type="text"
              required
              className="fluent-input"
              placeholder="e.g., Tell me about a time you led under pressure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Category
            </label>
            <select
              className="fluent-select"
              style={{ width: '100%' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Behavioral">Behavioral</option>
              <option value="Leadership">Leadership</option>
              <option value="Problem Solving">Problem Solving</option>
              <option value="Conflict Resolution">Conflict Resolution</option>
              <option value="HR / Basic">HR / Basic</option>
            </select>
          </div>

          {/* STAR Framework Inputs */}
          <div style={{ background: 'var(--fluent-surface-2)', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid var(--fluent-border)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#00BCF2' }}>
              ⭐ STAR Response Framework Builder
            </h4>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>S - Situation (Background context)</label>
              <textarea className="fluent-input" rows={2} value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="During sprint 4 on the payments team..." />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>T - Task (Your specific responsibility)</label>
              <textarea className="fluent-input" rows={2} value={task} onChange={(e) => setTask(e.target.value)} placeholder="I was responsible for mitigating the API latency..." />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>A - Action (Key steps YOU took)</label>
              <textarea className="fluent-input" rows={2} value={action} onChange={(e) => setAction(e.target.value)} placeholder="I implemented Redis caching and query batching..." />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>R - Result (Measurable outcome & business impact)</label>
              <textarea className="fluent-input" rows={2} value={result} onChange={(e) => setResult(e.target.value)} placeholder="Reduced response times by 65% and prevented downtime..." />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="fluent-btn fluent-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fluent-btn fluent-btn-primary">
              <Save size={16} /> Save STAR Response
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
