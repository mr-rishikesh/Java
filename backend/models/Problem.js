const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  problem_id: { type: String, required: true, unique: true },
  problem_name: { type: String, required: true },
  category_id: { type: String, default: '' },
  category_name: { type: String, default: 'General' },
  subcategory_id: { type: String, default: '' },
  subcategory_name: { type: String, default: 'General' },
  article: { type: String, default: null },
  youtube: { type: String, default: null },
  leetcode: { type: String, default: null },
  plus: { type: String, default: null },
  editorial: { type: String, default: null },
  link: { type: String, default: null },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  status: { type: String, enum: ['Unsolved', 'Solved', 'Revising'], default: 'Unsolved' },
  efficiency: { type: Number, min: 0, max: 100, default: 0 },
  userNotes: { type: String, default: '' },
  lastSolvedAt: { type: Date, default: null },
  isCustom: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
