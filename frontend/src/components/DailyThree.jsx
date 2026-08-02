import React, { useState } from 'react';
import { Target, ExternalLink, CheckCircle2, PlayCircle, BookOpen, Award, Sparkles, Clock, RotateCcw } from 'lucide-react';

export default function DailyThree({ problems, onSolve }) {
  const [selectedProb, setSelectedProb] = useState(null);
  const [efficiency, setEfficiency] = useState(100);
  const [activeSnoozeProbId, setActiveSnoozeProbId] = useState(null);
  const [activeReviseProbId, setActiveReviseProbId] = useState(null);
  const [customReviseDate, setCustomReviseDate] = useState('');
  
  const [tempSnoozeOption, setTempSnoozeOption] = useState('1_month');
  const [tempReviseOption, setTempReviseOption] = useState('1_month');

  const handleQuickSolve = (prob) => {
    onSolve(prob._id || prob.problem_id, { status: 'Solved', efficiency: efficiency });
    setSelectedProb(null);
  };

  const openSnooze = (probId) => {
    setActiveSnoozeProbId(probId);
    setTempSnoozeOption('1_month');
  };

  const openRevise = (probId) => {
    setActiveReviseProbId(probId);
    setTempReviseOption('1_month');
    setCustomReviseDate('');
  };

  const handleSnoozeOption = (prob, option) => {
    onSolve(prob._id || prob.problem_id, { snoozeOption: option });
    setActiveSnoozeProbId(null);
  };

  const handleReviseOption = (prob, durationStr) => {
    let dateVal = null;
    if (durationStr === '2_weeks') {
      dateVal = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    } else if (durationStr === '3_weeks') {
      dateVal = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
    } else if (durationStr === '1_month') {
      dateVal = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (durationStr === '2_months') {
      dateVal = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    }
    onSolve(prob._id || prob.problem_id, { status: 'Revising', snoozeUntil: dateVal });
    setActiveReviseProbId(null);
  };

  const handleCustomRevise = (prob) => {
    if (!customReviseDate) return;
    const targetDate = new Date(customReviseDate);
    const diffMs = targetDate.getTime() - Date.now();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    let snoozeDate = null; // default clear snooze to show immediately before custom date
    if (diffDays > 30 && diffDays <= 60) {
      snoozeDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // snooze for 1 month, show in 2nd month (before custom date)
    } else if (diffDays > 60) {
      snoozeDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // snooze for 2 months, show in 3rd month
    }
    
    onSolve(prob._id || prob.problem_id, { status: 'Revising', snoozeUntil: snoozeDate });
    setActiveReviseProbId(null);
    setCustomReviseDate('');
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
            background: 'var(--fluent-blue)',
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {problems && problems.map((prob, idx) => {
          if (!prob) return null;
          const isSolved = prob.status === 'Solved';
          const diffClass = prob.difficulty === 'Easy' ? 'badge-easy' : prob.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium';
          const probId = prob._id || prob.problem_id;
          const isSnoozing = activeSnoozeProbId === probId;
          const isRevising = activeReviseProbId === probId;

          const hasSnoozeActive = prob.snoozeUntil || prob.neverShow;
          const isRevisingStatus = prob.status === 'Revising';

          return (
            <div
              key={probId || idx}
              style={{
                background: 'var(--fluent-surface-2)',
                border: isSolved ? '1px solid rgba(0, 188, 242, 0.4)' : '1px solid var(--fluent-border)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                position: 'relative',
                minHeight: '220px'
              }}
            >
              {isSnoozing ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  gap: '12px'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      Snooze / Hide Pick
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                      How long would you like to hide "{prob.problem_name}" from recommendations?
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '4px' }}>
                      <button
                        onClick={() => setTempSnoozeOption('1_month')}
                        className={`fluent-btn ${tempSnoozeOption === '1_month' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                        style={{ padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center' }}
                      >
                        1 Month
                      </button>
                      <button
                        onClick={() => setTempSnoozeOption('2_months')}
                        className={`fluent-btn ${tempSnoozeOption === '2_months' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                        style={{ padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center' }}
                      >
                        2 Months
                      </button>
                      <button
                        onClick={() => setTempSnoozeOption('3_months')}
                        className={`fluent-btn ${tempSnoozeOption === '3_months' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                        style={{ padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center' }}
                      >
                        3 Months
                      </button>
                      <button
                        onClick={() => setTempSnoozeOption('never')}
                        className={`fluent-btn ${tempSnoozeOption === 'never' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                        style={{ padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center' }}
                      >
                        Never
                      </button>
                    </div>

                    <button
                      onClick={() => handleSnoozeOption(prob, tempSnoozeOption)}
                      className="fluent-btn fluent-btn-primary"
                      style={{ padding: '8px', fontSize: '0.78rem', justifyContent: 'center' }}
                    >
                      Confirm Snooze
                    </button>
                    
                    <button
                      onClick={() => setActiveSnoozeProbId(null)}
                      className="fluent-btn fluent-btn-ghost"
                      style={{ fontSize: '0.74rem', padding: '4px', justifyContent: 'center', color: 'var(--text-muted)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : isRevising ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  gap: '12px'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      Schedule Revision
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                      Reschedule "{prob.problem_name}" to reappear in daily picks after:
                    </p>
                  </div>
                  
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '4px' }}>
                        <button
                          onClick={() => { setTempReviseOption('2_weeks'); setCustomReviseDate(''); }}
                          className={`fluent-btn ${tempReviseOption === '2_weeks' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                          style={{ padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center' }}
                        >
                          2 Weeks
                        </button>
                        <button
                          onClick={() => { setTempReviseOption('3_weeks'); setCustomReviseDate(''); }}
                          className={`fluent-btn ${tempReviseOption === '3_weeks' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                          style={{ padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center' }}
                        >
                          3 Weeks
                        </button>
                        <button
                          onClick={() => { setTempReviseOption('1_month'); setCustomReviseDate(''); }}
                          className={`fluent-btn ${tempReviseOption === '1_month' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                          style={{ padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center' }}
                        >
                          1 Month
                        </button>
                        <button
                          onClick={() => { setTempReviseOption('2_months'); setCustomReviseDate(''); }}
                          className={`fluent-btn ${tempReviseOption === '2_months' ? 'fluent-btn-primary' : 'fluent-btn-secondary'}`}
                          style={{ padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center' }}
                        >
                          2 Months
                        </button>
                      </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                      <input
                        type="date"
                        value={customReviseDate}
                        onChange={(e) => {
                          setCustomReviseDate(e.target.value);
                          setTempReviseOption('custom');
                        }}
                        style={{
                          padding: '6px',
                          fontSize: '0.72rem',
                          background: 'var(--fluent-surface-2)',
                          border: tempReviseOption === 'custom' ? '2px solid #00BCF2' : '1px solid var(--fluent-border)',
                          borderRadius: '4px',
                          color: 'var(--text-primary)',
                          flex: 1
                        }}
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (tempReviseOption === 'custom') {
                          handleCustomRevise(prob);
                        } else {
                          handleReviseOption(prob, tempReviseOption);
                        }
                      }}
                      className="fluent-btn fluent-btn-primary"
                      style={{ padding: '8px', fontSize: '0.78rem', justifyContent: 'center' }}
                      disabled={tempReviseOption === 'custom' && !customReviseDate}
                    >
                      Confirm Revision
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveReviseProbId(null);
                        setCustomReviseDate('');
                      }}
                      className="fluent-btn fluent-btn-ghost"
                      style={{ fontSize: '0.74rem', padding: '4px', justifyContent: 'center', color: 'var(--text-muted)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                        {isRevisingStatus ? (
                          <span className="fluent-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', gap: '4px', display: 'inline-flex', alignItems: 'center' }}>
                            <RotateCcw size={12} /> Revision Due
                          </span>
                        ) : isSolved ? (
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
                  </div>

                  {/* Resource Links & Solve Button - Stacked for responsive layout */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--fluent-border)' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {prob.leetcode && (
                        <a
                          href={prob.leetcode}
                          target="_blank"
                          rel="noreferrer"
                          className="fluent-btn fluent-btn-ghost"
                          style={{ padding: '6px 8px', fontSize: '0.78rem', color: '#F2C94C' }}
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
                          style={{ padding: '6px 8px', fontSize: '0.78rem', color: '#F472B6' }}
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
                          style={{ padding: '6px 8px', fontSize: '0.78rem', color: '#00BCF2' }}
                          title="Read Article"
                        >
                          <BookOpen size={14} /> Article
                        </a>
                      )}
                      {!isSolved && (
                        <button
                          onClick={() => openSnooze(probId)}
                          className="fluent-btn fluent-btn-ghost"
                          style={{ 
                            padding: '6px 8px', 
                            fontSize: '0.78rem', 
                            color: hasSnoozeActive ? '#F2C94C' : 'var(--text-muted)',
                            fontWeight: hasSnoozeActive ? '700' : 'normal'
                          }}
                          title="Snooze / Hide Pick"
                        >
                          <Clock size={14} /> Snooze
                        </button>
                      )}
                      <button
                        onClick={() => openRevise(probId)}
                        className="fluent-btn fluent-btn-ghost"
                        style={{ 
                          padding: '6px 8px', 
                          fontSize: '0.78rem', 
                          color: isRevisingStatus ? '#10B981' : 'var(--text-muted)',
                          fontWeight: isRevisingStatus ? '700' : 'normal'
                        }}
                        title="Schedule Revision"
                      >
                        <RotateCcw size={14} /> Revise
                      </button>
                    </div>

                    {!isSolved ? (
                      <button
                        onClick={() => setSelectedProb(prob)}
                        className="fluent-btn fluent-btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.82rem', width: '100%', justifyContent: 'center' }}
                      >
                        Solve Now
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedProb(prob)}
                        className="fluent-btn fluent-btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}
                      >
                        Update Efficiency
                      </button>
                    )}
                  </div>
                </>
              )}
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
