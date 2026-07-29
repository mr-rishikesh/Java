import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function ProjectImprovementModal({ onClose, onAdd, projectList }) {
  const [projectId, setProjectId] = useState(projectList[0]?._id || '');
  const [description, setDescription] = useState('');
  const [efficiency, setEfficiency] = useState(100);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectId || !description.trim()) return;
    onAdd(projectId, {
      description,
      date,
      efficiency: Number(efficiency)
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Log Project Improvement
          </h3>
          <button className="fluent-btn fluent-btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Select Project *
            </label>
            <select
              required
              className="fluent-select"
              style={{ width: '100%', padding: '10px' }}
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projectList.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              What did you improve? * (Features added or bugs fixed)
            </label>
            <textarea
              required
              className="fluent-input"
              rows={3}
              placeholder="e.g., Optimised MongoDB queries by adding compound indexes, reducing response time by 40%."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Date *
              </label>
              <input
                type="date"
                required
                className="fluent-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Efficiency Rating (0-100) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                className="fluent-input"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="fluent-btn fluent-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fluent-btn fluent-btn-primary">
              <Save size={16} /> Save Improvement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
