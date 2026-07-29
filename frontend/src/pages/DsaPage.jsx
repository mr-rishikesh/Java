import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, ExternalLink, BookOpen, PlayCircle, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';
import ProblemModal from '../components/ProblemModal';
import CustomProblemModal from '../components/CustomProblemModal';
import DailyThree from '../components/DailyThree';

export default function DsaPage({ problems, dailyThree, onUpdateStatus, onAddCustom }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showA2Z, setShowA2Z] = useState(false);
  
  const [activeModalProblem, setActiveModalProblem] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todaysSolved = useMemo(() => {
    return problems.filter(p => p.status === 'Solved' && p.lastSolvedAt && new Date(p.lastSolvedAt).toISOString().split('T')[0] === todayStr);
  }, [problems, todayStr]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(problems.map(p => p.category_name).filter(Boolean));
    return Array.from(set);
  }, [problems]);

  // Filter problems
  const filtered = useMemo(() => {
    return problems.filter(p => {
      if (search) {
        const q = search.toLowerCase();
        const matchName = p.problem_name.toLowerCase().includes(q);
        const matchSub = p.subcategory_name && p.subcategory_name.toLowerCase().includes(q);
        if (!matchName && !matchSub) return false;
      }
      if (selectedCategory !== 'ALL' && p.category_name !== selectedCategory) return false;
      if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      return true;
    });
  }, [problems, search, selectedCategory, selectedDifficulty, selectedStatus]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Title & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            DSA Problems Hub (Striver's A2Z Sheet)
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {showA2Z ? `Showing ${filtered.length} of ${problems.length} total curated problems` : "Daily Recommended Challenges"}
          </p>
        </div>

        <button
          onClick={() => setShowCustomModal(true)}
          className="fluent-btn fluent-btn-primary"
        >
          <Plus size={16} /> Add Custom Problem
        </button>
      </div>

      {/* Daily Challenges Widget */}
      <DailyThree 
        problems={dailyThree} 
        onSolve={onUpdateStatus} 
      />

      {/* Today's Solved Problems Section */}
      {todaysSolved.length > 0 && (
        <div className="fluent-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle2 size={16} /> Today's Solved Problems ({todaysSolved.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todaysSolved.map((prob) => (
              <div key={prob._id || prob.problem_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--fluent-surface-2)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--fluent-border)' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{prob.problem_name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '10px' }}>({prob.subcategory_name || prob.category_name})</span>
                </div>
                <span className="fluent-badge badge-solved" style={{ fontSize: '0.72rem' }}>Eff: {prob.efficiency}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button for Full A2Z Sheet */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <button 
          onClick={() => setShowA2Z(!showA2Z)} 
          className="fluent-btn fluent-btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '0.85rem', fontWeight: 700 }}
        >
          <BookOpen size={16} /> {showA2Z ? "Hide Full Striver's A2Z Sheet" : "Explore Full Striver's A2Z Sheet"}
        </button>
      </div>

      {showA2Z && (
        <>

      {/* Filter Control Toolbar */}
      <div className="fluent-card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="fluent-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search problem title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={15} color="var(--text-muted)" />
          <select
            className="fluent-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Select */}
        <select
          className="fluent-select"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Status Select */}
        <select
          className="fluent-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="Unsolved">Unsolved</option>
          <option value="Solved">Solved</option>
          <option value="Revising">Revising</option>
        </select>

        {(search || selectedCategory !== 'ALL' || selectedDifficulty !== 'ALL' || selectedStatus !== 'ALL') && (
          <button
            onClick={() => { setSearch(''); setSelectedCategory('ALL'); setSelectedDifficulty('ALL'); setSelectedStatus('ALL'); }}
            className="fluent-btn fluent-btn-ghost"
            style={{ fontSize: '0.8rem' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Problems Data Table */}
      <div className="fluent-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--fluent-surface-2)', borderBottom: '1px solid var(--fluent-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700, width: '70px' }}>Status</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Problem Name</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Subcategory / Topic</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, width: '100px' }}>Difficulty</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, width: '100px' }}>Efficiency</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, width: '180px' }}>Resource Links</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right', width: '110px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((prob, idx) => {
                const isSolved = prob.status === 'Solved';
                const diffBadge = prob.difficulty === 'Easy' ? 'badge-easy' : prob.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium';

                return (
                  <tr
                    key={prob._id || prob.problem_id || idx}
                    style={{
                      borderBottom: '1px solid var(--fluent-border)',
                      transition: 'background 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--fluent-sidebar-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Status Checkbox */}
                    <td style={{ padding: '12px 18px' }} onClick={(e) => { e.stopPropagation(); onUpdateStatus(prob._id || prob.problem_id, { status: isSolved ? 'Unsolved' : 'Solved', efficiency: isSolved ? 0 : 85 }); }}>
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        border: isSolved ? 'none' : '2px solid var(--fluent-border)',
                        background: isSolved ? '#00BCF2' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}>
                        {isSolved && <CheckCircle2 size={16} color="#ffffff" />}
                      </div>
                    </td>

                    {/* Title */}
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-primary)' }} onClick={() => setActiveModalProblem(prob)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{prob.problem_name}</span>
                        {prob.isCustom && <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(135,100,184,0.2)', color: '#C084FC' }}>Custom</span>}
                      </div>
                    </td>

                    {/* Subcategory */}
                    <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }} onClick={() => setActiveModalProblem(prob)}>
                      {prob.subcategory_name || prob.category_name}
                    </td>

                    {/* Difficulty */}
                    <td style={{ padding: '12px 18px' }} onClick={() => setActiveModalProblem(prob)}>
                      <span className={`fluent-badge ${diffBadge}`}>
                        {prob.difficulty}
                      </span>
                    </td>

                    {/* Efficiency */}
                    <td style={{ padding: '12px 18px' }} onClick={() => setActiveModalProblem(prob)}>
                      {isSolved ? (
                        <span style={{ fontWeight: 700, color: '#00BCF2', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Award size={14} /> {prob.efficiency || 85}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>-</span>
                      )}
                    </td>

                    {/* Resource Links */}
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {prob.leetcode && (
                          <a href={prob.leetcode} target="_blank" rel="noreferrer" title="LeetCode" style={{ color: '#F2C94C' }}>
                            <ExternalLink size={16} />
                          </a>
                        )}
                        {prob.youtube && (
                          <a href={prob.youtube} target="_blank" rel="noreferrer" title="YouTube Video" style={{ color: '#F472B6' }}>
                            <PlayCircle size={16} />
                          </a>
                        )}
                        {prob.article && (
                          <a href={prob.article} target="_blank" rel="noreferrer" title="Article" style={{ color: '#00BCF2' }}>
                            <BookOpen size={16} />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => setActiveModalProblem(prob)}
                        className="fluent-btn fluent-btn-ghost"
                        style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                      >
                        Inspect <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length > 100 && (
          <div style={{ padding: '12px', textAlign: 'center', background: 'var(--fluent-surface-2)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Showing first 100 matches of {filtered.length} total filtered problems. Use search bar to pinpoint specific problems!
          </div>
        )}
      </div>
      </>
      )}

      {/* Modals */}
      {activeModalProblem && (
        <ProblemModal
          problem={activeModalProblem}
          onClose={() => setActiveModalProblem(null)}
          onSave={(id, data) => onUpdateStatus(id, data)}
        />
      )}

      {showCustomModal && (
        <CustomProblemModal
          onClose={() => setShowCustomModal(false)}
          onAdd={onAddCustom}
        />
      )}
    </div>
  );
}
