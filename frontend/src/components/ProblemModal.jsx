import React, { useState, useEffect } from 'react';
import { ExternalLink, BookOpen, PlayCircle, CheckCircle2, Save, X } from 'lucide-react';

export default function ProblemModal({ problem, onClose, onSave }) {
  if (!problem) return null;

  const [status, setStatus] = useState(problem.status || 'Unsolved');
  const [efficiency, setEfficiency] = useState(problem.efficiency || 80);
  const [userNotes, setUserNotes] = useState(problem.userNotes || '');

  useEffect(() => {
    setStatus(problem.status || 'Unsolved');
    setEfficiency(problem.efficiency || 80);
    setUserNotes(problem.userNotes || '');
  }, [problem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(problem._id || problem.problem_id, {
      status,
      efficiency,
      userNotes
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className={`fluent-badge ${problem.difficulty === 'Easy' ? 'badge-easy' : problem.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'}`}>
                {problem.difficulty}
              </span>
              <span className="fluent-badge badge-unsolved">
                {problem.category_name}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {problem.problem_name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Subcategory: {problem.subcategory_name}
            </p>
          </div>
          <button className="fluent-btn fluent-btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          marginBottom: '24px',
          padding: '14px',
          background: 'var(--fluent-surface-2)',
          borderRadius: '10px',
          border: '1px solid var(--fluent-border)'
        }}>
          {problem.leetcode ? (
            <a href={problem.leetcode} target="_blank" rel="noreferrer" className="fluent-btn fluent-btn-secondary" style={{ justifyContent: 'center', color: '#F2C94C' }}>
              <ExternalLink size={15} /> LeetCode
            </a>
          ) : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>No LeetCode Link</span>}

          {problem.youtube ? (
            <a href={problem.youtube} target="_blank" rel="noreferrer" className="fluent-btn fluent-btn-secondary" style={{ justifyContent: 'center', color: '#F472B6' }}>
              <PlayCircle size={15} /> YouTube Video
            </a>
          ) : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>No Video</span>}

          {problem.article ? (
            <a href={problem.article} target="_blank" rel="noreferrer" className="fluent-btn fluent-btn-secondary" style={{ justifyContent: 'center', color: '#00BCF2' }}>
              <BookOpen size={15} /> Article
            </a>
          ) : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>No Article</span>}
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Status Selection */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              Status
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Unsolved', 'Solved', 'Revising'].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`fluent-btn ${status === st ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Efficiency Rating Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Solution Efficiency Rating
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00BCF2' }}>
                {efficiency}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={efficiency}
              onChange={(e) => setEfficiency(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#00BCF2', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              100% = Optimal Time & Space Complexity | 80% = Optimal Time | 50% = Brute Force
            </p>
          </div>

          {/* User Notes textarea */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              Personal Notes & Approach
            </label>
            <textarea
              className="fluent-input"
              rows={4}
              placeholder="Record intuition, edge cases, space-time complexities, or tricks..."
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="fluent-btn fluent-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fluent-btn fluent-btn-primary">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
