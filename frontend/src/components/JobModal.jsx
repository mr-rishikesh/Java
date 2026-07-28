import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function JobModal({ onClose, onAdd }) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [location, setLocation] = useState('Remote / Hybrid');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Applied');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    onAdd({
      company,
      role,
      location,
      salary,
      status,
      jobUrl,
      notes
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Track New Job Application
          </h3>
          <button className="fluent-btn fluent-btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Company Name *
              </label>
              <input
                type="text"
                required
                className="fluent-input"
                placeholder="e.g., Microsoft"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Role *
              </label>
              <input
                type="text"
                required
                className="fluent-input"
                placeholder="e.g., Software Engineer II"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Stage / Status
              </label>
              <select
                className="fluent-select"
                style={{ width: '100%' }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Expected Salary / Range
              </label>
              <input
                type="text"
                className="fluent-input"
                placeholder="e.g., $180k - $220k"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Job Posting URL
            </label>
            <input
              type="url"
              className="fluent-input"
              placeholder="https://careers..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Interview Notes & Recruiter Contacts
            </label>
            <textarea
              className="fluent-input"
              rows={3}
              placeholder="Recruiter email, referral details, interview dates..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="fluent-btn fluent-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fluent-btn fluent-btn-primary">
              <Save size={16} /> Track Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
