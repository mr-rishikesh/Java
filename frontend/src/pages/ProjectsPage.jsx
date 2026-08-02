import React, { useState } from 'react';
import { FolderGit2, Plus, Github, ExternalLink, HelpCircle, Code2, Award, ArrowLeft, ArrowRight } from 'lucide-react';
import ProjectModal from '../components/ProjectModal';
import ProjectImprovementModal from '../components/ProjectImprovementModal';

export default function ProjectsPage({ projectList, onAddProject, onAddQuestion, onAddImprovement }) {
  const [showModal, setShowModal] = useState(false);
  const [showImprovementModal, setShowImprovementModal] = useState(false);
  const [activeQuestionProj, setActiveQuestionProj] = useState(null);
  const [qText, setQText] = useState('');
  const [qAns, setQAns] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeSection, setActiveSection] = useState(null); // 'questions', 'improvements', or null

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!qText.trim() || !activeQuestionProj) return;
    onAddQuestion(activeQuestionProj._id, { question: qText, answer: qAns, type: 'Architecture' });
    setQText('');
    setQAns('');
    setActiveQuestionProj(null);
  };

  const selectedProject = projectList.find(proj => proj._id === selectedProjectId);

  // Detail Sub-page View
  if (selectedProject) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Back navigation */}
        <div>
          <button
            onClick={() => { setSelectedProjectId(null); setActiveSection(null); }}
            className="fluent-btn fluent-btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>
        </div>

        {/* Project Card Info Overview */}
        <div className="fluent-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedProject.title}
                </h3>
                <span className="fluent-badge badge-solved">
                  {selectedProject.status || 'In Progress'}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '900px', lineHeight: '1.5' }}>
                {selectedProject.description}
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedProject.githubUrl && (
                <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="fluent-btn fluent-btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Github size={16} /> GitHub
                </a>
              )}
              {selectedProject.liveUrl && (
                <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="fluent-btn fluent-btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedProject.techStack && selectedProject.techStack.map((tech, tIdx) => (
              <span key={tIdx} style={{ fontSize: '0.78rem', padding: '6px 12px', borderRadius: '6px', background: 'var(--fluent-surface-2)', border: '1px solid var(--fluent-border)', color: 'var(--accent-text)', fontWeight: 600 }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Two Options (Click to view details) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '10px' }}>
          {/* Option 1: Interview Questions */}
          <div
            onClick={() => setActiveSection(activeSection === 'questions' ? null : 'questions')}
            className={`fluent-card ${activeSection === 'questions' ? 'fluent-card-glow' : ''}`}
            style={{
              cursor: 'pointer',
              border: activeSection === 'questions' ? '2px solid #E3008C' : '1px solid var(--fluent-border)',
              transition: 'all 0.2s ease',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(227, 0, 140, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E3008C',
              flexShrink: 0
            }}>
              <HelpCircle size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Interview Questions
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Review technical questions, architectural trade-offs, and system bottlenecks.
              </p>
              <span style={{ fontSize: '0.75rem', color: '#E3008C', fontWeight: 700, display: 'block', marginTop: '8px' }}>
                {selectedProject.questions?.length || 0} Questions Available
              </span>
            </div>
          </div>

          {/* Option 2: Improvements */}
          <div
            onClick={() => setActiveSection(activeSection === 'improvements' ? null : 'improvements')}
            className={`fluent-card ${activeSection === 'improvements' ? 'fluent-card-glow' : ''}`}
            style={{
              cursor: 'pointer',
              border: activeSection === 'improvements' ? '2px solid #10B981' : '1px solid var(--fluent-border)',
              transition: 'all 0.2s ease',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
              flexShrink: 0
            }}>
              <Code2 size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Improvements
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Track performance optimization logs, feature updates, and bug fixes.
              </p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, display: 'block', marginTop: '8px' }}>
                {selectedProject.improvements?.length || 0} Logs Tracked
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Sections (Revealed on click of Option) */}
        {activeSection === 'questions' && (
          <div className="fluent-card" style={{ padding: '24px', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--fluent-border)', paddingBottom: '12px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={18} color="#E3008C" /> Technical Interview Questions & Bottlenecks
              </h4>
              <button
                onClick={() => setActiveQuestionProj(selectedProject)}
                className="fluent-btn fluent-btn-primary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <Plus size={14} /> Add Project Q&A
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedProject.questions && selectedProject.questions.length > 0 ? (
                selectedProject.questions.map((q, qIdx) => (
                  <div key={q._id || qIdx} style={{ background: 'var(--fluent-surface-2)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--fluent-border)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Q{qIdx + 1}: {q.question}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {q.answer}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                  No interview questions added yet for this project. Click 'Add Project Q&A' to document architectural challenges!
                </p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'improvements' && (
          <div className="fluent-card" style={{ padding: '24px', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--fluent-border)', paddingBottom: '12px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code2 size={18} color="#10B981" /> Features & Bug Fixes Improvements
              </h4>
              <button
                onClick={() => setShowImprovementModal(true)}
                className="fluent-btn fluent-btn-primary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <Plus size={14} /> Add Improvements
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedProject.improvements && selectedProject.improvements.length > 0 ? (
                selectedProject.improvements.map((imp, impIdx) => (
                  <div key={imp._id || impIdx} style={{ background: 'var(--fluent-surface-2)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--fluent-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '0 0 4px 0', lineHeight: '1.4' }}>
                        {imp.description}
                      </p>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Logged on: {imp.date}
                      </span>
                    </div>
                    <span className="fluent-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      Eff: {imp.efficiency}%
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                  No improvements logged yet. Click 'Add Improvements' to record your updates!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Modal Overlay for Add Question */}
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

        {showImprovementModal && (
          <ProjectImprovementModal
            onClose={() => setShowImprovementModal(false)}
            onAdd={onAddImprovement}
            projectList={projectList}
          />
        )}
      </div>
    );
  }

  // Summary Projects List (Default View)
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

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowImprovementModal(true)} className="fluent-btn fluent-btn-secondary">
            <Plus size={16} /> Add Improvements
          </button>
          <button onClick={() => setShowModal(true)} className="fluent-btn fluent-btn-primary">
            <Plus size={16} /> Add Project
          </button>
        </div>
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

              {/* Links and CTA */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="fluent-btn fluent-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    <Github size={14} /> GitHub
                  </a>
                )}
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="fluent-btn fluent-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    <ExternalLink size={14} /> Live
                  </a>
                )}
                <button
                  onClick={() => setSelectedProjectId(proj._id)}
                  className="fluent-btn fluent-btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  View Details <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {proj.techStack && proj.techStack.map((tech, tIdx) => (
                <span key={tIdx} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'var(--fluent-surface-2)', border: '1px solid var(--fluent-border)', color: 'var(--accent-text)', fontWeight: 600 }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProjectModal onClose={() => setShowModal(false)} onAdd={onAddProject} />
      )}

      {showImprovementModal && (
        <ProjectImprovementModal
          onClose={() => setShowImprovementModal(false)}
          onAdd={onAddImprovement}
          projectList={projectList}
        />
      )}
    </div>
  );
}
