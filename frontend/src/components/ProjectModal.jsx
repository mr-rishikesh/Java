import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function ProjectModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStackStr, setTechStackStr] = useState('React, Node.js, Express, MongoDB');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [efficiency, setEfficiency] = useState(90);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const techStack = techStackStr.split(',').map(s => s.trim()).filter(Boolean);
    onAdd({
      title,
      description,
      techStack,
      githubUrl,
      liveUrl,
      status,
      efficiency
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Add Project to Portfolio Vault
          </h3>
          <button className="fluent-btn fluent-btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Project Title *
            </label>
            <input
              type="text"
              required
              className="fluent-input"
              placeholder="e.g., PrepPulse OS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Short Description / Elevator Pitch
            </label>
            <textarea
              className="fluent-input"
              rows={3}
              placeholder="What does this project solve? What makes it impressive?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              className="fluent-input"
              placeholder="React, Node.js, MongoDB, Redis, Docker"
              value={techStackStr}
              onChange={(e) => setTechStackStr(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                GitHub URL
              </label>
              <input
                type="url"
                className="fluent-input"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Live Deployment URL
              </label>
              <input
                type="url"
                className="fluent-input"
                placeholder="https://..."
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="fluent-btn fluent-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fluent-btn fluent-btn-primary">
              <Save size={16} /> Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
