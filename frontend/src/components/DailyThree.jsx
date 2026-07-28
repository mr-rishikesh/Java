import React, { useState } from 'react';
import { Target, ExternalLink, CheckCircle2, PlayCircle, BookOpen, Award, Sparkles } from 'lucide-react';

export default function DailyThree({ problems, onSolve }) {
  const [selectedProb, setSelectedProb] = useState(null);
  const [efficiency, setEfficiency] = useState(100);

  const handleQuickSolve = (prob) => {
    onSolve(prob._id || prob.problem_id, 'Solved', efficiency);
    setSelectedProb(null);
  };

  return (
    <div className="fluent-card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0078D4, #00BCF2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Target size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Today's Daily 3 Random DSA Picks
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Smart selection seeded for today from Striver's A2Z Sheet
            </p>
          </div>
        </div>

        <span className="fluent-badge badge-solved" style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
          <Sparkles size={14} /> Auto-Selected for Today
        </span>
      </div>

      {/* 3 Problem Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {problems && problems.map((prob, idx) => {
          if (!prob) return null;
          const isSolved = prob.status === 'Solved';
          const diffClass = prob.difficulty === 'Easy' ? 'badge-easy' : prob.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium';

          return (
            <div
              key={prob._id || prob.problem_id || idx}
              style={{
                background: 'var(--fluent-surface-2)',
                border: isSolved ? '1px solid rgba(0, 188, 242, 0.4)' : '1px solid var(--fluent-border)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                position: 'relative'
              }}
            >
              <div>
                {/* Top Badge Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Pick #{idx + 1}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className={`fluent-badge ${diffClass}`}>
                      {prob.difficulty || 'Medium'}
                    </span>
                    {isSolved ? (
                      <span className="fluent-badge badge-solved" style={{ gap: '4px' }}>
                        <CheckCircle2 size={12} /> Solved ({prob.efficiency || 100}%)
                      </span>
                    ) : (
                      <span className="fluent-badge badge-unsolved">
                        Unsolved
                      </span>
                    )}
                  </div>
                </div>

                {/* Problem Name */}
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {prob.problem_name}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {prob.subcategory_name || prob.category_name || 'DSA Core'}
                </p>
              </div>

              {/* Resource Links & Solve Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--fluent-border)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {prob.leetcode && (
                    <a
                      href={prob.leetcode}
                      target="_blank"
                      rel="noreferrer"
                      className="fluent-btn fluent-btn-ghost"
                      style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#F2C94C' }}
                      title="LeetCode Link"
                    >
                      <ExternalLink size={14} /> LeetCode
                    </a>
                  )}
                  {prob.youtube && (
                    <a
                      href={prob.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="fluent-btn fluent-btn-ghost"
                      style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#F472B6' }}
                      title="YouTube Video Solution"
                    >
                      <PlayCircle size={14} /> Video
                    </a>
                  )}
                  {prob.article && (
                    <a
                      href={prob.article}
                      target="_blank"
                      rel="noreferrer"
                      className="fluent-btn fluent-btn-ghost"
                      style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#00BCF2' }}
                      title="Read Article"
                    >
                      <BookOpen size={14} /> Article
                    </a>
                  )}
                </div>

                {!isSolved ? (
                  <button
                    onClick={() => setSelectedProb(prob)}
                    className="fluent-btn fluent-btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    Solve Now
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedProb(prob)}
                    className="fluent-btn fluent-btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  >
                    Update Eff.
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Solve Modal */}
      {selectedProb && (
        <div className="modal-overlay" onClick={() => setSelectedProb(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Mark "{selectedProb.problem_name}" Solved
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Rate your solution efficiency (1-100%). High efficiency increases Heatmap color intensity!
            </p>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 700 }}>
                <span>Solution Efficiency Rating</span>
                <span style={{ color: '#00BCF2' }}>{efficiency}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={efficiency}
                onChange={(e) => setEfficiency(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00BCF2', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>50% (Brute force with hints)</span>
                <span>80% (Optimal time)</span>
                <span>100% (Optimal Space & Time)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="fluent-btn fluent-btn-secondary" onClick={() => setSelectedProb(null)}>
                Cancel
              </button>
              <button className="fluent-btn fluent-btn-primary" onClick={() => handleQuickSolve(selectedProb)}>
                <CheckCircle2 size={16} /> Save & Log to Heatmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
