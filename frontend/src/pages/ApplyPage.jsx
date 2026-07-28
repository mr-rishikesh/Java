import React, { useState } from 'react';
import { Briefcase, Plus, MapPin, DollarSign, Calendar, ExternalLink, HelpCircle, CheckCircle2 } from 'lucide-react';
import JobModal from '../components/JobModal';

export default function ApplyPage({ jobList, onAddJob, onUpdateJobStatus, onAddCompanyQuestion }) {
  const [showModal, setShowModal] = useState(false);
  const [activeJobForQ, setActiveJobForQ] = useState(null);
  const [qText, setQText] = useState('');
  const [qRound, setQRound] = useState('Technical');

  const stages = ['Wishlist', 'Applied', 'Screening', 'Interviewing', 'Offer', 'Rejected'];

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!qText.trim() || !activeJobForQ) return;
    onAddCompanyQuestion(activeJobForQ._id, { question: qText, round: qRound });
    setQText('');
    setActiveJobForQ(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Job Applications Tracker & Company Q&A
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Track application stages, recruitment pipelines, and log company-specific interview questions
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="fluent-btn fluent-btn-primary">
          <Plus size={16} /> Track Application
        </button>
      </div>

      {/* Kanban Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'flex-start' }}>
        {stages.map((stage) => {
          const stageJobs = jobList.filter(j => j.status === stage);
          const stageColor = stage === 'Offer' ? '#34D399' : stage === 'Interviewing' ? '#00BCF2' : stage === 'Rejected' ? '#F472B6' : 'var(--text-secondary)';

          return (
            <div key={stage} style={{ background: 'var(--fluent-surface-1)', borderRadius: '12px', border: '1px solid var(--fluent-border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '400px' }}>
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--fluent-border)' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: stageColor }}>
                  {stage}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: 'var(--fluent-surface-2)', color: 'var(--text-muted)' }}>
                  {stageJobs.length}
                </span>
              </div>

              {/* Cards */}
              {stageJobs.map((job) => (
                <div key={job._id} className="fluent-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {job.company}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#00BCF2', fontWeight: 600 }}>
                        {job.role}
                      </p>
                    </div>

                    {job.jobUrl && (
                      <a href={job.jobUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }} title="Job Link">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {job.location && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {job.location}</div>}
                    {job.salary && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34D399', fontWeight: 600 }}><DollarSign size={12} /> {job.salary}</div>}
                  </div>

                  {job.notes && (
                    <div style={{ fontSize: '0.75rem', background: 'var(--fluent-surface-2)', padding: '8px', borderRadius: '6px', color: 'var(--text-muted)' }}>
                      {job.notes}
                    </div>
                  )}

                  {/* Company Questions */}
                  {job.questions && job.questions.length > 0 && (
                    <div style={{ marginTop: '4px', borderTop: '1px solid var(--fluent-border)', paddingTop: '8px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F472B6', marginBottom: '4px' }}>
                        Interview Questions ({job.questions.length}):
                      </div>
                      {job.questions.map((q, qIdx) => (
                        <div key={qIdx} style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          • [{q.round}] {q.question}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stage Move Dropdown & Add Question */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--fluent-border)' }}>
                    <select
                      className="fluent-select"
                      style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                      value={job.status}
                      onChange={(e) => onUpdateJobStatus(job._id, e.target.value)}
                    >
                      {stages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <button
                      onClick={() => setActiveJobForQ(job)}
                      className="fluent-btn fluent-btn-ghost"
                      style={{ padding: '2px 6px', fontSize: '0.72rem', color: '#F472B6' }}
                    >
                      + Q&A
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {showModal && (
        <JobModal onClose={() => setShowModal(false)} onAdd={onAddJob} />
      )}

      {/* Add Company Question Modal */}
      {activeJobForQ && (
        <div className="modal-overlay" onClick={() => setActiveJobForQ(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Add Question Asked by {activeJobForQ.company}
            </h3>
            <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Interview Round</label>
                <select className="fluent-select" style={{ width: '100%' }} value={qRound} onChange={(e) => setQRound(e.target.value)}>
                  <option value="Online Assessment">Online Assessment (OA)</option>
                  <option value="Technical Round 1">Technical Round 1</option>
                  <option value="System Design">System Design</option>
                  <option value="Hiring Manager / HR">Hiring Manager / HR</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Question Asked</label>
                <input type="text" required className="fluent-input" placeholder="e.g. Reverse nodes in k-group or System Design bottleneck question" value={qText} onChange={(e) => setQText(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="fluent-btn fluent-btn-secondary" onClick={() => setActiveJobForQ(null)}>Cancel</button>
                <button type="submit" className="fluent-btn fluent-btn-primary">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
