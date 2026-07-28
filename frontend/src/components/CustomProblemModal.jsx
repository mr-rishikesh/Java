import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function CustomProblemModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Custom');
  const [subcategory, setSubcategory] = useState('General Practice');
  const [difficulty, setDifficulty] = useState('Medium');
  const [leetcode, setLeetcode] = useState('');
  const [article, setArticle] = useState('');
  const [youtube, setYoutube] = useState('');
  const [userNotes, setUserNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      problem_name: name,
      category_name: category,
      subcategory_name: subcategory,
      difficulty,
      leetcode,
      article,
      youtube,
      userNotes
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Add Custom DSA Problem
          </h3>
          <button className="fluent-btn fluent-btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Problem Title *
            </label>
            <input
              type="text"
              required
              className="fluent-input"
              placeholder="e.g., Trapping Rain Water"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Category
              </label>
              <input
                type="text"
                className="fluent-input"
                placeholder="e.g., Dynamic Programming"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Subcategory / Topic
              </label>
              <input
                type="text"
                className="fluent-input"
                placeholder="e.g., 2D DP"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Difficulty
            </label>
            <select
              className="fluent-select"
              style={{ width: '100%' }}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              LeetCode Link
            </label>
            <input
              type="url"
              className="fluent-input"
              placeholder="https://leetcode.com/problems/..."
              value={leetcode}
              onChange={(e) => setLeetcode(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Notes / Key Intuition
            </label>
            <textarea
              className="fluent-input"
              rows={3}
              placeholder="Key observations..."
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="fluent-btn fluent-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fluent-btn fluent-btn-primary">
              <Plus size={16} /> Add Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
