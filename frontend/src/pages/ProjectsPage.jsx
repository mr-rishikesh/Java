import React, { useState } from 'react';
import { FolderGit2, Plus, Github, ExternalLink, HelpCircle, Code2, Award } from 'lucide-react';
import ProjectModal from '../components/ProjectModal';

export default function ProjectsPage({ projectList, onAddProject, onAddQuestion }) {
  const [showModal, setShowModal] = useState(false);
  const [activeQuestionProj, setActiveQuestionProj] = useState(null);
  const [qText, setQText] = useState('');
  const [qAns, setQAns] = useState('');

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!qText.trim() || !activeQuestionProj) return;
    onAddQuestion(activeQuestionProj._id, { question: qText, answer: qAns, type: 'Architecture' });
    setQText('');
    setQAns('');
    setActiveQuestionProj(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Projects Vault & System Architecture Q&A
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Showcase your projects, tech stack choices, trade-offs, and technical interview questions
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="fluent-btn fluent-btn-primary">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {projectList.map((proj, idx) => (
          <div key={proj._id || idx} className="fluent-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {proj.title}
                  </h3>
                  <span className="fluent-badge badge-solved">
                    {proj.status || 'In Progress'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '900px' }}>
                  {proj.description}
                </p>
              </div>

              {/* Links */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="fluent-btn fluent-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    <Github size={14} /> GitHub
                  </a>
                )}
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="fluent-btn fluent-btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
              {proj.techStack && proj.techStack.map((tech, tIdx) => (
                <span key={tIdx} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'var(--fluent-surface-2)', border: '1px solid var(--fluent-border)', color: '#00BCF2', fontWeight: 600 }}>
                  {tech}
                </span>
              ))}
            </div>

            {/* Project Interview Questions Accordion/Box */}
            <div style={{ background: 'var(--fluent-surface-2)', padding: '16px', borderRadius: '10px', border: '1px solid var(--fluent-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={16} color="#F472B6" /> Technical Interview Questions & Bottlenecks ({proj.questions?.length || 0})
                </h4>

                <button
                  onClick={() => setActiveQuestionProj(proj)}
                  className="fluent-btn fluent-btn-ghost"
                  style={{ fontSize: '0.78rem', color: '#F472B6', padding: '4px 8px' }}
                >
                  <Plus size={14} /> Add Project Q&A
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {proj.questions && proj.questions.length > 0 ? (
                  proj.questions.map((q, qIdx) => (
                    <div key={q._id || qIdx} style={{ background: 'var(--fluent-surface-1)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--fluent-border)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        Q{qIdx + 1}: {q.question}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {q.answer}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    No interview questions added yet for this project. Click 'Add Project Q&A' to document architectural challenges!
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProjectModal onClose={() => setShowModal(false)} onAdd={onAddProject} />
      )}

      {/* Add Question to Project Modal */}
      {activeQuestionProj && (
        <div className="modal-overlay" onClick={() => setActiveQuestionProj(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Add Question for "{activeQuestionProj.title}"
            </h3>
            <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Question</label>
                <input type="text" required className="fluent-input" placeholder="e.g. How did you handle WebSocket disconnections?" value={qText} onChange={(e) => setQText(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Answer / Solution</label>
                <textarea className="fluent-input" rows={3} placeholder="Explain heartbeat pings & exponential backoff..." value={qAns} onChange={(e) => setQAns(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="fluent-btn fluent-btn-secondary" onClick={() => setActiveQuestionProj(null)}>Cancel</button>
                <button type="submit" className="fluent-btn fluent-btn-primary">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
